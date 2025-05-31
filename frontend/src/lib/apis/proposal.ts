import { Proposal } from "@/types/api";
import axiosInstace from "../axios";

export async function uploadProposal(data: { title: string, comments: string, file: any }, callback: (percent: number) => number) {
    const res = await axiosInstace.post("/proposals", data, {
        headers: {
            'Content-Type': "multipart/form-data"
        },
        onUploadProgress: (progres) => {
            const percent = Math.round(
                (progres.loaded * 100) / (progres.total || 1)
            )
            callback(percent)
        }
    })
    return res.data
}

export async function getProposalTeam(): Promise<Proposal> {
    const res = await axiosInstace.get("/proposals/proposal-team")
    return res.data.data
}

export async function downloadApprovedProposal() {
    const res = await axiosInstace.get("proposals/download-approved", { responseType: "blob" })
    return res
}

export async function getAllProposal(): Promise<Omit<Proposal, "deadline" | "creadAt">[]> {
    const res = await axiosInstace.get("/proposals")
    return res.data.data
}

export async function reviewProposal(data: { status: string, comments: string, id: number }) {
    const res = await axiosInstace.post(`/proposals/${data.id}/review`, data)
    return res.data
}

export async function deleteProposal(id: number) {
    const res = await axiosInstace.delete(`/proposals/${id}`)
    return res.data
}

export async function replaceFileProposal(id: number, data: FormData) {
    const res = await axiosInstace.post(`/proposals/${id}/replace`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })

    return res.data
}