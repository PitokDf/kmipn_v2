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