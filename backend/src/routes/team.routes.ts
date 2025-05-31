import { Router } from "express";
import { deleteTeamController, getAllTeamController, verifyTeam } from "../controllers/team.controller";

const teamRouter = Router()

teamRouter.get("/", getAllTeamController)
teamRouter.delete("/:id", deleteTeamController)
teamRouter.post("/verify/:teamID", verifyTeam)

export default teamRouter