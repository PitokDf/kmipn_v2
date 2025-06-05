import { prisma } from "../configs/prisma";
import { AppError } from "../errors/api_errors";

export const getAllDataCategory = async () => {
    const categori = await prisma.category.findMany({
        orderBy: { id: "desc" },
        include: { _count: true, Team: { select: { _count: true } } }
    });
    return categori;
}

export const updateCategoryService = async (id: number, categoriName: string, description: string, deadline: Date) => {
    const existsCategory = await prisma.category.findUnique({ where: { id: id } });
    if (!existsCategory) throw new AppError("Category not found", 404);
    const updatedCategory = await prisma.category.update({ data: { categoriName: categoriName, description: description, deadline: deadline }, where: { id } });
    if (!updatedCategory) throw new AppError("Failed update category", 400);
    return updateCategoryService;
}

export const deleteCategoryService = async (id: number) => {
    const existsCategory = await prisma.category.findUnique({ where: { id: id } });
    if (!existsCategory) throw new AppError("Category not found", 404);
    const deletedCategory = await prisma.category.delete({ where: { id: id } });
    return deletedCategory;
}

export const addCategoriService = async (categoriName: string, description: string, deadline: Date, driveFolderId?: string) => {
    const newCategory = await prisma.category.create({
        data: { categoriName: categoriName, description: description, deadline: deadline, driveFolderId }
    });
    if (!newCategory) throw new AppError("Fail saved category.", 400);
    return newCategory
}

export const findCategory = async (id: number) => {
    const category = await prisma.category.findUnique({
        where: { id }, select: { deadline: true }
    });
    return category
}

export async function getCategoryStats() {
    const categories = await prisma.category.findMany({
        include: {
            Team: {
                include: {
                    Proposal: true,
                    Submission: true
                }
            },
        }
    })
    return categories
}