"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A pie chart with a label list"

const chartConfig = {
    value: {
        label: "Total"
    },
    Disetujui: {
        label: "Disetujui",
        color: "hsl(var(--chart-1))",
    },
    Pending: {
        label: "Pending",
        color: "hsl(var(--chart-5))",
    },
    Ditolak: {
        label: "Ditolak",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function ChartPieLabelList({ data }: { data: any }) {

    return (
        <Card className="flex flex-col bg-white border-white">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Status Proposal
                </CardTitle>
                <CardDescription>Distribusi status proposal tim</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="status" hideLabel />}
                        />
                        <Pie data={(data as any[]).map((data) => ({ ...data, fill: `var(--color-${data.status})` }))} dataKey="value">
                            <LabelList
                                dataKey="status"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
