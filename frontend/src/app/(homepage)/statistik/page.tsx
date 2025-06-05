'use client'

import { ChartDistribusiCategory } from "@/components/statistik/ChartDistribusiCategory";
import { ChartPieLabelList } from "@/components/statistik/Proposal";
import { ChartTopInstitusi } from "@/components/statistik/TopInstitusi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatistikData } from "@/lib/apis/dashboard";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, CheckCircle, Building, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

// Mock data based on your database schema
const mockCategoryData = [
    { category: "Software Engineering", count: 45 },
    { category: "Data Science", count: 32 },
    { category: "Cybersecurity", count: 28 },
    { category: "Game Development", count: 19 },
    { category: "IoT & Embedded", count: 15 }
];

const mockProposalStatusData = [
    { status: "Approve", value: 85 },
    { status: "Pending", value: 34 },
    { status: "Rejected", value: 20 }
];

const mockVerifiedTeams = [
    { status: "Terverifikasi", count: 98 },
    { status: "Belum Terverifikasi", count: 41 }
];

const mockInstitutionData = [
    { institution: "Universitas Indonesia", count: 23 },
    { institution: "Institut Teknologi Bandung", count: 19 },
    { institution: "Universitas Gadjah Mada", count: 16 },
    { institution: "Institut Teknologi Sepuluh Nopember", count: 14 },
    { institution: "Universitas Brawijaya", count: 12 }
];

const mockSubmissionData = [
    { round: "Preliminary", count: 139 },
    { round: "Final", count: 32 }
];

const mockScoreDistribution = [
    { range: "90-100", count: 12 },
    { range: "80-89", count: 28 },
    { range: "70-79", count: 45 },
    { range: "60-69", count: 31 },
    { range: "< 60", count: 15 }
];

const mockUserRoleData = [
    { role: "Participant", count: 420 },
    { role: "Admin", count: 5 },
    { role: "Operator", count: 12 }
];

export default function StatistikPage() {
    const { data, isPending: isLoading } = useQuery({
        queryKey: ['statistik'],
        queryFn: getStatistikData
    })
    const [categoryData, setCategoryData] = useState([]);
    const [proposalStatusData, setProposalStatusData] = useState([]);
    const [verifiedTeams, setVerifiedTeams] = useState([]);
    const [institutionData, setInstitutionData] = useState([]);
    const [submissionData, setSubmissionData] = useState([]);
    const [scoreDistribution, setScoreDistribution] = useState([]);
    const [userRoleData, setUserRoleData] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Simulate API call
    //             setTimeout(() => {
    //                 setCategoryData(mockCategoryData);
    //                 setProposalStatusData(mockProposalStatusData);
    //                 setVerifiedTeams(mockVerifiedTeams);
    //                 setInstitutionData(mockInstitutionData);
    //                 setSubmissionData(mockSubmissionData);
    //                 setScoreDistribution(mockScoreDistribution);
    //                 setUserRoleData(mockUserRoleData);
    //                 setIsLoading(false);
    //             }, 1000);

    //             // Uncomment when API is ready
    //             // const res = await axios.get("/api/statistics");
    //             // const data = res.data;
    //             // setCategoryData(data.categoryDistribution);
    //             // setProposalStatusData(data.proposalStatuses);
    //             // setVerifiedTeams(data.verifiedVsUnverified);
    //             // setInstitutionData(data.topInstitutions);
    //             // setRoundData(data.finalRoundProgress);
    //         } catch (error) {
    //             console.error("Error fetching statistics:", error);
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-blue-600">
                        {`${payload[0].dataKey}: ${payload[0].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    const LoadingCard = () => (
        <Card className="animate-pulse">
            <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="h-64">
                <div className="h-full bg-gray-100 rounded"></div>
            </CardContent>
        </Card>
    );

    const summaryStats = [
        {
            title: "Total Tim",
            value: data?.categoryStatsData.reduce((sum, item) => sum + item.count, 0),
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Proposal Approved",
            value: data?.proposalStatusStatsData.find(item => item.status === "Disetujui")?.value || 0,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "Tim Terverifikasi",
            value: data?.verifiedTeamStatsData.find(item => item.status === "Terverifikasi")?.count || 0,
            icon: Trophy,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
        },
        {
            title: "Institusi Aktif",
            value: data?.institutionStatsData.length,
            icon: Building,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                        <TrendingUp className="text-blue-600" size={40} />
                        Dashboard Statistik
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Pantau perkembangan kompetisi dengan data real-time dan visualisasi yang interaktif
                    </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {summaryStats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={index} className="hover:shadow-lg transition-all bg-white duration-300 border-0 shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {isLoading ? "..." : stat?.value!.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                            <IconComponent className={`${stat.color}`} size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Charts Grid */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Category Distribution */}
                    {isLoading ? <LoadingCard /> : (
                        <ChartDistribusiCategory
                            data={data?.categoryStatsData}
                        />

                    )}

                    {/* Proposal Status */}
                    {isLoading ? <LoadingCard /> : (
                        <ChartPieLabelList data={data?.proposalStatusStatsData} />
                    )}

                    {/* Verified Teams */}
                    {isLoading ? <LoadingCard /> : (
                        <Card className="hover:shadow-lg bg-white transition-shadow duration-300 border-0 shadow-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    Status Verifikasi Tim
                                </CardTitle>
                                <p className="text-sm text-gray-600">Perbandingan tim terverifikasi dan belum</p>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.verifiedTeamStatsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Top Institutions */}
                    {isLoading ? <LoadingCard /> : (
                        <ChartTopInstitusi data={data?.institutionStatsData!} />
                    )}

                    {/* Submission Status by Round */}
                    {isLoading ? <LoadingCard /> : (
                        <Card className="hover:shadow-lg bg-white transition-shadow duration-300 border-0 shadow-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    Submission per Round
                                </CardTitle>
                                <p className="text-sm text-gray-600">Jumlah submission di setiap babak</p>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.submissionStatsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="round" tick={{ fontSize: 12 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}