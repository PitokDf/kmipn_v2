'use client'

import { VerifiedTeamStatsData } from "@/types/api"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function ChartStatusTimVerifikasi({ data }: { data: VerifiedTeamStatsData[] }) {
    return (
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
                    <BarChart data={data || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
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