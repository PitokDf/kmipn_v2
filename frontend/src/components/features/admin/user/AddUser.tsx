'use client'

import { Button } from "@/components/ui/button"
import { addUser } from "@/lib/apis/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";
import { UserDialog } from "./UserDialog";

export function AddUser() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState<{ path: string; msg: string }[]>([]);
    const qc = useQueryClient()

    const { mutateAsync: mutateAddCategory, isPending } = useMutation({
        mutationFn: addUser,
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ['users'] })
            setIsOpen(!isOpen)
            toast.success(data.message)
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah user:", error.message)
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
                <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>

            <UserDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                title="Add User"
                onLoading={isPending}
                onSave={handleAddCategory}
                serverErrors={serverErrors}
            />
        </>
    )
}