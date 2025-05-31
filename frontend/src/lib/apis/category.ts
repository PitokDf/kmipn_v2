import { Category, CategoryStatsData } from "@/types/api";
import axiosInstace from "../axios";

export async function getAllCategory(): Promise<Category[]> {
    const res = await axiosInstace.get("/category");
    return res.data.data
}

export async function getCategoryStats(): Promise<CategoryStatsData> {
    const res = await axiosInstace.get("/category/stats")
    return res.data.data
}

export async function addCategory(data: Omit<Category, 'id'>) {
    const res = await axiosInstace.post("/category", data)
    return res.data.data
}

export async function updateCategory(data: Category) {
    const res = await axiosInstace.put(`/category/${data.id}`, data)
    return res.data.data
}

export async function deleteCategory(id: number) {
    const res = await axiosInstace.delete(`/category/${id}`)
    return res.data.data
}