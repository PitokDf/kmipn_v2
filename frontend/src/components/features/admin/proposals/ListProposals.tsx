'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAllProposal } from "@/lib/apis/proposal";
import { formatTanggal } from "@/lib/formatTanggal";
import { Proposal } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Download, FileText, Trash2, XCircle } from "lucide-react";
import Link from "next/link";

type ListProposalsProps = {
    activeTab: string
    searchParams: string
    categoryFilter: string
    onReview?: (proposal: Omit<Proposal, 'creadAt' | 'deadline'>) => void
    onDelete?: (proposal: Omit<Proposal, 'creadAt' | 'deadline'>) => void
}

export function ListProposals({
    activeTab, categoryFilter, searchParams, onReview, onDelete
}: ListProposalsProps) {
    const { data: proposals, isPending } = useQuery({
        queryKey: ["proposals"],
        queryFn: getAllProposal
    })

    const filtered = proposals?.filter(p => {
        const matchesTab = activeTab === "all" || (activeTab === "pending" && p.status === "pending") || (activeTab === "approve" && p.status === "approve") || (activeTab === "rejected" && p.status === "rejected");
        const matchesSearch = p.title.toLowerCase().includes(searchParams.toLowerCase()) || p.teamName.toLowerCase().includes(searchParams.toLowerCase());
        const matchesCategory = categoryFilter === "all" || p.teamCategory === categoryFilter;
        return matchesTab && matchesSearch && matchesCategory;
    });
    return (
        <>{isPending ? (<>{
            Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-56 w-full">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex gap-1">
                            <Skeleton className="h-4 w-36" />
                        </div>
                        <Skeleton className="w-10 h-4" />
                    </div>
                </Skeleton>
            ))
        }</>
        ) :
            filtered?.map((proposal) => (
                <Card key={proposal.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{proposal.title}</CardTitle>
                                <CardDescription>
                                    Dikirimkan oleh {proposal.teamName} - {proposal.teamCategory}
                                </CardDescription>
                            </div>
                            <StatusBadge status={proposal.status as any} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex md:items-center space-y-2 md:justify-between items-baseline md:flex-row flex-col p-4 bg-muted rounded-lg">
                                <div className="flex items-center">
                                    <FileText className="h-6 w-6 mr-2 text-blue-600" />
                                    <div>
                                        <p className="font-medium">{proposal.fileName.slice(0, 25)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Di kirimkan pada {formatTanggal(proposal.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    className="w-fit"
                                    href={proposal.fileLink}
                                    target="_blank">
                                    <Button variant="outline">
                                        <Download className="h-4 w-4 mr-2" /> Unduh
                                    </Button>
                                </Link>
                            </div>

                            {proposal.status === "pending" && (
                                <Alert>
                                    <Clock className="h-4 w-4" />
                                    <AlertTitle>Sedang Ditinjau</AlertTitle>
                                    <AlertDescription>
                                        Proposal ini saat ini sedang ditinjau.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {proposal.status === "approve" && (
                                <Alert className="bg-green-50 border-green-200">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-800">Proposal Disetujui</AlertTitle>
                                    <AlertDescription className="text-green-700">
                                        Proposal ini telah disetujui dan tim dapat melanjutkan ke babak berikutnya.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {proposal.status === "rejected" && (
                                <Alert variant="destructive">
                                    <XCircle className="h-4 w-4" />
                                    <AlertTitle>Proposal Ditolak</AlertTitle>
                                    <AlertDescription>
                                        Proposal ini tidak memenuhi kriteria yang dipersyaratkan.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                        {proposal.status !== 'approve' && (<Button variant="outline" onClick={() => onReview && onReview(proposal)}>Review Proposal</Button>)}
                        <Button
                            className="bg-red-600 hover:bg-red-600/90"
                            onClick={() => { onDelete && onDelete(proposal) }}>
                            <Trash2 />
                        </Button>
                    </CardFooter>
                </Card>
            ))}</>
    )
}