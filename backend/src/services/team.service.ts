import { prisma } from "../configs/prisma";
import { AppError } from "../errors/api_errors";

export async function getAllTeamService() {
    const teams = await prisma.team.findMany({
        include: {
            Category: { select: { categoriName: true } },
            Lecture: { select: { name: true } },
            TeamMember: true,
            Proposal: { select: { fileLink: true } },
            Submission: { select: { id: true, title: true } }
        }
    })

    return teams
}

export async function deleteTeamService(id: number) {
    const deletedTeam = await prisma.team.delete({ where: { id } })

    return deletedTeam
}

export async function verifyTeamService(teamID: number) {
    const verifiedTeam = await prisma.team.update({
        include: { TeamMember: true },
        where: {
            id: teamID
        }, data: { verified: true }
    });

    if (!verifiedTeam) throw new AppError("Failed verified team", 400);
    return verifiedTeam;
}


export const unVerifyTeamService = async (teamID: number) => {
    const unverifiedTeam = await prisma.team.update({
        where: { id: teamID },
        data: { verified: false }
    });

    if (!unverifiedTeam) throw new AppError("Failed unverified team", 400);
    return unverifiedTeam;
}

export async function getInfoSubmissionService(userId: string) {
    const team = await prisma.team.findFirst({
        where: { TeamMember: { every: { userId } } },
        select: { Submission: { take: 1, orderBy: { id: "desc" } }, Category: { select: { categoriName: true } } }
    })

    return { ...team?.Submission[0], category: team?.Category.categoriName }
}