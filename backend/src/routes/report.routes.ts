import { Router } from "express";
import { getReportTeam } from "../controllers/report.controller";
import { isRole } from "../middlewares/check_role";

const reportRouter = Router()

reportRouter.get('/team', isRole(['admin', 'participant']), getReportTeam)

export default reportRouter