import { $Enums } from "@prisma/client";
import { prisma } from "../configs/prisma";
import { deleteFileFromDrive } from "./google_drive.service";

export async function createSubmissionService(
    description: string,
    fileUrl: string,
    githubUrl: string,
    teamId: number,
    title: string,
    fileName: string
) {
    const submission = await prisma.submission.create({
        data: {
            description,
            fileUrl,
            githubUrl,
            teamId,
            title,
            fileName,
            round: "preliminary"
        }
    })

    return submission
}

export async function getAllSubmission() {
    const submissions = await prisma.submission.findMany({
        orderBy: { updatedAt: "asc" },
        include: { Team: true }
    })

    return submissions
}

export async function updateSubmissionService(id: number, status: $Enums.statusSubmission) {
    const submission = await prisma.submission.update({
        where: { id },
        data: { status },
        include: { Team: { include: { TeamMember: { where: { role: "leader" }, select: { userId: true } } } } }
    })


    if (submission.round === "preliminary" && submission.status === "passed") {
        const existing = await prisma.submission.findFirst({
            where: {
                teamId: submission.teamId, round: "final"
            }
        })

        !existing && await prisma.submission.create({
            data: {
                Team: { connect: { id: submission.teamId } },
                round: "final",
                status: "pending",
                title: submission.title,
                description: submission.description,
                fileName: submission.fileName,
                fileUrl: submission.fileUrl,
                githubUrl: submission.githubUrl
            }
        })
    }

    return submission
}

export async function deleteSubmissionService(id: number) {
    const deleted = await prisma.submission.delete({
        where: { id },
        include: { Team: { select: { name: true } } }
    })
    const teams = await prisma.submission.findMany({ where: { teamId: deleted.teamId } })

    if (teams.length == 0) {
        const fileId = deleted.fileUrl?.match(/\/d\/(.+?)\//)?.[1]
        await deleteFileFromDrive(fileId!)
    }

    return deleted
}