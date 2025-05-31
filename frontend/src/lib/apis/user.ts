import { User } from "@/types/api";
import axiosInstace from "../axios";

export async function getAllUser(): Promise<User[]> {
    const res = await axiosInstace.get("/users")
    return res.data.data
}

export async function editUSer(data: Omit<User, 'verified'>) {
    const res = await axiosInstace.put(`/users/${data.id}`, data)
    return res.data.data
}

export async function deleteUser(id: string) {
    const res = await axiosInstace.delete(`/users/${id}`)
    return res.data.data
}

export async function addUser(data: Omit<User, 'id' | 'verified'>) {
    const res = await axiosInstace.post("/users", data)
    return res.data
}