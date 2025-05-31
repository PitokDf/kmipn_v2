import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getCategoryStats } from "@/lib/apis/category";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, FileText } from "lucide-react";

export function CategoriesStatistik() {
    const { data } = useQuery({
        queryKey: ["category_stats"],
        queryFn: getCategoryStats
    })

    const categoryStats = data?.categoryStats || []
    return (
        <Card>
            <CardHeader>
                <CardTitle>Category Statistics</CardTitle>
                <CardDescription>
                    Overview of teams and proposals by category.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">Category</th>
                                <th className="text-center py-3 px-4">Registered Teams</th>
                                <th className="text-center py-3 px-4">Submitted Proposals</th>
                                <th className="text-center py-3 px-4">Submission Rate</th>
                                <th className="text-center py-3 px-4">Days Until Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryStats?.map((stat, index) => (
                                <tr key={index} className="border-b">
                                    <td className="py-3 px-4 font-medium">{stat.name}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                            {stat.teams}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <FileText className="h-4 w-4 mr-2 text-green-600" />
                                            {stat.proposals}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {stat.submissionRate}%
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <Clock className="h-4 w-4 mr-2 text-orange-600" />
                                            {stat.daysUntilDeadline} days
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Total Teams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data?.totalTeams}</div>
                            <p className="text-sm text-muted-foreground">Across all categories</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Total Proposals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{data?.totalProposals}</div>
                            <p className="text-sm text-muted-foreground">Submission rate: {data?.submissionRate}%</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}