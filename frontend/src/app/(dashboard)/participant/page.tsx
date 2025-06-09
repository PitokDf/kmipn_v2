'use client'

import { DashboardInformation } from "@/components/features/participant/DashboardInformation"
import { useUser } from "@/context/UserContext"

export default function dashboardParticipantPage() {
    const user = useUser()
    return (
        <>
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.name}
                </p>
            </div>
            <DashboardInformation />
        </>
    )
}