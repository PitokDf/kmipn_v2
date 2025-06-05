import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteTimeline } from "@/lib/apis/timeline";
import { Timeline } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteTimelinePops = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    data: Timeline
}

export function DeleteTimeline({
    data, onOpenChange, open
}: DeleteTimelinePops) {
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteTimeline,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["timelines"] })
            toast.success(`Berhasil menghapus timeline "${data.title}"`)
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
            description={`Kamu yakin ingin menghapus timeline ini ${data.title}? aksi ini tidak dapat dibatalkan!`}
            title="Hapus Timeline"
            onLoading={isPending}
            onConfirm={async () => { await mutateAsync(data.id) }}
        />
    )
}