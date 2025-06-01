// 'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsCard } from "@/components/ui/statistics-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getDashboardParticipantData } from "@/lib/apis/dashboard";
import { useQuery } from "@tanstack/react-query";
import {
    FlagIcon,
    Users,
    FileText,
    GraduationCap,
    Building2,
    CheckCircle2,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    Crown,
    UserCheck,
    AlertCircle,
    School,
    IdCard,
    Trophy,
    Target,
    Calendar
} from "lucide-react";
import { TimeLineInfo } from "../admin/TimeLineInfo";
import { StatusBadge } from "@/components/ui/status-badge";

// Loading skeleton components
const StatisticsCardSkeleton = () => (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded dark:bg-gray-700" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24 dark:bg-gray-700" />
                    <Skeleton className="h-6 w-32 dark:bg-gray-700" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const TeamInfoSkeleton = () => (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
            <Skeleton className="h-6 w-48 dark:bg-gray-700" />
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 dark:border-gray-700 dark:bg-gray-700/50">
                            <Skeleton className="h-4 w-24 mb-2 dark:bg-gray-600" />
                            <Skeleton className="h-5 w-32 dark:bg-gray-600" />
                        </div>
                    ))}
                </div>
                <div className="border rounded-lg p-4 dark:border-gray-700 dark:bg-gray-700/50">
                    <Skeleton className="h-5 w-32 mb-3 dark:bg-gray-600" />
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full dark:bg-gray-600" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-40 dark:bg-gray-600" />
                            <Skeleton className="h-3 w-24 dark:bg-gray-600" />
                        </div>
                    </div>
                </div>
                <div className="border rounded-lg p-4 dark:border-gray-700 dark:bg-gray-700/50">
                    <Skeleton className="h-5 w-24 mb-3 dark:bg-gray-600" />
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center pb-2 border-b last:border-b-0 dark:border-gray-600">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-8 w-8 rounded-full dark:bg-gray-600" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-32 dark:bg-gray-600" />
                                        <Skeleton className="h-3 w-24 dark:bg-gray-600" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full dark:bg-gray-600" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

// Enhanced status display component
const VerificationStatus = ({ verified }: { verified: boolean }) => (
    <div className="flex items-center gap-2">
        {verified ? (
            <>
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-green-700 dark:text-green-300">Terverifikasi</span>
            </>
        ) : (
            <>
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="font-semibold text-orange-700 dark:text-orange-300">Belum Diverifikasi</span>
            </>
        )}
    </div>
);

