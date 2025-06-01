'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkResetToken } from "@/lib/apis/auth";

export default function LoginPage() {
    const [userId, setUserId] = useState<string | null>(null)
    const params = useParams()
    const token = params.token as string

    useEffect(() => {
        if (token) {
            const checkToken = async () => {
                try {
                    const res = await checkResetToken(token)
                    if (res.success) {
                        setUserId(res.data)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            checkToken()
        }
    }, [token])

    return (
        <Card className="w-full max-w-md">
            {userId === null ? (<>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Token Invalid
                    </CardTitle>
                    <CardDescription className="text-center">
                        Token tidak valid atau sudah kadaluarsa
                    </CardDescription>
                </CardHeader>
            </>) : (<>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Reset Password Kamu
                    </CardTitle>
                    <CardDescription className="text-center">
                        Masukkan password baru kamu dibawah ini
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm userId={userId} />
                </CardContent>
            </>)}

        </Card>
    )
}