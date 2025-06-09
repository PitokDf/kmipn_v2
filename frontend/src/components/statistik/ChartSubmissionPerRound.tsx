'use client'

import { SubmissionStatsData } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "./ChartTimVerifikasi";

export function ChartSubmissionPerRound({ data }: { data: SubmissionStatsData[] }) {
    return (
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
                    <BarChart data={data || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="round" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}