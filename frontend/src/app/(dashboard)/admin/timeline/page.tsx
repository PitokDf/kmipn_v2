'use client'

import { AddTimeline } from "@/components/features/admin/timeline/AddTimeline";
import { DeleteTimeline } from "@/components/features/admin/timeline/DeleteTimeline";
import { EditTimeline } from "@/components/features/admin/timeline/EditTimeline";
import { TimelineTable } from "@/components/features/admin/timeline/TimelineTable";
import { Timeline } from "@/types/api";
import { useState } from "react";

export default function TimelinePage() {
    const [currentTimeline, setCurrentTimeline] = useState<Timeline | null>(null)
    const [dialogs, setDialogs] = useState({
        edit: false,
        delete: false
    })

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Timeline Manajemen</h1>
                    <p className="text-muted-foreground">
                        Kelola Timeline kompetisi
                    </p>
                </div>
                <AddTimeline />
            </div>
            <TimelineTable
                onDelete={(timeline) => {
                    setCurrentTimeline(timeline)
                    setDialogs(prev => ({ ...prev, delete: true }))
                }}
                onEdit={(timeline) => {
                    setCurrentTimeline(timeline)
                    setDialogs(prev => ({ ...prev, edit: true }))
                }}
            />

            {dialogs.delete && currentTimeline !== null && (
                <DeleteTimeline
                    data={currentTimeline}
                    onOpenChange={(open) => setDialogs(prev => ({ ...prev, delete: open }))}
                    open={dialogs.delete}
                />
            )}
            {dialogs.edit && currentTimeline !== null && (
                <EditTimeline
                    data={currentTimeline}
                    onOpenChange={(open) => setDialogs(prev => ({ ...prev, edit: open }))}
                    open={dialogs.edit}
                />
            )}
        </>
    )
}