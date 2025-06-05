import { Router } from "express";
import { downloadAttendace, getTeamMemberByUserID, saveTeamMember } from "../controllers/team_member.controller";
import { uploadDrive } from "../middlewares/multerDrive";
import { isRole } from "../middlewares/check_role";

const teamMemberRouter = Router()

teamMemberRouter.get("/", getTeamMemberByUserID)
teamMemberRouter.post(
    "/",
    isRole(['participant']),
    uploadDrive.fields([
        { name: 'ktm_agg1', maxCount: 1 },
        { name: 'ktm_agg2', maxCount: 1 },
        { name: 'ktm_agg3', maxCount: 1 }
    ]),
    saveTeamMember
);
teamMemberRouter.get("/download-list-members", isRole(['admin', 'operator']), downloadAttendace)

export default teamMemberRouter