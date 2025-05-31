import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { deleteCategory } from "@/lib/apis/category";
import { Category } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeleteCateoryPops = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    data: Category
}

export function DeleteCateory({
    data, onOpenChange, open
}: DeleteCateoryPops) {
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] })
            toast.success(`Berhasil menghapus kategori "${data.categoriName}"`)
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
            description={`Kamu yakin ingin menghapus kategori ini ${data.categoriName}? aksi ini tidak dapat dibatalkan!`}
            title="Hapus Kategori"
            onLoading={isPending}
            onConfirm={async () => { await mutateAsync(data.id) }}
        />
    )
}