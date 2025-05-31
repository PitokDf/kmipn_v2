import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { verifyTeam } from "@/lib/apis/team";
import { Team } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type VerifyTeam = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    data: Team
}

export function VerifyTeam({
    data, onOpenChange, open
}: VerifyTeam) {
    const qc = useQueryClient()

    const { mutateAsync, isPending } = useMutation({
        mutationFn: verifyTeam,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["teams"] })
            toast.success(`Berhasil memverifikasi team "${data.name}"`)
            onOpenChange(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            description={`Kamu yakin ingin memverifikasi team ini "${data.name}"?`}
            title="Verifikasi Team"
            onLoading={isPending}
            onConfirm={() => { mutateAsync(data.id) }}
        />
    )
}