'use client'

import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";
import { addCategory } from "@/lib/apis/category";
import { createTimeline } from "@/lib/apis/timeline";
import { TimelineDialog } from "./TimelineDialog";

export function AddTimeline() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);
    const qc = useQueryClient()

    const { mutateAsync: mutateAddTimeline, isPending } = useMutation({
        mutationFn: createTimeline,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['timelines'] })
            setIsOpen(!isOpen)
            toast.success("Berhasil menambahkan timeline.")
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah timeline:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })

    const handleAddCategory = async (category: any) => {
        await mutateAddTimeline(category)
    }

    return (
        <>
            <Button onClick={() => { setIsOpen(!isOpen) }}>
                <Plus className="mr-2 h-4 w-4" /> Add Timeline
            </Button>

            <TimelineDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                title="Add Timeline"
                onLoading={isPending}
                onSave={handleAddCategory}
                serverErrors={serverErrors}
            />
        </>
    )
}