import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const TimelineSchema = z.object({
    title: z.string().min(3, "Title timeline minimal 3 karakter"),
    description: z.string().min(15, "Deskripsi minimala 15 karakter"),
    startTime: z.date({ required_error: "Tanggal mulai harus diisi" }),
    endTime: z.date({ required_error: "Tanggal berakhir harus diisi" }).optional()
})

export type TimelineFormValues = z.infer<typeof TimelineSchema> & { id?: number }
interface ServerError { path: string; msg: string }

interface TimelineDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: TimelineFormValues) => Promise<void>;
    title: string;
    onLoading?: boolean;
    serverErrors?: ServerError[];
    defaultValues?: TimelineFormValues & { id?: number };
}
export function TimelineDialog({
    open,
    onOpenChange,
    onSave,
    title,
    onLoading,
    serverErrors,
    defaultValues = {
        description: "",
        startTime: new Date(),
        endTime: undefined,
        title: ""
    }
}: TimelineDialogProps) {

    useEffect(() => {
        if (open && title === "Edit Timeline") form.reset(defaultValues)
    }, [open])

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof TimelineFormValues).invalid === false) {
                form.setError(e.path as keyof TimelineFormValues, {
                    type: "server",
                    message: e.msg
                })
            }
        })
    }, [serverErrors])

    const form = useForm<TimelineFormValues>({
        resolver: zodResolver(TimelineSchema),
        defaultValues
    })

    const handleSubmit = form.handleSubmit(async (data) => {
        await onSave(defaultValues.id ? { ...data, id: defaultValues.id } : data)
        form.reset()
        onOpenChange(false)
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Isi detail timeline dibawah.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Judul</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., T3B" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g. Deskripsi timeline" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tanggal Mulai</FormLabel>
                                    <FormControl>
                                        <DatePicker value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tanggal Berakhir (optional)</FormLabel>
                                    <FormControl>
                                        <DatePicker value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant={"outline"} onClick={() => { onOpenChange(false) }}>Cancel</Button>
                            <Button disabled={onLoading} type="submit">Save {onLoading && <LoaderCircle className='animate-spin' />} </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}