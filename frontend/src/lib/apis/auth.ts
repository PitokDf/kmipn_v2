import axiosInstace from "../axios";

export async function Login(data: { email: string, password: string }) {
    const res = await axiosInstace.post("/auth/login", data)
    return res.data
}

export async function register(data: { email: string, name: string, password: string }) {
    const res = await axiosInstace.post("/auth/register", data)
    return res.data
}