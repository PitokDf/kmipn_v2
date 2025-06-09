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
import {
    CheckCircle,
    Clock,
    Download,
    FileText,
    Trash2,
    XCircle,
    Eye,
    Search,
    FileX,
    Filter,
    Calendar,
    User,
    Building
} from "lucide-react";
import Link from "next/link";

type ListProposalsProps = {
    activeTab: string
    searchParams: string
    categoryFilter: string
    onReview?: (proposal: Omit<Proposal, 'creadAt' | 'deadline'>) => void
    onDelete?: (proposal: Omit<Proposal, 'creadAt' | 'deadline'>) => void
}

// Loading skeleton component
const ProposalSkeleton = () => (
    <Card className="overflow-hidden">
        <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Skeleton className="h-6 w-6" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
                <Skeleton className="h-16 w-full rounded-lg" />
            </div>
        </CardContent>
        <CardFooter className="pt-0">
            <div className="flex justify-end gap-2 w-full">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-12" />
            </div>
        </CardFooter>
    </Card>
);

// Empty state component
const EmptyState = ({
    type,
    searchParams,
    categoryFilter
}: {
    type: 'no-proposals' | 'no-results' | 'filtered-empty'
    searchParams: string
    categoryFilter: string
}) => {
    const getEmptyStateContent = () => {
        switch (type) {
            case 'no-proposals':
                return {
                    icon: <FileX className="h-12 w-12 text-muted-foreground/60" />,
                    title: "Belum Ada Proposal",
                    description: "Tidak ada proposal yang tersedia saat ini. Proposal yang dikirimkan akan muncul di sini.",
                    action: null
                };
            case 'no-results':
                return {
                    icon: <Search className="h-12 w-12 text-muted-foreground/60" />,
                    title: "Tidak Ada Hasil",
                    description: `Tidak ditemukan proposal dengan kata kunci "${searchParams}". Coba gunakan kata kunci yang berbeda.`,
                    action: null
                };
            case 'filtered-empty':
                return {
                    icon: <Filter className="h-12 w-12 text-muted-foreground/60" />,
                    title: "Tidak Ada Proposal",
                    description: `Tidak ada proposal yang sesuai dengan filter kategori "${categoryFilter}". Coba ubah filter atau hapus filter untuk melihat semua proposal.`,
                    action: null
                };
            default:
                return {
                    icon: <FileX className="h-12 w-12 text-muted-foreground/60" />,
                    title: "Tidak Ada Data",
                    description: "Tidak ada data yang dapat ditampilkan.",
                    action: null
                };
        }
    };

    const content = getEmptyStateContent();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-muted/30 rounded-full p-6 mb-4">
                {content.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                {content.title}
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
                {content.description}
            </p>
            {content.action}
        </div>
    );
};

// Enhanced status alert component
const StatusAlert = ({ status }: { status: string }) => {
    const statusConfig = {
        pending: {
            icon: <Clock className="h-4 w-4" />,
            title: "Sedang Ditinjau",
            description: "Proposal ini saat ini sedang dalam proses peninjauan oleh tim reviewer.",
            className: "border-yellow-200 bg-yellow-50",
            titleClassName: "text-yellow-800",
            descriptionClassName: "text-yellow-700"
        },
        approve: {
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            title: "Proposal Disetujui",
            description: "Selamat! Proposal ini telah disetujui dan tim dapat melanjutkan ke tahap berikutnya.",
            className: "border-green-200 bg-green-50",
            titleClassName: "text-green-800",
            descriptionClassName: "text-green-700"
        },
        rejected: {
            icon: <XCircle className="h-4 w-4" />,
            title: "Proposal Ditolak",
            description: "Proposal ini tidak memenuhi kriteria yang dipersyaratkan. Silakan tinjau kembali dan kirim ulang jika memungkinkan.",
            className: "border-red-200 bg-red-50",
            titleClassName: "text-red-800",
            descriptionClassName: "text-red-700"
        }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
        <Alert className={config.className}>
            {config.icon}
            <AlertTitle className={config.titleClassName}>
                {config.title}
            </AlertTitle>
            <AlertDescription className={config.descriptionClassName}>
                {config.description}
            </AlertDescription>
        </Alert>
    );
};

