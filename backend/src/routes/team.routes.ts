import { Router } from "express";
import { deleteTeamController, getAllTeamController, getInfoSubmissionController, verifyTeam } from "../controllers/team.controller";
import { isRole } from "../middlewares/check_role";

const teamRouter = Router()

teamRouter.get("/", isRole(['admin', 'operator']), getAllTeamController)
teamRouter.get("/:id/submission", isRole(['participant']), getInfoSubmissionController)
teamRouter.delete("/:id", isRole(['admin', 'operator']), deleteTeamController)
teamRouter.post("/verify/:teamID", isRole(['admin', 'operator']), verifyTeam)

export default teamRouter