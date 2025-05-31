import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteCategory } from "@/lib/apis/category";
import { deleteTeam } from "@/lib/apis/team";
import { Team } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteTeamProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    data: Team
}

export function DeleteTeam({
    data, onOpenChange, open
}: DeleteTeamProps) {
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteTeam,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["teams"] })
            toast.success(`Berhasil menghapus team "${data.name}"`)
            onOpenChange(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            description={`Kamu yakin ingin menghapus team ini ${data.name}? aksi ini tidak dapat dibatalkan!`}
            title="Hapus Team"
            onLoading={isPending}
            onConfirm={() => { mutateAsync(data.id) }}
        />
    )
}