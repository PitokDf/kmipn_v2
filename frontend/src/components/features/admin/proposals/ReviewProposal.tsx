'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { reviewProposal } from "@/lib/apis/proposal";
import { Proposal } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ReviewProposalProps = {
    proposal: Omit<Proposal, "creadAt" | "deadline"> & { id: number }
    open: boolean
    onOnpenChange: (open: boolean) => void
}

const reviewSchema = z.object({
    status: z.string().nonempty("silahkan pilih keputusan"),
    comments: z.string().min(15, "Minimal umpan balik 15 karakter")
})

type ReviewFormvalues = z.infer<typeof reviewSchema>
interface ServerError { path: string; msg: string }

export function ReviewProposal({
    proposal,
    onOnpenChange,
    open
}: ReviewProposalProps) {
    const form = useForm<ReviewFormvalues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { comments: proposal.comments || '', status: proposal.status }
    })

    const [serverErrors, setServerErrors] = useState<ServerError[]>()
    const qc = useQueryClient()
    const { mutateAsync: mutateReviewProposal, isPending } = useMutation({
        mutationFn: reviewProposal,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['proposals'] })
            onOnpenChange(!open)
            toast.success('Berhasil menyimpan review')
        },
        onError: (error: any) => {
            const errors = error.response?.data?.errors || [];
            console.error("Gagal nambah kategori:", error.message)
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast.error('Server error, coba lagi.');
            }
        }
    })

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof ReviewFormvalues).invalid === false) {
                form.setError(e.path as keyof ReviewFormvalues, {
                    type: "server",
                    message: e.msg
                })
            }
        })
    }, [serverErrors])

    const handleSubmit = form.handleSubmit(async (data) => {
        await mutateReviewProposal({ id: proposal.id, comments: data.comments, status: data.status })
    })
    return (
        <Dialog onOpenChange={onOnpenChange} open={open}>
            <DialogTrigger asChild>
                <Button variant="outline">Review Proposal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Review Proposal</DialogTitle>
                    <DialogDescription>
                        Update the status and provide feedback for this proposal.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            name="status"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keputusan</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="approve">Approve</SelectItem>
                                                <SelectItem value="rejected">Reject</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="comments"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Umpan Balik</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Provide detailed feedback about the proposal" {...field} rows={4} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>{isPending ? 'Menyimpan...' : "Simpan Review"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}