// Enhanced team member card
const TeamMemberCard = ({ member, index }: { member: any; index: number }) => {
    const isLeader = member.role === "leader";

    return (
        <div className="flex items-center justify-between p-4 bg-muted/30 dark:bg-gray-700/30 rounded-lg hover:bg-muted/50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isLeader
                    ? 'bg-blue-100 dark:bg-blue-900/50'
                    : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                    {isLeader ? (
                        <Crown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                </div>
                <div>
                    <div className="font-medium text-foreground dark:text-gray-100">{member.name}</div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400 flex items-center gap-1">
                        <IdCard className="h-3 w-3" />
                        NIM: {member.nim}
                    </div>
                </div>
            </div>
            <Badge
                variant={isLeader ? "default" : "secondary"}
                className={isLeader
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                    : "dark:bg-gray-700 dark:text-gray-300"
                }
            >
                {member.role === "leader" ? "Ketua" : "Anggota"}
            </Badge>
        </div>
    );
};

// Enhanced lecturer card
const LecturerCard = ({ lecturer }: { lecturer: any }) => (
    <div className="flex items-center gap-4 p-4 bg-muted/30 dark:bg-gray-700/30 rounded-lg">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
            <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
            <div className="font-medium text-foreground dark:text-gray-100">{lecturer.name}</div>
            <div className="text-sm text-muted-foreground dark:text-gray-400 flex items-center gap-1">
                <IdCard className="h-3 w-3" />
                NIP: {lecturer.nip}
            </div>
        </div>
    </div>
);

// Enhanced info card component
const InfoCard = ({
    icon: Icon,
    label,
    value,
    variant = "default"
}: {
    icon: any;
    label: string;
    value: string;
    variant?: "default" | "success" | "warning"
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case "success":
                return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20";
            case "warning":
                return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20";
            default:
                return "border-muted dark:border-gray-700 bg-muted/30 dark:bg-gray-800/30";
        }
    };

    return (
        <div className={`border rounded-lg p-4 hover:shadow-sm transition-shadow ${getVariantStyles()}`}>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2">
                <Icon className="h-4 w-4" />
                {label}
            </div>
            <div className="font-semibold text-foreground dark:text-gray-100">{value}</div>
        </div>
    );
};

export function DashboardInformation() {
    const { data, isPending, error } = useQuery({
        queryFn: getDashboardParticipantData,
        queryKey: ["dashboard_participant"],
    });

    // Loading state
    if (isPending) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <StatisticsCardSkeleton />
                    <StatisticsCardSkeleton />
                    <StatisticsCardSkeleton />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <TeamInfoSkeleton />
                    </div>
                    <div>
                        <Card className="dark:bg-gray-800 dark:border-gray-700">
                            <CardHeader>
                                <Skeleton className="h-6 w-32 dark:bg-gray-700" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <Skeleton key={i} className="h-16 w-full dark:bg-gray-700" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Alert variant="destructive" className="my-8 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="dark:text-red-300">Terjadi Kesalahan</AlertTitle>
                <AlertDescription className="dark:text-red-400">
                    Gagal memuat data dashboard. Silakan refresh halaman atau coba lagi nanti.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatisticsCard
                    title="Status Verifikasi"
                    value={data?.verified ? "Terverifikasi" : "Belum Diverifikasi"}
                    icon={data?.verified ? CheckCircle2 : Clock}
                    className={data?.verified
                        ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                        : "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20"
                    }
                />
                <StatisticsCard
                    title="Status Proposal"
                    value={data?.proposal ? "Sudah Upload" : "Belum Upload"}
                    icon={FileText}
                    className={data?.proposal
                        ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20"
                    }
                />
                <StatisticsCard
                    title="Status Kompetisi"
                    value={
                        data?.submission ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm">
                                    {data.submission.round === "preliminary" ? "Penyisihan" : "Final"}
                                </span>
                                <StatusBadge status={data.submission.status as any} />
                            </div>
                        ) : (
                            "Pending"
                        )
                    }
                    icon={Trophy}
                    className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Team Status Card */}
                <Card className="lg:col-span-2 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b dark:border-gray-700">
                        <CardTitle className="flex items-center gap-2 text-xl dark:text-gray-100">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Status Tim Saya
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Team Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={Users}
                                    label="Nama Tim"
                                    value={data?.name || "-"}
                                />
                                <InfoCard
                                    icon={Target}
                                    label="Kategori"
                                    value={data?.category || "-"}
                                />
                                <InfoCard
                                    icon={Building2}
                                    label="Asal Politeknik"
                                    value={data?.institution || "-"}
                                />
                                <InfoCard
                                    icon={data?.verified ? CheckCircle2 : Clock}
                                    label="Status Verifikasi"
                                    value={data?.verified ? "Terverifikasi" : "Belum Diverifikasi"}
                                    variant={data?.verified ? "success" : "warning"}
                                />
                            </div>

                            {/* Lecturer Section */}
                            <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 dark:border-gray-700">
                                <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground dark:text-gray-100">
                                    <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    Dosen Pendamping
                                </h3>
                                <LecturerCard lecturer={data?.lecture} />
                            </div>

                            {/* Team Members Section */}
                            <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 dark:border-gray-700">
                                <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground dark:text-gray-100">
                                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    Anggota Tim ({data?.teamMember?.length || 0} orang)
                                </h3>
                                <div className="space-y-3">
                                    {data?.teamMember?.map((member, index) => (
                                        <TeamMemberCard
                                            key={member.name + index}
                                            member={member}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Status Alert */}
                            {!data?.verified && (
                                <Alert className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                                    <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    <AlertTitle className="text-orange-800 dark:text-orange-300">Perhatian</AlertTitle>
                                    <AlertDescription className="text-orange-700 dark:text-orange-400">
                                        Tim Anda belum terverifikasi. Pastikan semua dokumen telah dilengkapi dan menunggu konfirmasi dari admin.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {!data?.proposal && (
                                <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <AlertTitle className="text-blue-800 dark:text-blue-300">Upload Proposal</AlertTitle>
                                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                                        Jangan lupa untuk mengupload proposal tim Anda sebelum batas waktu yang ditentukan.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline Info */}
                <div className="space-y-6">
                    <TimeLineInfo />

                    {/* Quick Stats Card */}
                    <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 dark:bg-gray-800 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg dark:text-gray-100">
                                <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                                Ringkasan Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground dark:text-gray-400">Verifikasi</span>
                                    <VerificationStatus verified={data?.verified || false} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground dark:text-gray-400">Proposal</span>
                                    <Badge
                                        variant={data?.proposal ? "default" : "secondary"}
                                        className={data?.proposal
                                            ? "dark:bg-gray-700 dark:text-gray-200"
                                            : "dark:bg-gray-600 dark:text-gray-300"
                                        }
                                    >
                                        {data?.proposal ? "Sudah Upload" : "Belum Upload"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground dark:text-gray-400">Anggota</span>
                                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                                        {data?.teamMember?.length || 0} orang
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}