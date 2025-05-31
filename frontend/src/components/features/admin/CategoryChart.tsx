import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TeamCategoryData } from "@/types/api";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis } from "recharts";

const chartConfig = {
    desktop: {
        label: "Kategori",
        color: "hsl(var(--chart-1))"
    },

} satisfies ChartConfig


export function CategoryChart({ data }: { data: TeamCategoryData[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
                <BarChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        top: 20
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 15)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="count" fill="var(--color-desktop)" radius={8}>
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </ResponsiveContainer>
    )
}