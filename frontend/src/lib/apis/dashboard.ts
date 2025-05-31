import { DashboardAdmin, DashboardData } from "@/types/api";
import axiosInstace from "../axios";

export async function getDashboardParticipantData(): Promise<DashboardData> {
    const res = await axiosInstace.get("/dashboard/participant")
    return res.data.data
}

export async function getDashboardAdminData(): Promise<DashboardAdmin> {
    const res = await axiosInstace.get("/dashboard/admin")
    return res.data.data
}

export interface Data {
    totalTeam: number
    totalTeamWithSubmission: number
    participantRate: number
    teamsByCategory: TeamsByCategory[]
    categoryDistribution: CategoryDistribution[]
}

export interface TeamsByCategory {
    name: string
    count: number
}

export interface CategoryDistribution {
    name: string
    totalTeam: number
    percent: number
}

export async function getReportTeam(): Promise<Data> {
    const res = await axiosInstace.get("/reports/team")
    return res.data.data
}