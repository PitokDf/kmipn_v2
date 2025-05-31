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
import { Login, register } from "@/lib/apis/auth";
import { toast } from "sonner";

const formSchema = z
    .object({
        name: z.string().min(2, {
            message: "Nama minimal 2 karakter.",
        }),
        email: z.string().email({
            message: "Masukkan email yang valid.",
        }),
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

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [infoMsg, setInfoMsg] = useState("")
    const [serverErrors, setServerErrors] = useState<{ msg: string, path: string }[]>([])
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
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

    function onSubmit(values: z.infer<typeof formSchema>) {

        const login = async () => {
            try {
                setIsLoading(true);
                const res = await register(values)

                if (res.success) {
                    setInfoMsg(res.message)
                    form.reset({
                        confirmPassword: "",
                        email: "",
                        name: "",
                        password: ""
                    })
                }

            } catch (error: any) {
                console.log(error);
                const errors = error.response?.data?.errors || [];
                if (Array.isArray(errors)) {
                    setServerErrors(errors)
                } else {
                    toast('Server error, coba lagi.');
                }
            } finally {
                setIsLoading(false)
            }
        }

        login()
    }

    return (
        <Form {...form}>
            {infoMsg && (
                <div className="w-full mb-4 bg-blue-200 text-blue-500 px-3 py-2 border-l-2 border-l-blue-500">
                    {infoMsg}
                </div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your full name"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    {...field}
                                    disabled={isLoading}
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
                            <FormLabel>Confirm Password</FormLabel>
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
                <Link href={"/auth/resend"} className="text-blue-500 text-sm pt-2">Resend email verifikasi?</Link>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Register"}
                </Button>
            </form>
        </Form>
    )
}