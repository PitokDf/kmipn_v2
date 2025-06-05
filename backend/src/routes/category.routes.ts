import { Router } from "express";
import { createCategory, deleteCategory, getAllCategoryClose, getCategoryStatsController, updateCategory } from "../controllers/category.controller";
import { CategoriValidator } from "../validators/CategoriValidator";
import { handleValidationErrors } from "../middlewares/handle_validation_errors";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/check_role";

const categoryRouter = Router()

categoryRouter.get("/", getAllCategoryClose)
categoryRouter.post("/", jwtCheckToken, isRole(['admin']), CategoriValidator, handleValidationErrors, createCategory)
categoryRouter.put("/:id", jwtCheckToken, isRole(['admin']), CategoriValidator, handleValidationErrors, updateCategory)
categoryRouter.delete("/:id", jwtCheckToken, isRole(['admin']), deleteCategory)
categoryRouter.get("/stats", jwtCheckToken, isRole(['admin']), getCategoryStatsController)

export default categoryRouter