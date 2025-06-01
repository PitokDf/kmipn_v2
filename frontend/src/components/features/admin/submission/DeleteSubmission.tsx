import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteSubmission } from "@/lib/apis/submission";
import { Submission } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteSubmissionProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    data: Submission
}

export function DeleteSubmission({
    data, onOpenChange, open
}: DeleteSubmissionProps) {
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteSubmission,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["submissions"] })
            toast.success(`Berhasil menghapus submission tim "${data.teamName}"`)
            onOpenChange(false)
        },
        onError: (error) => {
            toast.error('Terjadi masalah disis server')
        }
    })
    return (
        <DeleteConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            description={`Kamu yakin ingin menghapus submission tim ini '${data.teamName}'? aksi ini tidak dapat dibatalkan!`}
            title="Hapus Submission"
            onLoading={isPending}
            onConfirm={async () => { await mutateAsync(data.id) }}
        />
    )
}