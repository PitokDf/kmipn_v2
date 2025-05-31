import { Router } from "express";
import { addUser, DeleteUser, getAllUser, updateUser } from "../controllers/user.controller";
import { addUserValidator, updateUserValidator } from "../validators/userValidator";
import { handleValidationErrors } from "../middlewares/handle_validation_errors";

const userRouter = Router()

userRouter.get('/', getAllUser)
userRouter.put('/:id', updateUserValidator, handleValidationErrors, updateUser)
userRouter.delete('/:id', DeleteUser)
userRouter.post('/', addUserValidator, handleValidationErrors, addUser)

export default userRouter