import { Router } from "express";
import { getTeamMemberByUserID, saveTeamMember } from "../controllers/team_member.controller";
import { uploadDrive } from "../middlewares/multerDrive";

const teamMemberRouter = Router()

teamMemberRouter.get("/", getTeamMemberByUserID)
teamMemberRouter.post(
    "/",
    uploadDrive.fields([
        { name: 'ktm_agg1', maxCount: 1 },
        { name: 'ktm_agg2', maxCount: 1 },
        { name: 'ktm_agg3', maxCount: 1 }
    ]),
    saveTeamMember
);
// teamMemberRouter.get("/", getTeamMemberByUserID)

export default teamMemberRouter