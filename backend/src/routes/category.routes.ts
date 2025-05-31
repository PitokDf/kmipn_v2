import { Router } from "express";
import { createCategory, deleteCategory, getAllCategoryClose, getCategoryStatsController, updateCategory } from "../controllers/category.controller";
import { CategoriValidator } from "../validators/CategoriValidator";
import { handleValidationErrors } from "../middlewares/handle_validation_errors";
import { jwtCheckToken } from "../middlewares/jwt_check_token";

const categoryRouter = Router()

categoryRouter.get("/", getAllCategoryClose)
categoryRouter.post("/", jwtCheckToken, CategoriValidator, handleValidationErrors, createCategory)
categoryRouter.put("/:id", jwtCheckToken, CategoriValidator, handleValidationErrors, updateCategory)
categoryRouter.delete("/:id", jwtCheckToken, deleteCategory)
categoryRouter.get("/stats", jwtCheckToken, getCategoryStatsController)

export default categoryRouter