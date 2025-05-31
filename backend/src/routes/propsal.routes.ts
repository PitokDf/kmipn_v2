import { Router } from "express";
import { createProposal, deleteProposal, downloadAllProposal, getAllproposal, getProposalTeamController, replaceFileProposalController, reviewProposal } from "../controllers/proposal.controller";
import { uploadDrive } from "../middlewares/multerDrive";
import { reviewProposalValidator } from "../validators/proposal.validator";
import { handleValidationErrors } from "../middlewares/handle_validation_errors";

const proposalRouter = Router()

proposalRouter.post("/", uploadDrive.single("file"), createProposal)
proposalRouter.post("/:id/review", reviewProposalValidator, handleValidationErrors, reviewProposal)
proposalRouter.get("/proposal-team", getProposalTeamController)
proposalRouter.get("/download-approved", downloadAllProposal)
proposalRouter.get("/", getAllproposal)
proposalRouter.delete("/:id", deleteProposal)
proposalRouter.post("/:id/replace", uploadDrive.single("file"), replaceFileProposalController)

export default proposalRouter