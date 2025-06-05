import { Timeline } from "@prisma/client";
import { prisma } from "../configs/prisma";

export class TimelineService {

    async getAllTimelines(): Promise<Timeline[]> {
        return await prisma.timeline.findMany()
    }

    async createTimeline(data: Pick<Timeline, 'title' | 'startTime' | 'endTime' | 'description'>): Promise<Timeline> {
        const newtTimeline = await prisma.timeline.create({
            data
        })

        return newtTimeline
    }

    async updateTimeLine(id: number, data: { title?: string, startTime?: Date, endTime?: Date, description?: string }) {
        return prisma.timeline.update({
            where: { id },
            data
        })
    }

    async deleteTimeline(id: number) {
        return prisma.timeline.delete({ where: { id } })
    }
}