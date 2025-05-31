import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteCategory } from "@/lib/apis/category";
import { deleteProposal } from "@/lib/apis/proposal";
import { Proposal } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteProposalPops = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    data: Omit<Proposal, 'creadAt' | 'deadline'>
}

export function DeleteProposal({
    data, onOpenChange, open
}: DeleteProposalPops) {
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteProposal,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["proposals"] })
            toast.success(`Berhasil menghapus proposal "${data.title}"`)
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
            description={`Kamu yakin ingin menghapus proposal ini '${data.title}'? aksi ini tidak dapat dibatalkan!`}
            title="Hapus Proposal"
            onLoading={isPending}
            onConfirm={async () => { await mutateAsync(data.id) }}
        />
    )
}