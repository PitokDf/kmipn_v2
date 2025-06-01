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
import { Login } from "@/lib/apis/auth";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.string().email({
        message: "Masukkan email yang valid.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

type loginValues = z.infer<typeof formSchema>

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("")
    const [serverErrors, setServerErrors] = useState<{ msg: string, path: string }[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        serverErrors?.forEach(e => {
            if (e.path && form.getFieldState(e.path as keyof loginValues).invalid === false) {
                form.setError(e.path as keyof loginValues, {
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
                const res = await Login(values)

                console.log(res);

                if (res.success) {
                    setErrorMsg("")
                    localStorage.setItem('user', JSON.stringify(res.data.user))
                    localStorage.setItem('accessToken', res.data.accessToken)
                    // document.cookie= `accessToken=${res.data.accessToken};`
                    toast(`Login berhasil, silahkan tunggu anda sedang dialihkan`)
                    document.location.reload()
                }

            } catch (error: any) {
                console.log(error);
                const errorMessage = error.response.data.message
                setErrorMsg(errorMessage ?? "")
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
            {errorMsg && (
                <div className="w-full mb-4 bg-red-200 text-red-500 px-3 py-2 border-l-2 border-l-red-500">
                    {errorMsg}
                </div>
            )
            }
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Masukkan emailmu"
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
                                        placeholder="Masukkan passwordmu"
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
                <div className="flex justify-end">
                    <div className="text-sm text-center">
                        <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-500">
                            Lupa password?
                        </Link>
                    </div>
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-700" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in"}
                </Button>
            </form>
        </Form>
    )
}