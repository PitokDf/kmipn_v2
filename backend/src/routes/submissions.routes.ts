import { Router } from "express";
import { uploadDrive } from "../middlewares/multerDrive";
import { createSubmissionController } from "../controllers/submission.controller";

const submissionRouter = Router()

submissionRouter.post("/", uploadDrive.single('file'), createSubmissionController)

export default submissionRouter