'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Category, Timeline } from "@/types/api";
import { updateCategory } from "@/lib/apis/category";
import { TimelineDialog } from "./TimelineDialog";
import { updateTimeline } from "@/lib/apis/timeline";

type EditTimelineProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: Timeline
}

export function EditTimeline({
    data, onOpenChange, open
}: EditTimelineProps) {
    const qc = useQueryClient()
    const [serverErrors, setServerErrors] = useState<{ path: string, msg: string }[]>([])

    const { mutateAsync: mutateEditTimeline, isPending } = useMutation({
        mutationFn: updateTimeline,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["timelines"] });
            onOpenChange(false)
            toast.success(`Berhasil mengupdate data timeline "${data.title}"`)
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || []

            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error("Error!")
            }
        }
    })

    return (
        <TimelineDialog
            serverErrors={serverErrors}
            onOpenChange={onOpenChange}
            open={open}
            title="Edit Timeline"
            defaultValues={{ ...data, startTime: new Date(data.startTime), endTime: new Date(data.endTime) }}
            onSave={async (data) => { mutateEditTimeline({ ...data, id: data.id! }) }}
            onLoading={isPending}
        />
    )
}