'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Category } from "@/types/api";
import { updateCategory } from "@/lib/apis/category";
import { CategoryDialog } from "./CategoryDialog";

type EditCategoryProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: Category
}

export function EditCategory({
    data, onOpenChange, open
}: EditCategoryProps) {
    const qc = useQueryClient()
    const [serverErrors, setServerErrors] = useState<{ path: string, msg: string }[]>([])

    const { mutateAsync: mutateEditCategory, isPending } = useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] });
            onOpenChange(false)
            toast.success(`Berhasil mengupdate data kategory "${data.categoriName}"`)
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

    const handleSave = async (data: any) => {
        await mutateEditCategory(data)
    }
    return (
        <CategoryDialog
            serverErrors={serverErrors}
            onOpenChange={onOpenChange}
            open={open}
            title="Edit Kategori"
            defaultValues={{ ...data, deadline: new Date(data.deadline) }}
            onSave={handleSave}
            onLoading={isPending}
        />
    )
}