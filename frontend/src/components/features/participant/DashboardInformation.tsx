// 'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsCard } from "@/components/ui/statistics-card";
import { getDashboardParticipantData } from "@/lib/apis/dashboard";
import { useQuery } from "@tanstack/react-query";
import { FlagIcon, Users } from "lucide-react";
import { TimeLineInfo } from "../admin/TimeLineInfo";
import { StatusBadge } from "@/components/ui/status-badge";


export function DashboardInformation() {
    const { data, isPending } = useQuery({
        queryFn: getDashboardParticipantData,
        queryKey: ["dashboard_participant"],
    })
    return (
        <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-3">
                <StatisticsCard
                    title="Data Anggota"
                    value={data?.verified ? "Terverifikasi" : "Belum diverifikasi"}
                    icon={Users}
                />
                <StatisticsCard
                    title="Unggah Proposal"
                    value={data?.proposal! || "Belum Upload"}
                    icon={Users}
                />
                <StatisticsCard
                    title="Ronde"
                    value={<>
                        {data?.submission ? (
                            <div className="flex gap-2">
                                <span>
                                    {data?.submission?.round === "preliminary" ? "Penyisihan" : "Final"}
                                </span>
                                <StatusBadge status={data?.submission.status as any} />
                            </div>
                        )
                            : "Pending"}
                    </>}
                    icon={FlagIcon}
                />
            </div>
            <div className="grid gap-3 lg:grid-cols-6">
                <Card className="md:col-span-4">
                    <CardHeader>
                        <CardTitle>Status Team Saya</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-md p-4">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Nama Team</div>
                                    <div className="font-semibold">{data?.name}</div>
                                </div>
                                <div className="border rounded-md p-4">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Kategori</div>
                                    <div className="font-semibold">{data?.category}</div>
                                </div>
                                <div className="border rounded-md p-4">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Asal Politeknik</div>
                                    <div className="font-semibold">{data?.institution}</div>
                                </div>
                                <div className="border rounded-md p-4">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Verification Status</div>
                                    <div className={`font-semibold ${data?.verified ? "text-green-600" : "text-orange-600"} `}>{data?.verified ? "Terverifikasi" : "Belum diverifikasi"}</div>
                                </div>
                            </div>

                            <div className="border rounded-md p-4">
                                <h3 className="font-semibold mb-2">Dosen Pendamping</h3>
                                <div className="flex justify-between items-center pb-2 border-b">
                                    <div>
                                        <div className="font-medium">{data?.lecture.name}</div>
                                        <div className="text-sm text-muted-foreground">NIP: {data?.lecture.nip}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-md p-4">
                                <h3 className="font-semibold mb-2">Anggota Team</h3>
                                <div className="space-y-2">
                                    {
                                        data?.teamMember?.map((member, index) => (
                                            <div key={member.name + index} className="flex justify-between items-center pb-2 border-b">
                                                <div>
                                                    <div className="font-medium">{member.name}</div>
                                                    <div className="text-sm text-muted-foreground">NIM: {member.nim}</div>
                                                </div>
                                                <div className={`text-sm ${member.role === "leader" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}  px-2 py-1 rounded`}>
                                                    {member.role}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <TimeLineInfo className="md:col-span-2" />
            </div>
        </div>
    )
}