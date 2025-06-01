import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateSuubmission } from "@/lib/apis/submission";
import { Submission } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function UpdateSubmission({ data, onOpenChange, open }:
    { data: Submission, open: boolean, onOpenChange: (open: boolean) => void }) {
    const qc = useQueryClient()
    const [status, setStatus] = useState<"preliminary" | "final" | "pending">(data.status as any)
    const { mutateAsync: mutateUpdateSubmission, isPending } = useMutation({
        mutationFn: async () => {
            await updateSuubmission(data.id, status)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["submissions"] });
            onOpenChange(false)
            toast.success(`Berhasil mengupdate submission "${data.teamName}"`)
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || []

            toast.error(errors || "Error!")
        }
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Update Status</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Team Status</DialogTitle>
                    <DialogDescription>
                        Change the status for {data.teamName}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>New Status</Label>
                        <Select defaultValue={data.teamName}
                            value={status}
                            onValueChange={(e) => setStatus(e as any)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="passed">Pass</SelectItem>
                                <SelectItem value="failed">Fail</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
                <DialogFooter>
                    <Button type="submit"
                        disabled={isPending}
                        onClick={async () => await mutateUpdateSubmission()}
                    >{isPending ? "Menyimpan..." : "Simpan"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}