import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";
import ThemeToggle from "@/components/theme-toogle";

export const metadata: Metadata = {
    title: "Login | KMIPN VII ",
    description: "Login ke akun kamu, untuk melihat kemajuan teamkamu"
}

export default function LoginPage() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex w-full justify-end">
                    <ThemeToggle />
                </div>
                <div className="flex justify-center mb-4">
                    <div className="flex items-center space-x-2">
                        <Trophy className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold ">KMIPN</span>
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">
                    Log in to your account
                </CardTitle>
                <CardDescription className="text-center">
                    Enter your email and password to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
            <CardFooter className="flex md:flex-row flex-col space-y-2 justify-between">
                <div className="text-sm text-center">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-blue-600 hover:text-blue-500">
                        Register
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