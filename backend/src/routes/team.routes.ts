import { Router } from "express";
import { deleteTeamController, getAllTeamController, getInfoSubmissionController, verifyTeam } from "../controllers/team.controller";

const teamRouter = Router()

teamRouter.get("/", getAllTeamController)
teamRouter.get("/:id/submission", getInfoSubmissionController)
teamRouter.delete("/:id", deleteTeamController)
teamRouter.post("/verify/:teamID", verifyTeam)

export default teamRouter