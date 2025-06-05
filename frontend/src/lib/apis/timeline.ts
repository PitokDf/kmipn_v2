import { Timeline } from "@/types/api";
import axiosInstace from "../axios";

export async function getAllTimeline(): Promise<Timeline[]> {
    const res = await axiosInstace.get('/timelines')
    return res.data.data
}

export async function createTimeline(data: Pick<Timeline, 'title' | 'description' | 'startTime' | 'endTime'>):
    Promise<Timeline> {
    const res = await axiosInstace.post('/timelines', data)
    return res.data.data
}

export async function updateTimeline(data: Pick<Timeline, 'id' | 'title' | 'description' | 'startTime' | 'endTime'>):
    Promise<Timeline> {
    const res = await axiosInstace.patch(`/timelines/${data.id}`, data)
    return res.data.data
}

export async function deleteTimeline(id: number): Promise<Timeline> {
    const res = await axiosInstace.delete(`/timelines/${id}`)
    return res.data.data
}