import { Router } from "express";
import { createTimelineValidator, updateTimelineValidator } from "../validators/timeline_validator";
import { handleValidationErrors } from "../middlewares/handle_validation_errors";
import { TimelineController } from "../controllers/timeline.controller";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/check_role";

const timelineRouter = Router()

timelineRouter.post('/', jwtCheckToken, isRole(['admin']), createTimelineValidator, handleValidationErrors, TimelineController.createTimeline)
timelineRouter.patch('/:id', jwtCheckToken, isRole(['admin']), updateTimelineValidator, handleValidationErrors, TimelineController.updateTimeline)
timelineRouter.delete('/:id', jwtCheckToken, isRole(['admin']), TimelineController.deleteTimeline)
timelineRouter.get('/', TimelineController.getTimeline)

export default timelineRouter