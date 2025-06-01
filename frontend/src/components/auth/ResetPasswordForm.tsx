'use client'

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Login, register, resetPassword } from "@/lib/apis/auth";
import { toast } from "sonner";

const formSchema = z
    .object({
        password: z.string().min(8, {
            message: "Password minimal 8 karakter.",
        }),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password tidak sesuai",
        path: ["confirmPassword"],
    });
type registerValues = z.infer<typeof formSchema>

export default function ResetPasswordForm({ userId }: { userId: string | null }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setmessage] = useState("")
    const [messageStatus, setmessageStatus] = useState<"success" | "error" | null>(null)
    const [serverErrors, setServerErrors] = useState<{ msg: string, path: string }[]>([])
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    });

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof registerValues).invalid === false) {
                form.setError(e.path as keyof registerValues, {
                    type: "server",
                    message: e.msg
                })
            }
        })
    }, [serverErrors])

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            setIsLoading(true);
            const res = await resetPassword({ password: values.password, userId: userId! })

            if (res.success) {
                setmessage(res.message)
                setmessageStatus("success")
                form.reset({
                    confirmPassword: "",
                    password: ""
                })

                document.location.href = "/auth/login"
            }

        } catch (error: any) {
            console.log(error);

            setmessage(error.response.data.message || "Terjadi masalah pada server")
            setmessageStatus("error")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Form {...form}>
            {message && (
                <div className={`w-full mb-4 px-3 py-2 border-l-2 ${messageStatus == "success" ? "bg-green-200 dark:bg-green-200/10 text-green-500  border-l-green-500" : "bg-red-200 dark:bg-red-200/10 text-red-500  border-l-red-500"} `}>
                    {message}
                </div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Create a password"
                                        type={showPassword ? "text" : "password"}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
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
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Konfirmasi Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Confirm your password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...field}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                            {showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"}
                                        </span>
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Reset Password"}
                </Button>
            </form>
        </Form>
    )
}