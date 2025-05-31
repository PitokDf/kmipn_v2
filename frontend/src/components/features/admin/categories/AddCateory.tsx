'use client'

import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react"
import { useState } from "react";
import { CategoryDialog } from "./CategoryDialog";
import { toast } from "sonner";
import { addCategory } from "@/lib/apis/category";

export function AddCategory() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);
    const qc = useQueryClient()

    const { mutateAsync: mutateAddCategory, isPending } = useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['categories'] })
            setIsOpen(!isOpen)
            toast.success("New Class.", {
                description: "Berhasil menambahkan kategori baru.",
                duration: 2000
            })
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah kategori:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })

    const handleAddCategory = async (category: any) => {
        await mutateAddCategory(category)
    }

    return (
        <>
            <Button onClick={() => { setIsOpen(!isOpen) }}>
                <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>

            <CategoryDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                title="Add Category"
                onLoading={isPending}
                onSave={handleAddCategory}
                serverErrors={serverErrors}
            />
        </>
    )
}