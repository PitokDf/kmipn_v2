"use client";

import { useState } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Download, FileText, Users } from "lucide-react";
import { CategoryChart } from "@/components/features/admin/CategoryChart";
import { useQuery } from "@tanstack/react-query";
import { getReportTeam } from "@/lib/apis/dashboard";
import ExportButton from "@/components/features/admin/ExportToExcelTeam";

export default function TeamsReportPage() {
    const { data, isPending } = useQuery({
        queryKey: ["team_report"],
        queryFn: getReportTeam
    })

    if (isPending) return (
        <p>Loading...</p>
    )

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Teams Report</h1>
                    <p className="text-muted-foreground">
                        Analyze team participation and distribution
                    </p>
                </div>
                <ExportButton
                    data={{ categoryDistribution: data?.categoryDistribution!, teamsByCategory: data?.teamsByCategory! }} />
            </div>

            <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Teams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-600 mr-2" />
                                <div>
                                    <div className="text-3xl font-bold">{data?.totalTeam}</div>
                                    <p className="text-muted-foreground">Registered teams</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Teams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-green-600 mr-2" />
                                <div>
                                    <div className="text-3xl font-bold">{data?.totalTeamWithSubmission}</div>
                                    <p className="text-muted-foreground">Teams with submissions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Participation Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-orange-600 mr-2" />
                                <div>
                                    <div className="text-3xl font-bold">{data?.participantRate}%</div>
                                    <p className="text-muted-foreground">Submission rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    <CategoryChart className="md:col-span-4" data={data?.teamsByCategory!} />

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Team Statistics</CardTitle>
                            <CardDescription>
                                Detailed breakdown of team participation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
                                <div className="space-y-4">
                                    {data?.categoryDistribution.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.percent}% of total teams
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{item.totalTeam}</p>
                                                <p className="text-sm text-muted-foreground">teams</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}