import { Router } from "express";
import { uploadDrive } from "../middlewares/multerDrive";
import {
    createSubmissionController,
    deleteSubmissionController,
    downloadAllSubmission,
    getAllSubmissionController,
    updateSubmissionController
} from "../controllers/submission.controller";

const submissionRouter = Router()

submissionRouter.post("/", uploadDrive.single('file'), createSubmissionController)
submissionRouter.get("/", getAllSubmissionController)
submissionRouter.put("/:id", updateSubmissionController)
submissionRouter.delete("/:id", deleteSubmissionController)
submissionRouter.get("/download", downloadAllSubmission)

export default submissionRouter