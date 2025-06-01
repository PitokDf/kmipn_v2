import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteUser } from "@/lib/apis/user";
import { User } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteUserPops = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    data: User
}

export function DeleteUser({
    data, onOpenChange, open
}: DeleteUserPops) {
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] })
            toast.success(`Berhasil menghapus user "${data.name}"`)
            onOpenChange(false)
        },
        onError: (error: any) => {
            toast.error(error.response.data.message || error.message)
        }
    })
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            description={`Kamu yakin ingin menghapus user ini ${data.name}? aksi ini tidak dapat dibatalkan!`}
            title="Hapus User"
            onLoading={isPending}
            onConfirm={async () => { mutateAsync(data.id) }}
        />
    )
}