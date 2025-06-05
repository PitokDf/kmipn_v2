import { Router } from "express";
import { createProposal, deleteProposal, downloadAllProposal, getAllproposal, getProposalTeamController, replaceFileProposalController, reviewProposal } from "../controllers/proposal.controller";
import { uploadDrive } from "../middlewares/multerDrive";
import { reviewProposalValidator } from "../validators/proposal.validator";
import { handleValidationErrors } from "../middlewares/handle_validation_errors";
import { isRole } from "../middlewares/check_role";

const proposalRouter = Router()

proposalRouter.post("/", isRole(['participant']), uploadDrive.single("file"), createProposal)
proposalRouter.post("/:id/review", isRole(['admin', 'operator']), reviewProposalValidator, handleValidationErrors, reviewProposal)
proposalRouter.get("/proposal-team", getProposalTeamController)
proposalRouter.get("/download-approved", isRole(['admin', 'operator']), downloadAllProposal)
proposalRouter.get("/", isRole(['admin', 'operator']), getAllproposal)
proposalRouter.delete("/:id", isRole(['admin', 'operator']), deleteProposal)
proposalRouter.post("/:id/replace", isRole(['participant']), uploadDrive.single("file"), replaceFileProposalController)

export default proposalRouter