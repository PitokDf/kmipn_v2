import { Router } from "express";
import { uploadDrive } from "../middlewares/multerDrive";
import {
    createSubmissionController,
    deleteSubmissionController,
    downloadAllSubmission,
    getAllSubmissionController,
    updateSubmissionController
} from "../controllers/submission.controller";
import { isRole } from "../middlewares/check_role";

const submissionRouter = Router()

submissionRouter.post("/", isRole(['participant']), uploadDrive.single('file'), createSubmissionController)
submissionRouter.get("/", isRole(['admin', 'operator']), getAllSubmissionController)
submissionRouter.put("/:id", isRole(['admin', 'operator']), updateSubmissionController)
submissionRouter.delete("/:id", isRole(['admin', 'operator']), deleteSubmissionController)
submissionRouter.get("/download", isRole(['admin', 'operator']), downloadAllSubmission)

export default submissionRouter