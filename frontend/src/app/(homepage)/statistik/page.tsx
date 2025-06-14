import { ChartDistribusiCategory } from "@/components/statistik/ChartDistribusiCategory";
import { ChartSubmissionPerRound } from "@/components/statistik/ChartSubmissionPerRound";
import { ChartStatusTimVerifikasi } from "@/components/statistik/ChartTimVerifikasi";
import { ChartPieLabelList } from "@/components/statistik/Proposal";
import { ChartTopInstitusi } from "@/components/statistik/TopInstitusi";
import { Card, CardContent } from "@/components/ui/card";
import { StatistikData } from "@/types/api";
import { TrendingUp, Users, CheckCircle, Building, Trophy } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Statistik | KMIPN VII",
    description: "statistik lengkap KMIPN 2025 dengan data real-time jumlah tim, proposal yang disetujui, institusi peserta, dan analisis kompetisi mahasiswa politeknik se-Indonesia.",
    keywords: "KMIPN, kompetisi mahasiswa politeknik, statistik, dashboard, politeknik indonesia, lomba mahasiswa, data kompetisi",
    authors: [{ name: "Pito Desri Pauzi" }],
    creator: "Politeknik Negeri Padang",
    publisher: "KMIPN",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: "Statistik | KMIPN VII",
        description: "Pantau perkembangan kompetisi mahasiswa politeknik Indonesia dengan visualisasi data interaktif dan statistik real-time.",
        url: "https://kmipn.pnp.ac.id/statistik",
        siteName: "KMIPN",
        images: [
            {
                url: "https://kmipn.pnp.ac.id/images/logos/kmipn-logo.png",
                width: 1200,
                height: 630,
                alt: "Statistik KMIPN 2025",
            },
        ],
        locale: "id_ID",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Statistik KMIPN 2025",
        description: "Visualisasi data kompetisi mahasiswa politeknik Indonesia",
        images: ["https://kmipn.pnp.ac.id/images/logos/kmipn-logo.png"],
    },
    alternates: {
        canonical: "https://kmipn.pnp.ac.id/statistik",
    },
};

let data: StatistikData | null = null

