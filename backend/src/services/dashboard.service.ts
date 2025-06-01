import { prisma } from "../configs/prisma";

export async function getDashboardParticipantDataService(userId: string) {
    const userTeam = await prisma.teamMember.findUnique({
        where: {
            userId: userId,
        },
        select: {
            Team: {
                select: {
                    Lecture: { select: { name: true, nip: true } },
                    id: true,
                    name: true,
                    verified: true,
                    Category: { select: { categoriName: true } },
                    institution: true,
                    Proposal: {
                        select: {
                            status: true,
                        },
                    },
                    Submission: {
                        select: {
                            status: true,
                            round: true,
                        },
                        orderBy: { id: "desc" }
                    },
                    TeamMember: {
                        select: {
                            name: true,
                            role: true,
                            nim: true
                        },
                    },
                },
            },
        },
    });

    return userTeam
}

export default async function getDashboarAdminService() {
    const countTeam = await prisma.team.count()
    const proposals = await prisma.proposal.findMany({
        select: {
            status: true,
            Team: { select: { name: true } },
            createdAt: true,
            title: true
        },
        orderBy: { createdAt: "desc" }
    })
    const categories = await prisma.category.findMany({
        select: { categoriName: true, Team: { select: { _count: true } } }
    })
    const recentTeam = await prisma.team.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            name: true,
            createdAt: true,
            Category: { select: { categoriName: true } },
        },
        take: 5
    })

    return { countTeam, proposals, categories, recentTeam }
}