import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import { handlerAnyError } from "../errors/api_errors";
import getDashboarAdminService, { getDashboardParticipantDataService, getStats } from "../services/dashboard.service";

export async function getDashboardData(req: Request, res: Response<ResponseApiType>) {
    try {
        const user = (req as any).user

        const infor = await getDashboardParticipantDataService(user.id)
        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data.",
            data: {
                id: infor?.Team.id,
                name: infor?.Team.name,
                lecture: {
                    name: infor?.Team.Lecture.name,
                    nip: infor?.Team.Lecture.nip
                },
                verified: infor?.Team.verified,
                category: infor?.Team.Category.categoriName,
                institution: infor?.Team.institution,
                proposal: infor?.Team.Proposal.pop()?.status,
                submission: infor?.Team.Submission[0],
                teamMember: infor?.Team.TeamMember
            }
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function getDashboarAdminController(req: Request, res: Response<ResponseApiType>) {
    try {
        const data = await getDashboarAdminService()
        const dashboarData = {
            totalTeam: data.countTeam,
            submittedProposal: data.proposals.length,
            rejectedProposal: data.proposals.filter(p => p.status === "rejected").length,
            pendingProposal: data.proposals.filter(p => p.status === "pending").length,
            approveProposal: data.proposals.filter(p => p.status === "approve").length,
            teamCategoryData: data.categories.map(c => ({
                name: c.categoriName,
                count: c.Team.length
            })),
            recentTeams: data.recentTeam.map(t => ({
                teamName: t.name,
                createdAt: t.createdAt,
                category: t.Category.categoriName
            })),
            recentProposal: data.proposals.slice(0, 5).map(p => ({
                proposalTitle: p.title,
                proposalTeam: p.Team.name,
                createdAt: p.createdAt
            }))
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data",
            data: dashboarData
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function getStatsController(req: Request, res: Response<ResponseApiType>) {
    try {
        const {
            categoryStats,
            institutionStats,
            proposalStatusStats,
            scoreDistributionData,
            submissionStats,
            verifiedTeamStats
        } = await getStats()

        const scoreDistribution = {
            '90-100': 0,
            '80-89': 0,
            '70-79': 0,
            '60-69': 0,
            '< 60': 0
        }

        const defaultStatusProposalMap = {
            approve: 0,
            pending: 0,
            rejected: 0
        }

        const defaultStatusTeamMap = {
            "Terverifikasi": 0,
            "Belum Terverifikasi": 0
        }

        const defaultRoundSubmissionMap = {
            "Penyisihan": 0,
            "Final": 0
        }

        verifiedTeamStats.forEach((team) => {
            defaultStatusTeamMap[team.verified ? "Terverifikasi" : "Belum Terverifikasi"] = team._count
        })

        proposalStatusStats.forEach((proposal) => {
            defaultStatusProposalMap[proposal.status] = proposal._count
        })

        const categoryStatsData = categoryStats.map((category) => ({
            category: category.categoriName,
            count: category._count.Team
        }))

        const institutionStatsData = institutionStats.map((institution) => ({
            institution: institution.institution,
            count: institution._count
        }))

        const proposalStatusStatsData = [
            { status: "Disetujui", value: defaultStatusProposalMap.approve },
            { status: "Pending", value: defaultStatusProposalMap.pending },
            { status: "Ditolak", value: defaultStatusProposalMap.rejected }
        ]

        submissionStats.forEach((sub) => {
            defaultRoundSubmissionMap[sub.round === "preliminary" ? "Penyisihan" : "Final"] = sub._count
        })

        const submissionStatsData = [
            { round: "Penyisihan", count: defaultRoundSubmissionMap.Penyisihan },
            { round: "Final", count: defaultRoundSubmissionMap.Final },
        ]

        const verifiedTeamStatsData = [
            { status: "Terverifikasi", count: defaultStatusTeamMap.Terverifikasi },
            { status: "Belum Terverifikasi", count: defaultStatusTeamMap["Belum Terverifikasi"] },
        ]

        scoreDistributionData.forEach(({ score }) => {
            if (score >= 90) scoreDistribution['90-100']++;
            else if (score >= 80) scoreDistribution['80-89']++;
            else if (score >= 70) scoreDistribution['70-79']++;
            else if (score >= 60) scoreDistribution['60-69']++;
            else scoreDistribution['< 60']++;
        })

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data",
            data: {
                categoryStatsData,
                institutionStatsData,
                proposalStatusStatsData,
                scoreDistribution: Object.entries(scoreDistribution).map(([range, value]) => ({
                    range, value
                })),
                submissionStatsData,
                verifiedTeamStatsData,
                timestamps: new Date().toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit"
                })
            }
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}