"use client";

import { useState } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, LineChart, Line } from "recharts";
import { Download, Award, FileText } from "lucide-react";

export default function AssessmentsReportPage() {
  const [user] = useState({
    name: "Admin User",
    role: "admin" as const,
  });

  const scoreDistribution = [
    { range: "50-60", count: 3 },
    { range: "61-70", count: 7 },
    { range: "71-80", count: 12 },
    { range: "81-90", count: 5 },
    { range: "91-100", count: 3 },
  ];

  const categoryAverages = [
    { category: "Software Development", average: 78 },
    { category: "IoT", average: 82 },
    { category: "AI", average: 76 },
    { category: "Cybersecurity", average: 85 },
    { category: "Data Science", average: 79 },
    { category: "UI/UX", average: 81 },
  ];

  const assessmentTrend = [
    { day: "Mon", completed: 12 },
    { day: "Tue", completed: 18 },
    { day: "Wed", completed: 15 },
    { day: "Thu", completed: 22 },
    { day: "Fri", completed: 20 },
    { day: "Sat", completed: 10 },
    { day: "Sun", completed: 8 },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Assessments Report</h1>
          <p className="text-muted-foreground">
            Analysis of proposal assessments and scoring
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
              <CardTitle>Total Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-2" />
                <div>
                  <div className="text-3xl font-bold">142</div>
                  <p className="text-muted-foreground">Completed assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600 mr-2" />
                <div>
                  <div className="text-3xl font-bold">78.5</div>
                  <p className="text-muted-foreground">Overall average</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Award className="h-8 w-8 text-orange-600 mr-2" />
                <div>
                  <div className="text-3xl font-bold">65%</div>
                  <p className="text-muted-foreground">Teams above threshold</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>
                Distribution of assessment scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Teams" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Scores by Category</CardTitle>
              <CardDescription>
                Performance comparison across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryAverages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" name="Average Score" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Progress</CardTitle>
            <CardDescription>
              Weekly assessment completion trend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={assessmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed Assessments"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Statistics</CardTitle>
            <CardDescription>
              Detailed breakdown of assessment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Score Distribution</h3>
                <div className="space-y-4">
                  {scoreDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Score Range: {item.range}</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((item.count / 30) * 100)}% of total assessments
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
                <h3 className="text-lg font-medium mb-4">Category Performance</h3>
                <div className="space-y-4">
                  {categoryAverages.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.category}</p>
                        <p className="text-sm text-muted-foreground">
                          Average score
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.average}</p>
                        <p className="text-sm text-muted-foreground">points</p>
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