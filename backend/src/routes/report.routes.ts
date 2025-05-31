import { Router } from "express";
import { getReportTeam } from "../controllers/report.controller";

const reportRouter = Router()

reportRouter.get('/team', getReportTeam)

export default reportRouter