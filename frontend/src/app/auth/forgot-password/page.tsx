import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/LupaPasswordForm";

export const metadata: Metadata = {
    title: "Lupa Password | KMIPN VII ",
    description: "Masukkan email untuk menerima link reset password."
}

export default function ForgotPasswordPage() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    Lupa Password
                </CardTitle>
                <CardDescription className="text-center">
                    Masukkan email untuk menerima link reset password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ForgotPasswordForm />
            </CardContent>
            <CardFooter className="flex md:flex-row flex-col space-y-2 justify-between">
                <div className="text-sm text-center">
                    Sudah ingat password?{" "}
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
                        Login
                    </Link>
                </div>
                <div className="text-sm text-center">
                    <Link href="/" className="text-orange-600 hover:text-orange-500">
                        Kembali ke homepage?
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}