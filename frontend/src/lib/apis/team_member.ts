import { TeamMemberData } from "@/types/api";
import axiosInstace from "../axios";

export async function getTeamMemberByUserID(): Promise<TeamMemberData> {
    const res = await axiosInstace.get("/team-member")
    return res.data.data
}

export async function saveTeamMember(data: any) {
    console.log("DATA:", data);

    const res = await axiosInstace.post("/team-member", data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })
    return res.data
}