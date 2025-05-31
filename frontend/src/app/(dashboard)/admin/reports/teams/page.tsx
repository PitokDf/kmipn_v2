"use client";

import { useState } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Download, FileText, Users } from "lucide-react";
import { CategoryChart } from "@/components/features/admin/CategoryChart";

export default function TeamsReportPage() {
    const [user] = useState({
        name: "Admin User",
        role: "admin" as const,
    });

    const teamsByCategory = [
        { name: "Software Development", count: 42 },
        { name: "IoT", count: 36 },
        { name: "AI", count: 28 },
        { name: "Cybersecurity", count: 22 },
        { name: "Data Science", count: 18 },
        { name: "UI/UX", count: 10 },
    ];

    const teamsByInstitution = [
        { institution: "Politeknik Negeri Jakarta", count: 25 },
        { institution: "Politeknik Elektronika Negeri Surabaya", count: 20 },
        { institution: "Politeknik Negeri Bandung", count: 18 },
        { institution: "Politeknik Negeri Malang", count: 15 },
        { institution: "Politeknik Negeri Semarang", count: 12 },
    ];

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Teams Report</h1>
                    <p className="text-muted-foreground">
                        Analyze team participation and distribution
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
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
                                    <div className="text-3xl font-bold">156</div>
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
                                    <div className="text-3xl font-bold">142</div>
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
                                    <div className="text-3xl font-bold">91%</div>
                                    <p className="text-muted-foreground">Submission rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CategoryChart data={teamsByCategory} />

                    <Card>
                        <CardHeader>
                            <CardTitle>Teams by Institution</CardTitle>
                            <CardDescription>
                                Top institutions by team participation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={teamsByInstitution}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="institution" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" name="Number of Teams" fill="hsl(var(--chart-2))" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Team Statistics</CardTitle>
                        <CardDescription>
                            Detailed breakdown of team participation
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
                                <div className="space-y-4">
                                    {teamsByCategory.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {Math.round((item.count / 156) * 100)}% of total teams
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{item.count}</p>
                                                <p className="text-sm text-muted-foreground">teams</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-4">Institution Breakdown</h3>
                                <div className="space-y-4">
                                    {teamsByInstitution.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{item.institution}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {Math.round((item.count / 156) * 100)}% of total teams
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{item.count}</p>
                                                <p className="text-sm text-muted-foreground">teams</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}