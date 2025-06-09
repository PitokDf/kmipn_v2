import { ChartDistribusiCategory } from "@/components/statistik/ChartDistribusiCategory";
import { ChartSubmissionPerRound } from "@/components/statistik/ChartSubmissionPerRound";
import { ChartStatusTimVerifikasi } from "@/components/statistik/ChartTimVerifikasi";
import { ChartPieLabelList } from "@/components/statistik/Proposal";
import { ChartTopInstitusi } from "@/components/statistik/TopInstitusi";
import { Card, CardContent } from "@/components/ui/card";
import { StatistikData } from "@/types/api";
import { TrendingUp, Users, CheckCircle, Building, Trophy } from "lucide-react";
import Head from "next/head";

export const metadata = {
    title: "Dashboard Statistik | KMIPN",
    description: "Statistik kompetisi mahasiswa politeknik se-Indonesia",
};

export default async function StatistikPage() {
    // const data = (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statistik`)) // SSR Fetching
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statistik`, {
        cache: 'no-store',
    });

    const data = (await res.json()).data as StatistikData;

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

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "Statistik KMIPN",
        "description": "Statistik kompetisi mahasiswa politeknik se-Indonesia.",
        "url": "https://kmipn.pnp.ac.id/statistik",
        "creator": {
            "@type": "Organization",
            "name": "Politeknik Negeri Padang",
        },
        "distribution": [
            {
                "@type": "DataDownload",
                "encodingFormat": "application/json",
                "contentUrl": `${process.env.NEXT_PUBLIC_API_URL}/api/statistik`,
            }
        ],
        "variableMeasured": [
            {
                "@type": "PropertyValue",
                "name": "Total Tim",
                "value": data?.categoryStatsData.reduce((sum, item) => sum + item.count, 0),
            },
            {
                "@type": "PropertyValue",
                "name": "Proposal Disetujui",
                "value": data.proposalStatusStatsData.find(item => item.status === "Disetujui")?.value || 0
            },
            {
                "@type": "PropertyValue",
                "name": "Tim Terverifikasi",
                "value": data.verifiedTeamStatsData.find(item => item.status === "Terverifikasi")?.count || 0,
            },
            {
                "@type": "PropertyValue",
                "name": "Institusi Aktif",
                "value": data.institutionStatsData.length
            },
        ]
    }


    return (
        <>
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>
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
                                                    {stat?.value!.toLocaleString()}
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
                        <ChartDistribusiCategory data={data?.categoryStatsData || []} />
                        <ChartPieLabelList data={data?.proposalStatusStatsData || []} />
                        <ChartStatusTimVerifikasi data={data.verifiedTeamStatsData} />
                        <ChartTopInstitusi data={data?.institutionStatsData || []} />
                        <ChartSubmissionPerRound data={data.submissionStatsData} />
                    </div>
                </div>
            </div>
        </>
    );
}
