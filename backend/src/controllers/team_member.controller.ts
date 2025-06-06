import { Request, Response } from "express"
import { getAllTeamMemberService, getTeamMemberByUserIDService } from "../services/team_member.service";
import { handlerAnyError } from "../errors/api_errors";
import { ResponseApiType } from "../types/api_types";
import { $Enums, File, TeamMember } from "@prisma/client";
import { createDriveFolder, uploadFileToDrive } from "../services/google_drive.service";
import { prisma } from "../configs/prisma";
import { generateToken } from "../utils/jwt";
import { emitToAdmin } from "../socket";
import { format } from "@fast-csv/format";
import { env } from "../configs/env";

export const saveTeamMember = async (req: Request, res: Response) => {
    try {
        const { supervisor, nip, teamName, category, polytechnic, members } = req.body;

        if (!supervisor || !nip || !teamName || !category || !polytechnic) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                msg: "Isi semua bidang yang yang dibutuhkan!"
            });
        }

        const user = (req as any).user;
        const files = req.files as Record<string, Express.Multer.File[]>;

        // --- Step 1: Upload file ke Google Drive & insert ke table File satu per satu
        const fileMemberPairs: {
            file: File;
            member: Omit<TeamMember, 'id' | 'createdAt'>;
        }[] = [];

        const ktmFolderId = await createDriveFolder(teamName, env.folderKtmId);
        const submissionFolderId = await createDriveFolder(teamName, env.folderSubmissionId);

        for (let index = 0; index < members.length; index++) {
            const member = members[index];
            const fileField = Object.keys(files)[index];
            const file = files[fileField]?.[0];

            if (!file) continue;

            // Upload file ke Google Drive
            const uploadResult = await uploadFileToDrive(
                file.buffer,
                file.originalname,
                file.mimetype,
                ktmFolderId
            );

            // Insert ke tabel File
            const newFile = await prisma.file.create({
                data: {
                    id: uploadResult.id!,
                    fileName: file.originalname,
                    fileSize: file.size,
                    originalName: file.originalname,
                    path: `https://drive.google.com/uc?export=view&id=${uploadResult.id}`,
                    type: file.mimetype,
                    usage: "ktm"
                }
            });

            // Siapin data anggota untuk insert ke TeamMember
            fileMemberPairs.push({
                file: newFile,
                member: {
                    name: member.name,
                    nim: member.nim,
                    email: member.email,
                    noWa: member.noWa,
                    prodi: member.prodi,
                    role: index === 0 ? "leader" : "member",
                    userId: index === 0 ? user.id : null,
                    teamId: 0, // sementara, nanti diisi setelah tim-nya dibuat
                    fileKtmId: newFile.id
                }
            });
        }

        // --- Step 2: Jalankan transaksi
        const result = await prisma.$transaction(async (tx) => {
            // Insert Dosen Pembimbing
            const newLecture = await tx.lecture.create({
                data: {
                    name: supervisor,
                    nip: nip
                }
            });

            // Insert Team
            const newTeam = await tx.team.create({
                data: {
                    name: teamName,
                    institution: polytechnic,
                    categoryId: Number(category),
                    lectureId: newLecture.id,
                    submissionFolderId,
                    ktmFolderId
                }
            });

            // Update semua member dengan teamId baru
            const membersToCreate = fileMemberPairs.map(({ member }) => ({
                ...member,
                teamId: newTeam.id
            }));

            // Insert anggota tim
            await tx.teamMember.createMany({ data: membersToCreate });

            return newTeam;
        });

        // --- Step 3: Generate token baru dengan `teamDataComplete: true`
        const token = await generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            verified: user.verified,
            role: user.role,
            teamDataCompleate: true
        });

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            path: "/",
            maxAge: 15 * 60 * 60 * 1000
        });

        // Emit notifikasi real-time ke admin
        emitToAdmin("team:new", { message: `Tim "${teamName}" baru saja terdaftar` });

        return res.status(201).json({
            success: true,
            statusCode: 201,
            msg: "Berhasil menambahkan tim dan anggota!",
            teamDataCompleate: true
        });

    } catch (error: any) {
        return handlerAnyError(error, res);
    }
};



export const getTeamMemberByUserID = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const user = (req as any).user
        const teamMember = await getTeamMemberByUserIDService(String(user.id));
        const dataMap = {
            teamID: teamMember.teamId,
            teamName: teamMember.Team.name,
            categori: teamMember.Team.Category.categoriName,
            institution: teamMember.Team.institution,
            lectureName: teamMember.Team.Lecture.name,
            teamMembers: teamMember.Team.TeamMember.map((member) => ({
                name: `${member.name}`,
                nim: member.nim,
                email: member.email,
                noWA: member.noWa,
                role: member.role,
                prodi: member.prodi,
                fileKTM: member.fileKtmId
            })),
        }
        return res.status(200).json({
            success: true,
            message: "Successfully get team member",
            data: dataMap
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export const downloadAttendace = async (req: Request, res: Response) => {
    try {
        // Ambil data dari database

        const attendance = await getAllTeamMemberService()

        // Set header untuk download file
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="list-members.csv"');

        // Stream CSV ke client
        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        // Masukkan data ke stream
        attendance.forEach((member) => {
            csvStream.write({
                'Nama Tim': member.Team.name,
                "Status Tim": member.Team.verified ? "Terverifikasi" : "Belum Diverifikasi",
                "Nama Anggota": member.name,
                NIM: member.nim,
                Prodi: member.prodi,
                "Nomor WhatsApp": member.noWa,
                "Peran": member.role === "leader" ? "Ketua" : "Anggota",
                Email: member.email,
                "Asal Politeknik": member.Team.institution,
                "Link KTM": member.fileKtm?.path
            });
        });

        // Akhiri stream
        csvStream.end();
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({ message: 'Error generating CSV' });
    }
}