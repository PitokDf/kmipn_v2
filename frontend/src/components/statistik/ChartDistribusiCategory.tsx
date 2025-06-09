"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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

export const description = "A bar chart with a label"

const chartConfig = {
    count: {
        label: "Kategori",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function ChartDistribusiCategory({ data }: { data: any }) {
    return (
        <Card className="bg-white border-white">
            <CardHeader>
                <CardTitle className="text-black"> Distribusi Tim per Kategori</CardTitle>
                <CardDescription>Total {(data as any[])?.reduce((sum, item) => sum + item.count, 0)} tim terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 15)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={({ payload }) => {
                                if (!payload?.length) return null;
                                const item = payload[0];
                                return (
                                    <div className="rounded-md border dark:border-gray-100 bg-white p-2 shadow-sm text-sm text-black">
                                        <div>
                                            <strong>{item.payload.category}</strong>: {item.payload.count} tim
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
