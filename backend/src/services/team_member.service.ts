import { RoleTeamMember } from "@prisma/client"
import { prisma } from "../configs/prisma";
import { AppError } from "../errors/api_errors";

export const createTeamMember = async (teamId: number, userId: string,
    role: RoleTeamMember, nim: string, name: string, email: string, no_WA: string,
    prodi: string, fileKtmId: string) => {
    const teamMember = await prisma.teamMember.create({
        data: {
            teamId: teamId, userId: userId, role: role,
            nim: nim, name: name, email: email, noWa: no_WA, prodi: prodi, fileKtmId: fileKtmId
        }
    });

    if (!teamMember) throw new AppError("Failed save team member,", 400);
    return teamMember;
}

export const getTeamMemberByUserIDService = async (userID: string) => {
    const teamMemberByUser = await prisma.teamMember.findUnique({
        where: { userId: userID }, include: {
            Team: { include: { Lecture: true, Category: true, TeamMember: { orderBy: { role: "asc" } } } },
        }
    });
    if (!teamMemberByUser) throw new AppError("Team member not found", 404);
    return teamMemberByUser;
}

export async function getAllTeamMemberService() {
    const teamMembers = await prisma.teamMember.findMany({
        select: {
            name: true,
            nim: true,
            prodi: true,
            noWa: true,
            email: true,
            role: true,
            Team: {
                select: {
                    name: true,
                    institution: true,
                },
            },
        },
        where: {
            Team: {
                NOT: { verified: false }
            }
        },
        orderBy: {
            Team: { name: "asc" }
        }
    })

    return teamMembers
}