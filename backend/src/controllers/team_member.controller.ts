import { Request, Response } from "express"
import { getTeamMemberByUserIDService } from "../services/team_member.service";
import { handlerAnyError } from "../errors/api_errors";
import { ResponseApiType } from "../types/api_types";
import { $Enums } from "@prisma/client";
import { uploadFileToDrive } from "../services/google_drive.service";
import { prisma } from "../configs/prisma";
import { generateToken } from "../utils/jwt";
import { emitToAdmin } from "../socket";
// import { createTeamMember, getTeamMemberByUserIDService } from "../services/TeamMemberService";
// import { AppError } from "../utils/AppError";
// import { ResponseApi } from "../types/ApiType";
// import { userLogin } from "../config/jwt";
// import { unVerifyTeamService, verifyTeamService } from "../services/TeamService";
// import path from "path";
// import { readHtmlFile } from "../utils/readHtmlFile";
// import { replacePlaceholders } from "../utils/replacePlaceholder";
// import { sendEmail } from "../utils/NodeMailer";
// import { db } from "../config/database";
// import fs from "fs";
// import { $Enums } from "@prisma/client";
// import { pusher } from "../config/pusher";
// import { createObjectCsvWriter } from "csv-writer";
// import { format } from "@fast-csv/format";
// import { uploadFileToDrive } from "../services/GoogleDriveServices";

type clientInput = {
    name: string,
    nim: string,
    noWa: string,
    email: string,
    prodi: string
}

type members = {
    id?: number;
    teamId: number;
    userId: string | null;
    role: $Enums.RoleTeamMember;
    nim: string;
    name: string;
    email: string;
    no_WA: string;
    prodi: string;
    fileKTM: string;
    createdAt?: Date;
}

// export const storeTeamMember = async (req: Request, res: Response<ResponseApi>) => {
//     try {
//         const { type } = req.query;
//         const fileName = `${process.env.BASEURl}/${type}/${req.file?.filename}`;
//         const { teamId, userId, role, nim, name, email, no_WA, prodi } = req.body;

//         const teamMember = await createTeamMember(Number(teamId), userId, role, nim, name, email, no_WA, prodi, fileName!);
//         res.cookie("teamDataCompleate", true, { httpOnly: true, secure: true, sameSite: "strict" });
//         return res.status(201).json({ success: true, statusCode: 201, msg: "Successfully save team member.", data: teamMember })
//     } catch (error) {
//         if (error instanceof AppError) {
//             return res.status(error.statusCode).json({
//                 success: false,
//                 statusCode: error.statusCode,
//                 msg: error.message
//             });
//         }
//         return res.status(500).json({
//             success: false,
//             statusCode: 500,
//             msg: "Internal server error: " + error
//         });
//     }
// }


export const saveTeamMember = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body.supervisor || !body.nip || !body.teamName || !body.category || !body.polytechnic) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                msg: "Isi semua bidang yang yang dibutuhkan!"
            })
        }

        const dataLecture = {
            name: body.supervisor,
            nip: body.nip
        }

        const dataTeam = {
            name: body.teamName,
            categoryID: body.category,
            institution: body.polytechnic
        }

        const user = (req as any).user
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_KTM_ID || ""
        const files = req.files as Record<string, Express.Multer.File[]>;
        const clientInputMembers: clientInput[] = body.members;
        let dataMembers: members[] = [];
        let index = 0;

        for (const fieldName in files) {
            if (Object.prototype.hasOwnProperty.call(files, fieldName)) {
                const file = files[fieldName][0];
                const fileBuffer = file.buffer;
                const fileName = file.originalname;
                const mimeType = file.mimetype;
                const member = clientInputMembers[index];
                const uploadResult = await uploadFileToDrive(fileBuffer, fileName, mimeType, folderId)

                dataMembers.push({
                    email: member.email,
                    userId: index === 0 ? user.id : null,
                    no_WA: member.noWa,
                    prodi: member.prodi,
                    teamId: 0,
                    role: index === 0 ? "leader" : "member",
                    name: member.name,
                    nim: member.nim,
                    fileKTM: `https://drive.google.com/uc?id=${uploadResult.id}`
                })

                index++;
            }
        }


        const tr = prisma.$transaction(async () => {
            const newLecture = await prisma.lecture.create({
                data: {
                    name: dataLecture.name,
                    nip: dataLecture.nip
                }
            });

            const newTeam = await prisma.team.create(
                {
                    data:
                        { institution: dataTeam.institution, name: dataTeam.name, categoryID: Number(dataTeam.categoryID), lectureID: newLecture.id }
                }
            );

            dataMembers.forEach((member) => {
                member.teamId = newTeam.id;
            })
            await prisma.teamMember.createMany({ skipDuplicates: true, data: dataMembers })
            return { team_name: newTeam.name }
        }, { timeout: 10000 })

        const token = await generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            verified: user.verified,
            role: user.role,
            teamDataCompleate: true
        })

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
            path: "/",
            maxAge: 15 * 60 * 60 * 1000
        })

        emitToAdmin("team:new", { message: `Tim "${body.teamName}" baru saja terdaftar` })

        return res.status(201).json({
            success: true,
            statusCode: 201,
            msg: "Berhasil menambahkan team dan member baru",
            data: req.files,
            teamDataCompleate: true
        });
    } catch (error: any) {
        return handlerAnyError(error, res)
    }
}


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
                noWA: member.no_WA,
                role: member.role,
                prodi: member.prodi,
                fileKTM: member.fileKTM
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

