import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";
import ResendEmailForm from "@/components/auth/ResendEmailVerifikasi";

export const metadata: Metadata = {
    title: "Resend Email | KMIPN VII ",
    description: "Masukkan email untuk menerima link verifikasi."
}

export default function ForgotPasswordPage() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    Kirim Ulang Email Verifikasi
                </CardTitle>
                <CardDescription className="text-center">
                    Masukkan email untuk menerima verifikasi link
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResendEmailForm />
            </CardContent>
            <CardFooter className="flex md:flex-row flex-col space-y-2 justify-between">
                <div className="text-sm text-center">
                    Kembali ke halaman{" "}
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
                        Login?
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