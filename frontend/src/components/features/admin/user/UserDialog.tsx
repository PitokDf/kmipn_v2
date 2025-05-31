import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectOption } from "@/components/ui/select-option";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = (isEdit: boolean) => z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Masukkan email yang valid"),
    password: isEdit ?
        z.string().min(8, "Password minimal 8 karakter").optional() :
        z.string({ required_error: "Password minimal 8 karakter" }).min(8, "Password minimal 8 karakter"),
    role: z.string().nonempty("Pilih salah satu role")
})

export type UserFormValues = z.infer<ReturnType<typeof userSchema>> & { id?: string }
interface ServerError { path: string; msg: string }

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: UserFormValues) => Promise<void>;
    title: string;
    onLoading?: boolean;
    serverErrors?: ServerError[];
    defaultValues?: UserFormValues & { id?: string };
}
export function UserDialog({
    open,
    onOpenChange,
    onSave,
    title,
    onLoading,
    serverErrors,
    defaultValues = {
        name: "",
        email: "",
        password: undefined,
        role: ""
    }
}: UserDialogProps) {

    useEffect(() => {
        if (open && title === "Edit User") form.reset(defaultValues)
    }, [open])

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof UserFormValues).invalid === false) {
                form.setError(e.path as keyof UserFormValues, {
                    type: "server",
                    message: e.msg
                })
            }
        })
    }, [serverErrors])

    const isEdit = !!defaultValues.id
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema(isEdit)),
        defaultValues
    })

    const handleSubmit = form.handleSubmit(async (data) => {
        await onSave(defaultValues.id ? { ...data, id: defaultValues.id } : data)
        form.reset()
        onOpenChange(false)
    })

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Isi detail user dibawah.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama User</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., pitok" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., pitok@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="role"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <SelectOption
                                            items={[
                                                { value: 'admin', label: 'Admin' },
                                                { value: 'operator', label: 'Operator' },
                                                { value: 'participant', label: 'Participant' },
                                            ]}
                                            label="Pilih role"
                                            placeholder="Pilih role"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Password {defaultValues.id && "(optional)"}</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Enter your password"
                                                type={showPassword ? "text" : "password"}
                                                disabled={onLoading}
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={onLoading}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">
                                                    {showPassword ? "Hide password" : "Show password"}
                                                </span>
                                            </Button>
                                        </div>
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