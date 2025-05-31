import { $Enums } from "@prisma/client";
import { prisma } from "../configs/prisma";

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
        include: { Team: { select: { name: true } } }
    })

    if (submission.round === "preliminary" && submission.status === "passed") {
        const data = { ...submission, status: "pending", round: "final" }
        console.log(data);

        await prisma.submission.create({
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

    return deleted
}