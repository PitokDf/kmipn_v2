import path from "path";
import { $Enums } from "@prisma/client";
import { prisma } from "../configs/prisma";
import { AppError } from "../errors/api_errors";
import { deleteFileFromDrive } from "./google_drive.service";
import { readHtmlFile } from "../utils/read_html_file";
import { replacePlaceholders } from "../utils/replace_placeholder";
import { sendEmail } from "../utils/mailer";
import { env } from "../configs/env";

export const createProposalService =
    async (teamID: number, fileId: string, filelink: string, fileName: string, fileSize: number, type: string, originalName: string, path: string, title: string, comments: string
    ) => {
        const transaction = await prisma.$transaction(async () => {
            const file = await prisma.file.create({
                data: {
                    id: fileId, fileName, fileSize, type, originalName, path, usage: "proposal"
                }
            });
            const proposal = await prisma.proposal.create(
                {
                    data:
                        { teamId: teamID, fileId: file.id, title: title, comments: comments }
                });
            return { file, proposal }
        });
        if (!transaction) throw new AppError("Failed create proposal", 400);
        return transaction.file;
    }

export async function getProposalTeamService(teamId: number) {
    const team = await prisma.team.findFirst({
        where: { id: teamId },
        include: {
            Category: { select: { deadline: true } },
            Proposal: { select: { id: true } }
        },
    })
    const proposal = await prisma.proposal.findFirst({
        where: { teamId },
        include: { File: true },
        orderBy: { createdAt: "desc" }
    })

    return { ...proposal, ...team, proposalID: proposal?.id, proposolUpdatedAt: proposal?.updatedAt }
}

export const getProposalService = async () => {
    const proposals = await prisma.proposal.findMany({ include: { assesment: true, Team: { include: { Category: { select: { categoriName: true } } } }, File: true }, orderBy: { createdAt: "desc" } })
    if (!proposals) throw new AppError("Terjadi masalah saat mengambil data.", 400);
    return proposals;
}

export const deleteProposalService = async (id: number) => {
    const proposal = await prisma.proposal.findUnique({ where: { id: Number(id) } });
    if (!proposal) throw new AppError("Proposal tidak ditemukan", 404);

    await deleteFileFromDrive(proposal?.fileId!)
    await prisma.proposal.delete({ where: { id: Number(id) } });
    await prisma.file.delete({ where: { id: proposal.fileId! } });
    return proposal;
}

export const updateProposalService = async (id: number, status: $Enums.StatusProposal, comments?: string) => {
    const proposal = await prisma.proposal.findUnique({
        where: { id: Number(id) },
        include: {
            Team: {
                select: {
                    TeamMember: {
                        where: { role: "leader" },
                        select: {
                            User: { select: { id: true, email: true } }
                        }
                    },
                    name: true
                }
            }
        }
    });
    if (!proposal) throw new AppError("Proposal tidak ditemukan", 404);

    await prisma.proposal.update({ where: { id: Number(id) }, data: { comments: comments, status } });
    const filePath = path.join(__dirname, '../templates/TeamReview.html')
    let emailContent = await readHtmlFile(filePath);
    const link_dashboard = `${env.frontendUrl}/participant/proposal`;
    const placeholders = {
        "{{ nama_tim }}": proposal.Team.name,
        "{{ judul_proposal }}": proposal.title,
        "{{ status_review }}": status || "pending",
        "{{ isi_feedback }}": comments || "",
        "{{ link_dashboard }}": link_dashboard
    };
    emailContent = replacePlaceholders(emailContent, placeholders)
    await sendEmail(proposal.Team.TeamMember[0].User?.email!, "Proposal review", emailContent);
    return proposal;
}

export const getAllproposalAproveServices = async (category?: string) => {
    let where: any = {}
    if (category && category !== "all") {
        where.Team = { Category: { categoriName: category } }
    }

    const approvedProposal = await prisma.proposal.findMany({
        include: { File: true, Team: true },
        where
    });

    return approvedProposal;
}


export async function replaceFileProposalService
    (proposalID: number, fileId: string, fileLink: string, fileName: string, fileSize: number, originalName: string) {

    const proposal = await prisma.proposal.findFirst({
        where: { id: proposalID },
        select: { fileId: true }
    })


    const tr = await prisma.$transaction(async (tr) => {
        // update table file
        const file = await tr.file.update({
            where: { id: proposal?.fileId! },
            data: {
                id: fileId,
                fileName: fileName,
                fileSize: fileSize,
                originalName: originalName,
                path: fileLink,
            }
        })

        // update table proposal
        const propo = await tr.proposal.update({
            where: { id: proposalID },
            data: {
                fileId: fileId,
                status: "pending",
            },
            include: { Team: { select: { name: true } } }
        })


        return { file, ...propo }
    })
    await deleteFileFromDrive(proposal?.fileId!)
    return tr
}