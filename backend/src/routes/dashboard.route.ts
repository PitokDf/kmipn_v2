import { Router } from "express";
import { getDashboarAdminController, getDashboardData } from "../controllers/dashboard.controller";

const dashboardRouter = Router()

dashboardRouter.get("/participant", getDashboardData)
dashboardRouter.get("/admin", getDashboarAdminController)

export default dashboardRouter