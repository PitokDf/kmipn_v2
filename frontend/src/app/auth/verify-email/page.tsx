'use client'

import { CheckCircle, LoaderPinwheel, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axiosInstance from '@/lib/axios'

export default function VerifyEmailPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [msg, setMsg] = useState('')
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    useEffect(() => {
        const verify = async () => {
            try {
                setIsLoading(true)
                const res = await axiosInstance.post(`/auth/verify-email?token=${token}`)
                if (res.data.success) {
                    setMsg(res.data.msg)
                    setSuccess(true)
                } else {
                    setMsg(res.data.msg)
                    setSuccess(false)
                }
            } catch (error: any) {
                console.error(error)
                setMsg(error?.response?.data?.message || 'Terjadi kesalahan saat memverifikasi email.')
                setSuccess(false)
            } finally {
                setIsLoading(false)
            }
        }
        if (token) {
            verify()
        } else {
            setMsg('Token verifikasi tidak ditemukan.')
            setIsLoading(false)
        }
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <Card className="w-full max-w-md text-center shadow-lg">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-6">
                        <LoaderPinwheel className="mb-4 h-12 w-12 animate-spin text-orange-500" />
                        <p className="text-sm text-muted-foreground">Memverifikasi email Anda...</p>
                    </div>
                ) : success ? (
                    <>
                        <CardHeader>
                            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                            <CardTitle className="text-2xl font-semibold">Email Terverifikasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-6 text-sm text-muted-foreground">
                                {msg || 'Terima kasih telah memverifikasi email Anda. Akun Anda sekarang aktif dan siap digunakan.'}
                            </p>
                            <Button asChild className="w-full bg-orange-500 hover:bg-orange-700">
                                <Link href="/auth/login">Masuk ke Akun</Link>
                            </Button>
                        </CardContent>
                    </>
                ) : (
                    <>
                        <CardHeader>
                            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                            <CardTitle className="text-2xl font-semibold">Verifikasi Gagal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-6 text-sm text-muted-foreground">{msg}</p>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/auth/resend-verification">Kirim Ulang Email Verifikasi</Link>
                            </Button>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    )
}
