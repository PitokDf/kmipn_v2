import { Router } from "express";
import { uploadDrive } from "../middlewares/multerDrive";
import { createSubmissionController, deleteSubmissionController, getAllSubmissionController, updateSubmissionController } from "../controllers/submission.controller";

const submissionRouter = Router()

submissionRouter.post("/", uploadDrive.single('file'), createSubmissionController)
submissionRouter.get("/", getAllSubmissionController)
submissionRouter.put("/:id", updateSubmissionController)
submissionRouter.delete("/:id", deleteSubmissionController)

export default submissionRouter