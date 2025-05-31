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

const categorySchema = z.object({
    categoriName: z.string().min(3, "Nama kategori minimal 3 karakter"),
    description: z.string().min(15, "Deskripsi minimala 15 karakter"),
    deadline: z.date({ required_error: "Tanggal deadline harus diisi" })
})

export type CategoryFormValues = z.infer<typeof categorySchema> & { id?: number }
interface ServerError { path: string; msg: string }

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: CategoryFormValues) => Promise<void>;
    title: string;
    onLoading?: boolean;
    serverErrors?: ServerError[];
    defaultValues?: CategoryFormValues & { id?: number };
}
export function CategoryDialog({
    open,
    onOpenChange,
    onSave,
    title,
    onLoading,
    serverErrors,
    defaultValues = {
        description: "",
        categoriName: "",
        deadline: new Date()
    }
}: CategoryDialogProps) {

    useEffect(() => {
        if (open && title === "Edit Kategori") form.reset(defaultValues)
    }, [open])

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof CategoryFormValues).invalid === false) {
                form.setError(e.path as keyof CategoryFormValues, {
                    type: "server",
                    message: e.msg
                })
            }
        })
    }, [serverErrors])

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
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
                        Isi detail kategori dibawah.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            name="categoriName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Kategori</FormLabel>
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
                                        <Textarea placeholder="e.g. Kompotisi kategori deskripsi" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Tanggal Deadline</FormLabel>
                                    <FormControl>
                                        <DatePicker value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            name="deadline"
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