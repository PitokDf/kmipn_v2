import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/LupaPasswordForm";
import { ArrowLeft, KeyRound } from "lucide-react";
import ThemeToggle from "@/components/theme-toogle";

export const metadata: Metadata = {
    title: "Lupa Password | KMIPN VII ",
    description: "Masukkan email untuk menerima link reset password."
}

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="w-full max-w-md p-6">
                <Card className="w-full shadow-lg">
                    <CardHeader className="space-y-1">
                        <div className="flex w-full justify-between items-center">
                            {/* Back button untuk UX yang lebih baik */}
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                aria-label="Kembali ke halaman login"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                            <ThemeToggle />
                        </div>

                        {/* Icon untuk visual cue */}
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                <KeyRound className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                            </div>
                        </div>

                        {/* Main heading dengan proper hierarchy */}
                        <CardTitle className="text-2xl font-bold text-center" >
                            <h1>Lupa Password?</h1>
                        </CardTitle>

                        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                            Tidak masalah! Masukkan email yang terdaftar dan kami akan mengirimkan link untuk reset password Anda.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <ForgotPasswordForm />
                    </CardContent>

                    <CardFooter className="flex md:flex-row flex-col items-center space-y-2 justify-between">
                        <div className="text-sm text-center">
                            Sudah ingat password?{" "}
                            <Link
                                href="/auth/login"
                                className="text-blue-600 hover:text-blue-500 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Kembali ke halaman login KMIPN VII"
                            >
                                Login
                            </Link>
                        </div>
                        <div className="text-sm text-center">
                            <Link
                                href="/"
                                className="text-orange-600 hover:text-orange-500 underline focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                aria-label="Kembali ke halaman utama KMIPN VII"
                            >
                                Kembali ke homepage
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                {/* Security notice */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Link reset password akan dikirim ke email terdaftar dan berlaku selama 1 jam.
                    </p>
                </div>
            </div>
        </div>
    )
}