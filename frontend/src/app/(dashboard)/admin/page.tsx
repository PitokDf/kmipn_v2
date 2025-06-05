'use client'

import DashboardAdmin from "@/components/features/admin/DashboardAdmin"
import { ChartPieLabelList } from "@/components/statistik/Proposal"
import { useUser } from "@/context/UserContext"
// import DashboardAdmin from "../participant/page"

export default function DashboardAdminPage() {
    const user = useUser()

    if (!user) return <p>Loading...</p>

    return (
        <>
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user.name}
                </p>
            </div>
            <DashboardAdmin />
        </>
    )
}