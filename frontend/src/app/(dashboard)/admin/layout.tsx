'use client'

import { useUser } from "@/context/UserContext"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = useUser()

    if (user?.role === "participant") {
        window.location.href = "/participant"
    }
    return (
        <>{children}</>
    )
}