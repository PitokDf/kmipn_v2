import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import { handlerAnyError } from "../errors/api_errors";
import { getAllTeamService } from "../services/team.service";
import { getAllDataCategory } from "../services/categori.service";

export async function getReportTeam(req: Request, res: Response<ResponseApiType>) {
    try {
        const teams = await getAllTeamService()
        const categories = await getAllDataCategory()

        const totTeam = teams.length
        const totTeamWithSubmission = teams.filter((team) => team.Submission).length
        const participantRate = (totTeamWithSubmission / totTeam) * 100
        const teamsByCategory = categories.map(c => ({
            name: c.categoriName,
            count: c.Team.length
        }))

        const categoryDistribution = categories.map((category) => {
            const name = category.categoriName
            const totalTeam = category.Team.length
            const percent = (totalTeam / totTeam) * 100

            return {
                name, totalTeam, percent
            }
        })

        return res.status(200).json({
            success: true,
            message: "berhasil mendapatkan data laporan tim",
            data: {
                totalTeam: totTeam,
                totalTeamWithSubmission: totTeamWithSubmission,
                participantRate,
                teamsByCategory,
                categoryDistribution
            }
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}