import { Submission } from "@/types/api";
import axiosInstace from "../axios";

export async function getAllSubmissions(): Promise<Submission[]> {
    const res = await axiosInstace.get("/submissions")
    return res.data.data
}

export async function deleteSubmission(id: number) {
    const res = await axiosInstace.delete(`/submissions/${id}`)
    return res.data
}

export async function updateSuubmission(id: number, status: string): Promise<Submission> {
    const res = await axiosInstace.put(`/submissions/${id}`, { status })
    return res.data.data
}