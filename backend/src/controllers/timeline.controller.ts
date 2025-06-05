import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import { TimelineService } from "../services/timeline.service";
import { handlerAnyError } from "../errors/api_errors";
import { successResponse } from "../utils/response";

const timelineService = new TimelineService()

export class TimelineController {
    static async getTimeline(req: Request, res: Response<ResponseApiType>) {
        try {
            const timelines = await timelineService.getAllTimelines()

            return successResponse(res, "Berhasil mendapatkan semua timeline", timelines)
        } catch (error) {
            return handlerAnyError(error, res)
        }
    }

    static async createTimeline(req: Request, res: Response<ResponseApiType>) {
        try {
            const { title,
                description,
                endTime,
                startTime } = req.body

            const timeline = await timelineService.createTimeline({
                title,
                description,
                endTime,
                startTime
            })

            return successResponse(res, "Berhasil menambahkan timeline baru", timeline, 201)

        } catch (error) {
            return handlerAnyError(error, res)
        }
    }

    static async updateTimeline(req: Request, res: Response<ResponseApiType>) {
        try {
            const { id } = req.params
            const { title,
                description,
                endTime,
                startTime } = req.body

            const timeline = await timelineService.updateTimeLine(Number(id), {
                title,
                description,
                endTime,
                startTime
            })

            return successResponse(res, "Berhasil mengupdate timeline", timeline)
        } catch (error) {
            return handlerAnyError(error, res)
        }
    }

    static async deleteTimeline(req: Request, res: Response<ResponseApiType>) {
        try {
            const { id } = req.params

            const timeline = await timelineService.deleteTimeline(Number(id))

            return successResponse(res, "Berhasil menghapus timeline", timeline)
        } catch (error) {
            return handlerAnyError(error, res)
        }
    }
}