"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { useUser } from "@/context/UserContext"
import { getInfoSubmission } from "@/lib/apis/team"
import { formatTanggal } from "@/lib/formatTanggal"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react"
import { SubmissionForm } from "./SubmissionForm"
import Link from "next/link"

export function Preliminary() {
    const user = useUser()
    const { data: preliminarySubmission, isPending } = useQuery({
        queryKey: ["submission_preliminary"],
        queryFn: async () => {
            return await getInfoSubmission(user?.id!) as {
                id: number, teamId: number,
                round: string, status: string, createdAt: string, title: string,
                category: string,
                fileLink: string,
                fileName: string
            }
        }
    })


    if (isPending && !preliminarySubmission) return (
        <p>Loading...</p>
    )

    const round = preliminarySubmission?.round as "preliminary" | "final"
    const status = preliminarySubmission?.status as any
    const approved = (preliminarySubmission as any).proposalApproved

    return <>
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle>Pengajuan Ronde Penyisihan</CardTitle>
                        <CardDescription>
                            Kirimkan pengajuan projek anda untuk ronde penyisihan
                        </CardDescription>
                    </div>
                    {round === "preliminary" && (
                        <StatusBadge status={status} />
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {!approved ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                            <Clock className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Tidak Tersedia Sekarang</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            Pengajuan akan tersedia jika proposal sudah disetujui
                        </p>
                    </div>
                ) :
                    round === "preliminary" || round === "final" ? (
                        <div className="space-y-6">
                            <div className="border rounded-lg p-6 bg-muted/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <FileText className="h-6 w-6 mr-2 text-blue-600" />
                                        <div>
                                            <h3 className="font-medium">{preliminarySubmission?.fileName || "bla-bla.zip"}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Di upload pada {formatTanggal(preliminarySubmission?.createdAt!)}
                                            </p>
                                        </div>
                                    </div>
                                    <Link href={preliminarySubmission?.fileLink!} target="_blank">
                                        <Button variant="outline">Lihat</Button>
                                    </Link>
                                </div>

                                <div className="p-4 border rounded-md dark:bg-gray-950/30 bg-gray-50">
                                    <h3 className="font-medium mb-2">Detail Pengajuan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Judul Projek</p>
                                            <p>{preliminarySubmission?.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Tanggal Pengajuan</p>
                                            <p>{formatTanggal(preliminarySubmission?.createdAt!)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                                            <p>{preliminarySubmission?.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                                            <StatusBadge status={status} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {status === "pending" && (
                                        <Alert>
                                            <Clock className="h-4 w-4" />
                                            <AlertTitle>Sedang di review</AlertTitle>
                                            <AlertDescription>
                                                Pengajuan anda sedang direview.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {status === "passed" && (
                                        <Alert className="bg-green-50 border-green-200 text-green-800">
                                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-600 " />
                                            <AlertTitle>Selamat!</AlertTitle>
                                            <AlertDescription>
                                                Tim Anda telah maju ke babak final. Harap persiapkan tim Anda.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {status === "failed" && (
                                        <Alert variant="destructive">
                                            <XCircle className="h-4 w-4" />
                                            <AlertTitle>Belum Lolos di Babak {round === "preliminary" ? "Penyisihan" : "Final"}</AlertTitle>
                                            <AlertDescription>
                                                Terima kasih atas antusiasme dan kerja keras tim Anda. Sayangnya, tim Anda belum berhasil lolos dari babak {round === "preliminary" ? "Penyisihan" : "Final"}. Tetap semangat untuk tantangan berikutnya!
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <SubmissionForm />
                    )
                }

            </CardContent>
        </Card>
    </>
}