export default async function StatistikPage() {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statistik`, {
            next: { revalidate: 180 },
        });

        if (!res.ok) {
            console.log('error');
        }

        data = (await res.json()).data as StatistikData;
    } catch (error) {
        console.error("Fetch statistik gagal: ", error);
    }

    const totalTim = data?.categoryStatsData.reduce((sum, item) => sum + item.count, 0) || 0;
    const proposalApproved = data?.proposalStatusStatsData.find(item => item.status === "Disetujui")?.value || 0;
    const timTerverifikasi = data?.verifiedTeamStatsData.find(item => item.status === "Terverifikasi")?.count || 0;
    const institusiAktif = data?.institutionStatsData.length || 0;

    const summaryStats = [
        {
            title: "Total Tim Peserta",
            value: totalTim,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Proposal Disetujui",
            value: proposalApproved,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "Tim Terverifikasi",
            value: timTerverifikasi,
            icon: Trophy,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50"
        },
        {
            title: "Institusi Peserta",
            value: institusiAktif,
            icon: Building,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        }
    ];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "Statistik KMIPN 2025 - Kompetisi Mahasiswa Politeknik Indonesia",
        "description": "Dataset lengkap statistik Kompetisi Mahasiswa Politeknik Indonesia (KMIPN) 2025 termasuk data tim peserta, proposal, verifikasi, dan institusi.",
        "url": "https://kmipn.pnp.ac.id/statistik",
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": {
            "@type": "Organization",
            "name": "Politeknik Negeri Padang",
            "url": "https://pnp.ac.id",
        },
        "publisher": {
            "@type": "Organization",
            "name": "KMIPN",
            "url": "https://kmipn.pnp.ac.id"
        },
        "distribution": [
            {
                "@type": "DataDownload",
                "encodingFormat": "application/json",
                "contentUrl": `${process.env.NEXT_PUBLIC_API_URL}/statistik`,
            }
        ],
        "variableMeasured": [
            {
                "@type": "PropertyValue",
                "name": "Total Tim Peserta KMIPN 2025",
                "value": totalTim,
                "unitText": "tim"
            },
            {
                "@type": "PropertyValue",
                "name": "Jumlah Proposal Disetujui",
                "value": proposalApproved,
                "unitText": "proposal"
            },
            {
                "@type": "PropertyValue",
                "name": "Tim Terverifikasi",
                "value": timTerverifikasi,
                "unitText": "tim"
            },
            {
                "@type": "PropertyValue",
                "name": "Institusi Politeknik Peserta",
                "value": institusiAktif,
                "unitText": "institusi"
            },
        ],
        "spatialCoverage": {
            "@type": "Place",
            "name": "Indonesia"
        },
        "temporalCoverage": "2025"
    };

    if (!data) return <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Statistik tidak tersedia saat ini. Coba lagi nanti.</p>
    </div>

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Enhanced Header Section with SEO-friendly content */}
                    <header className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                            <TrendingUp className="text-blue-600" size={40} />
                            Statistik KMIPN 2025
                        </h1>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Pantau perkembangan <strong>Kompetisi Mahasiswa Politeknik Indonesia (KMIPN)</strong> dengan
                            data real-time dan visualisasi interaktif. Lihat statistik tim peserta, proposal yang disetujui,
                            dan institusi politeknik dari seluruh Indonesia.
                        </p>
                        <div className="text-sm text-gray-500">
                            Data diperbarui secara otomatis | Terakhir update: {(data as any).timestamps}
                        </div>
                    </header>

                    {/* Summary Stats with semantic HTML */}
                    <section aria-labelledby="statistik-ringkasan">
                        <h2 id="statistik-ringkasan" className="sr-only">Ringkasan Statistik KMIPN 2025</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {summaryStats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <Card key={index} className="hover:shadow-lg transition-all bg-white duration-300 border-0 shadow-md">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                                                    <p className="text-3xl font-bold text-gray-900" role="img" aria-label={`${stat.value} ${stat.title.toLowerCase()}`}>
                                                        {stat.value.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className={`p-3 rounded-full ${stat.bgColor}`} aria-hidden="true">
                                                    <IconComponent className={`${stat.color}`} size={24} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    {/* Charts Section with proper headings */}
                    <section aria-labelledby="visualisasi-data">
                        <h2 id="visualisasi-data" className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Visualisasi Data Kompetisi
                        </h2>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div role="img" aria-labelledby="chart-kategori" className="lg:col-span-2">
                                <h3 id="chart-kategori" className="sr-only">Distribusi Tim per Kategori Kompetisi</h3>
                                <ChartDistribusiCategory data={data?.categoryStatsData || []} />
                            </div>

                            <div role="img" aria-labelledby="chart-proposal">
                                <h3 id="chart-proposal" className="sr-only">Status Proposal KMIPN 2025</h3>
                                <ChartPieLabelList data={data?.proposalStatusStatsData || []} />
                            </div>

                            <div role="img" aria-labelledby="chart-verifikasi">
                                <h3 id="chart-verifikasi" className="sr-only">Status Verifikasi Tim</h3>
                                <ChartStatusTimVerifikasi data={data?.verifiedTeamStatsData || []} />
                            </div>

                            <div role="img" aria-labelledby="chart-institusi">
                                <h3 id="chart-institusi" className="sr-only">Top Institusi Politeknik Peserta</h3>
                                <ChartTopInstitusi data={data?.institutionStatsData || []} />
                            </div>

                            <div role="img" aria-labelledby="chart-submission" className="">
                                <h3 id="chart-submission" className="sr-only">Submission per Tahap Kompetisi</h3>
                                <ChartSubmissionPerRound data={data?.submissionStatsData || []} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}