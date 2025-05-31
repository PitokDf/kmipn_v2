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