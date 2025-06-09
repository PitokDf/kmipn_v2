'use client'

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { sendEmailForgotPassword } from "@/lib/apis/auth";
import { ReCAPTCHAComponent } from "./ReCAPTCHA";

const formSchema = z.object({
    email: z.string().email({
        message: "Masukkan email yang valid.",
    })
});

type loginValues = z.infer<typeof formSchema>

export default function ForgotPasswordForm() {
    const recaptchaRef = useRef(null)
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setmessage] = useState("")
    const [messageStatus, setmessageStatus] = useState<"success" | "error" | null>(null)
    const [serverErrors, setServerErrors] = useState<{ msg: string, path: string }[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
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

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            setIsLoading(true);

            const token = await (recaptchaRef.current as any).executeAsync();
            if (!token) {
                setmessage("Verifikasi reCAPTCHA gagal.");
                setmessageStatus("error")
                setIsLoading(false);
                return;
            }

            const res = await sendEmailForgotPassword({ email: values.email, recaptchaToken: token })

            if (res.success) {
                setmessage("")
                form.reset()
                setmessage(res.message ?? "")
                setmessageStatus("success")
            }

        } catch (error: any) {
            const errorMessage = error.response.data.message
            setmessage(errorMessage ?? "")
            setmessageStatus("error")
            const errors = error.response?.data?.errors || [];
            if (Array.isArray(errors)) {
                setServerErrors(errors)
            } else {
                toast('Server error, coba lagi.');
            }
        } finally {
            (recaptchaRef.current as any).reset();
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
                <ReCAPTCHAComponent
                    recaptchaRef={recaptchaRef}
                    setRecaptchaToken={setRecaptchaToken}
                />
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-700" disabled={isLoading}>
                    {isLoading ? "Mengirim..." : "Kirim"}
                </Button>
            </form>
        </Form>
    )
}