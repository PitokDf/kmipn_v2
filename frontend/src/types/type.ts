export interface User {
    id: string
    email: string
    name: string
    verified: boolean
    role: "admin" | "participant" | "operator"
    iat: number
    exp: number
}

export interface Category {
    id: number
    name: string
    description: string
    deadline: Date
}