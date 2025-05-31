import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import Link from "next/link";

import { Metadata } from "next";
import RegisterForm from "@/components/register/RegisterForm";
import ThemeToggle from "@/components/theme-toogle";

export const metadata: Metadata = {
    title: "Register | KMIPN VII ",
    description: "Register untuk memulai bergabung ke KMIPN"
}

export default function RegisterPage() {
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
                    Create an account
                </CardTitle>
                <CardDescription className="text-center">
                    Enter your details to register for KMIPN
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
            <CardFooter className="flex md:flex-row flex-col space-y-2 justify-between">
                <div className="text-sm text-center">
                    Already have an account?{" "}
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