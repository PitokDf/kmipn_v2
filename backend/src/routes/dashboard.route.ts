import { Router } from "express";
import { getDashboarAdminController, getDashboardData } from "../controllers/dashboard.controller";
import { isRole } from "../middlewares/check_role";

const dashboardRouter = Router()

dashboardRouter.get("/participant", isRole(['admin', 'participant']), getDashboardData)
dashboardRouter.get("/admin", isRole(['admin', 'operator']), getDashboarAdminController)

export default dashboardRouter