import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsCard } from "@/components/ui/statistics-card";
import { getDashboardAdminData } from "@/lib/apis/dashboard";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, FileText, Users, XCircle } from "lucide-react";
import { TimeLineInfo } from "./TimeLineInfo";
import { formatTanggal } from "@/lib/formatTanggal";
import { CategoryChart } from "./CategoryChart";

export default function DashboardAdmin() {
    const { isPending, data } = useQuery({
        queryKey: ["dashboard_admin"],
        queryFn: getDashboardAdminData
    })
    return (
        <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
                <StatisticsCard
                    title="Total Team"
                    value={data?.totalTeam!}
                    icon={Users}
                />
                <StatisticsCard
                    title="Total Proposal"
                    value={data?.submittedProposal!}
                    icon={FileText}
                />
                <StatisticsCard
                    title="Proposal Disetujui"
                    value={data?.approveProposal!}
                    icon={CheckCircle}
                />
                <StatisticsCard
                    title="Proposal Ditolak"
                    value={data?.rejectedProposal!}
                    icon={XCircle}
                />
                <StatisticsCard
                    title="Proposal Pending"
                    value={data?.pendingProposal!}
                    icon={Clock}
                />
            </div>
            <div className="grid gap-3 lg:grid-cols-6">
                <CategoryChart className={"md:col-span-4"} data={data?.teamCategoryData!} />

                <TimeLineInfo className="md:col-span-2" />
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Pendaftaran Tim Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data?.recentTeams.map((rt, i) => (
                                <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{rt.teamName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatTanggal(rt.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Kategori {rt.category}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Pengajuan Proposal Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data?.recentProposal.map((rp, i) => (
                                <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{rp.proposalTitle}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Team {rp.proposalTeam}
                                        </p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatTanggal(rp.createdAt)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}