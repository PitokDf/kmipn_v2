import { Team } from "@/types/api";
import axiosInstace from "../axios";

export async function getAllTeams(): Promise<Team[]> {
    const res = await axiosInstace.get("/teams")
    return res.data.data
}

export async function deleteTeam(id: number) {
    const res = await axiosInstace.delete(`/teams/${id}`)
    return res.data
}

export async function verifyTeam(teamID: number) {
    const res = await axiosInstace.post(`/teams/verify/${teamID}`)
    return res.data
}