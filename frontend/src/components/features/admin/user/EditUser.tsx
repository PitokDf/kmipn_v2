'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { UserDialog } from "./UserDialog";
import { editUSer } from "@/lib/apis/user";
import { User } from "@/types/api";

type EditUserProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: User
}

export function EditUser({
    data, onOpenChange, open
}: EditUserProps) {
    const qc = useQueryClient()
    const [serverErrors, setServerErrors] = useState<{ path: string, msg: string }[]>([])

    const { mutateAsync: mutateEditUser, isPending } = useMutation({
        mutationFn: editUSer,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] });
            onOpenChange(false)
            toast.success(`Berhasil mengupdate data user "${data.name}"`)
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
        await mutateEditUser(data)
    }
    return (
        <UserDialog
            serverErrors={serverErrors}
            onOpenChange={onOpenChange}
            open={open}
            title="Edit User"
            defaultValues={{ ...data, password: undefined }}
            onSave={handleSave}
            onLoading={isPending}
        />
    )
}