// export const verifyTeam = async (req: Request, res: Response<ResponseApi>) => {
//     try {
//         const { teamID } = req.params;
//         const verifyTeam = await verifyTeamService(Number(teamID));

//         const leaderTeam = verifyTeam.teamMembers.filter((member) => { return member.role === "leader" })

//         // mengirim email verifikasi ke user
//         const filePath = path.join(__dirname, '../templates/TeamVerifyNotif.html')
//         let emailContent = await readHtmlFile(filePath);
//         const link_to_dashboard = `${process.env.FRONTEND_URL}/participant`;
//         emailContent = replacePlaceholders(emailContent, {
//             "{{ nama_ketua }}": leaderTeam[0].name,
//             "{{ nama_team }}": verifyTeam.name,
//             "{{ link_to_dashboard }}": link_to_dashboard
//         })
//         const sendEmailSuccess = await sendEmail(leaderTeam[0].email, "Team Verified", emailContent);
//         // jika email verifikasi gagal terkirim maka lempar error dan hapus user
//         if (!sendEmailSuccess) {
//             unVerifyTeamService(Number(teamID));
//             throw new AppError("Failed send email", 400);
//         }
//         await pusher.trigger(`team-${teamID}`, "team-verify", {
//             message: "Tim kamu baru saja di verifikasi oleh admin KMIPN."
//         });

//         return res.status(200).json({ success: true, statusCode: 200, msg: "Successfully verify team.", data: { verifyTeam, leaderTeam } })
//     } catch (error) {
//         if (error instanceof AppError) {
//             return res.status(error.statusCode).json({
//                 success: false,
//                 statusCode: error.statusCode,
//                 msg: error.message
//             });
//         }
//         return res.status(500).json({
//             success: false,
//             statusCode: 500,
//             msg: "Internal server error: " + error
//         });
//     }
// }

// export const completeTeam = async (req: Request, res: Response<ResponseApi>) => {

// }

// export const generateAttedance = async () => {
//     const attendace = await db.teamMember.findMany({
//         select: {
//             name: true, nim: true, prodi: true, team: { select: { name: true, institution: true } }
//         }
//     });

//     const filePath = 'attendace.csv';
//     const csvWritter = createObjectCsvWriter({
//         path: filePath,
//         header: [
//             { id: 'name', title: "Nama" },
//             { id: 'nim', title: "NIM" },
//             { id: 'prodi', title: "Prodi" },
//             { id: 'teamName', title: "Nama Team" },
//             { id: 'institution', title: "Asal Politeknik" }
//         ]
//     });

//     const records = attendace.map((member) => ({
//         name: member.name,
//         nim: member.nim,
//         prodi: member.prodi,
//         teamName: member.team.name,
//         institution: member.team.institution
//     }));

//     await csvWritter.writeRecords(records);
// }

// export const downloadAttendace = async (req: Request, res: Response) => {
//     try {
//         // Ambil data dari database
//         const attendance = await db.teamMember.findMany({
//             select: {
//                 name: true,
//                 nim: true,
//                 prodi: true,
//                 team: {
//                     select: {
//                         name: true,
//                         institution: true,
//                     },
//                 },
//             },
//             where: {
//                 team: {
//                     NOT: { verified: false }
//                 }
//             },
//             orderBy: {
//                 team: { name: "asc" }
//             }
//         });

//         // Set header untuk download file
//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', 'attachment; filename="attendance.csv"');

//         // Stream CSV ke client
//         const csvStream = format({ headers: true });
//         csvStream.pipe(res);

//         // Masukkan data ke stream
//         attendance.forEach((member) => {
//             csvStream.write({
//                 Name: member.name,
//                 NIM: member.nim,
//                 Prodi: member.prodi,
//                 'Team Name': member.team.name,
//                 Institution: member.team.institution,
//             });
//         });

//         // Akhiri stream
//         csvStream.end();
//     } catch (error) {
//         console.error('Error generating CSV:', error);
//         res.status(500).json({ message: 'Error generating CSV' });
//     }
// }