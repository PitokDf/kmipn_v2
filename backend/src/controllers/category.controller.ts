import { Request, Response } from "express";
import { addCategoriService, deleteCategoryService, getAllDataCategory, getCategoryStats, updateCategoryService } from "../services/categori.service";
// import { ResponseApi } from "../types/ApiType";
// import { AppError } from "../utils/AppError";
// import { validationResult } from "express-validator";
import { ResponseApiType } from "../types/api_types";
import { handlerAnyError } from "../errors/api_errors";

const now = new Date()

export const getAllCategory = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')
        const sendData = async () => {
            const categori = await getAllDataCategory();
            return res.write(`data: ${JSON.stringify({ success: true, data: categori })}\n\n`)
        };

        const intervalId = setInterval(sendData, 5000)

        req.on('close', () => { clearInterval(intervalId); res.end(); })
    } catch (error) {
        res.write(`data: ${JSON.stringify({ success: false, msg: "Internal server error" })}\n\n`);
        res.end();
    }
}

export const getAllCategoryClose = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const categori = await getAllDataCategory();
        return res.status(200).json({
            success: true,
            message: "Successfully get data",
            data: categori
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}

export async function getCategoryStatsController(req: Request, res: Response<ResponseApiType>) {
    try {
        const categories = await getCategoryStats();

        const categoryStats = categories.map(c => {
            const teams = c.Team.length;
            const proposals = c.Team.filter(t => t.Proposal.length > 0).length;
            const submissions = c.Team.filter(t => t.Submission).length
            const deadline = new Date(c.deadline)
            const timeDiff = deadline.getTime() - now.getTime()
            const daysUntilDeadline = Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0); // biar gak minus
            const submissionRate = teams > 0 ? Math.round((submissions / teams) * 100) : 0;

            return {
                name: c.categoriName,
                teams,
                proposals,
                daysUntilDeadline,
                submissionRate
            };
        })

        const totProposals = categories.reduce((cur, val) => {
            const proposal = val.Team.filter(t => t.Proposal.length).length
            return cur + proposal
        }, 0)

        const totSubmission = categories.reduce((cur, val) => {
            const submission = val.Team.filter(t => t.Submission).length
            return cur + submission
        }, 0)

        const teamTot = categories.reduce((c, cur) => {
            return c + cur.Team.length
        }, 0)

        return res.status(200).json({
            success: true,
            message: "Successfully get data",
            data: {
                categoryStats,
                totalTeams: teamTot,
                totalProposals: totProposals,
                submissionRate: (totSubmission / teamTot) * 100,
            }
        })
    } catch (error) {
        return handlerAnyError(error, res)
    }
}
export const updateCategory = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { id } = req.params
        const { categoriName, description, deadline } = req.body
        const convertDeadline = new Date(deadline);
        const updatedCategory = await updateCategoryService(Number(id), categoriName, description, convertDeadline);
        return res.status(200).json({ success: true, message: "Successfully update category", data: updatedCategory })
    } catch (error: any) {
        return handlerAnyError(error, res)
    }
}

export const createCategory = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { categoriName, description, deadline } = req.body;
        const convertDeadline = new Date(deadline);
        console.log(deadline);

        const newCategory = await addCategoriService(categoriName, description, convertDeadline);
        return res.status(200).json({ success: true, message: "Successfully added category", data: newCategory })
    } catch (error: any) {
        return handlerAnyError(error, res)
    }
}

export const deleteCategory = async (req: Request, res: Response<ResponseApiType>) => {
    try {
        const { id } = req.params;
        const deletedCategory = await deleteCategoryService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Successfully delete category",
            data: deletedCategory
        });
    } catch (error) {
        return handlerAnyError(error, res)
    }
}