export function ListProposals({
    activeTab,
    categoryFilter,
    searchParams,
    onReview,
    onDelete
}: ListProposalsProps) {
    const { data: proposals, isPending, error } = useQuery({
        queryKey: ["proposals"],
        queryFn: getAllProposal
    });

    const filtered = proposals?.filter(p => {
        const matchesTab = activeTab === "all" ||
            (activeTab === "pending" && p.status === "pending") ||
            (activeTab === "approve" && p.status === "approve") ||
            (activeTab === "rejected" && p.status === "rejected");
        const matchesSearch = !searchParams ||
            p.fileName.toLowerCase().includes(searchParams.toLowerCase()) ||
            p.teamName.toLowerCase().includes(searchParams.toLowerCase());
        const matchesCategory = categoryFilter === "all" || p.teamCategory === categoryFilter;
        return matchesTab && matchesSearch && matchesCategory;
    });

    // Handle loading state
    if (isPending) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <ProposalSkeleton key={index} />
                ))}
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <Alert variant="destructive" className="my-8">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Terjadi Kesalahan</AlertTitle>
                <AlertDescription>
                    Gagal memuat data proposal. Silakan coba lagi nanti.
                </AlertDescription>
            </Alert>
        );
    }

    // Handle empty states
    if (!proposals || proposals.length === 0) {
        return <EmptyState type="no-proposals" searchParams={searchParams} categoryFilter={categoryFilter} />;
    }

    if (!filtered || filtered.length === 0) {
        if (searchParams) {
            return <EmptyState type="no-results" searchParams={searchParams} categoryFilter={categoryFilter} />;
        }
        if (categoryFilter !== "all") {
            return <EmptyState type="filtered-empty" searchParams={searchParams} categoryFilter={categoryFilter} />;
        }
        return <EmptyState type="no-proposals" searchParams={searchParams} categoryFilter={categoryFilter} />;
    }

    return (
        <div className="space-y-6 grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((proposal) => (
                <Card key={proposal.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-xl font-semibold leading-tight mb-2 line-clamp-2">
                                    {proposal.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {proposal.teamName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Building className="h-3 w-3" />
                                        {proposal.teamCategory}
                                    </span>
                                </CardDescription>
                            </div>
                            <StatusBadge status={proposal.status as any} />
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            {/* File info section */}
                            <div className="bg-muted/50 rounded-xl p-4 border border-muted">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm truncate" title={proposal.fileName}>
                                                {proposal.fileName.length > 30
                                                    ? `${proposal.fileName.slice(0, 30)}...`
                                                    : proposal.fileName
                                                }
                                            </p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <Calendar className="h-3 w-3" />
                                                Dikirimkan pada {formatTanggal(proposal.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`https://drive.google.com/uc?export=download&id=${proposal.fileLink.match(/\/d\/(.+?)\//)?.[1]}`}
                                        target="_blank"
                                        className="shrink-0"
                                    >
                                        <Button variant="outline" size="sm" className="w-full md:w-auto">
                                            <Download className="h-4 w-4 mr-2" />
                                            Unduh
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Status alert */}
                            <StatusAlert status={proposal.status} />
                        </div>
                    </CardContent>

                    <CardFooter className="pt-4 bg-muted/20 border-t">
                        <div className="flex justify-end gap-2 w-full">
                            {proposal.status !== 'approve' && (
                                <Button
                                    variant="outline"
                                    onClick={() => onReview && onReview(proposal)}
                                    className="flex items-center gap-2"
                                >
                                    <Eye className="h-4 w-4" />
                                    Review Proposal
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete && onDelete(proposal)}
                                className="bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus proposal</span>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}