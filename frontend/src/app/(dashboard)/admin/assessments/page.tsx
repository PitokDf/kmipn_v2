"use client";

import { useState } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, BarChart, Download, MoreHorizontal, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

type AssessmentItem = {
    id: number;
    proposalId: number;
    proposalTitle: string;
    teamName: string;
    category: string;
    jurorName: string;
    score: number;
    status: "approve" | "pending" | "rejected";
    createdAt: string;
};

export default function AssessmentsPage() {
    const [user] = useState({
        name: "Admin User",
        role: "admin" as const,
    });

    const mockAssessments: AssessmentItem[] = Array.from({ length: 30 }).map((_, i) => ({
        id: i + 1,
        proposalId: 100 + i,
        proposalTitle: `Project ${String.fromCharCode(65 + (i % 26))}`,
        teamName: `Team ${String.fromCharCode(65 + (i % 26))}`,
        category: ["Software Development", "IoT", "AI", "Cybersecurity", "Data Science", "UI/UX"][i % 6],
        jurorName: `Juror ${i % 5 + 1}`,
        score: Math.floor(Math.random() * 50) + 50, // Random score between 50-100
        status: ["approve", "pending", "rejected"][i % 3] as "approve" | "pending" | "rejected",
        createdAt: new Date(Date.now() - (i * 86400000 / 2)).toISOString(),
    }));

    const [assessments] = useState<AssessmentItem[]>(mockAssessments);

    // Analytics data
    const scoreDistribution = [
        { range: "50-60", count: 3 },
        { range: "61-70", count: 7 },
        { range: "71-80", count: 12 },
        { range: "81-90", count: 5 },
        { range: "91-100", count: 3 },
    ];

    const categoryAverages = [
        { category: "Software Dev", average: 78 },
        { category: "IoT", average: 82 },
        { category: "AI", average: 76 },
        { category: "Cybersecurity", average: 85 },
        { category: "Data Science", average: 79 },
        { category: "UI/UX", average: 81 },
    ];

    const columns: ColumnDef<AssessmentItem>[] = [
        {
            accessorKey: "proposalTitle",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Proposal
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "teamName",
            header: "Team",
        },
        {
            accessorKey: "category",
            header: "Category",
        },
        {
            accessorKey: "jurorName",
            header: "Juror",
        },
        {
            accessorKey: "score",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const score = row.getValue("score") as number;
                let color = "text-amber-600";
                if (score >= 80) color = "text-green-600";
                else if (score < 60) color = "text-red-600";

                return <div className={`font-medium ${color}`}>{score}</div>;
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as "approve" | "pending" | "rejected";
                return <StatusBadge status={status} />;
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt") as string);
                return <div>{date.toLocaleDateString()}</div>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const assessment = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(assessment.id.toString())}>
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit assessment</DropdownMenuItem>
                            <DropdownMenuItem>View proposal</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete assessment</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Assessment Management</h1>
                    <p className="text-muted-foreground">
                        Manage and analyze proposal assessments
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Assessment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Add New Assessment</DialogTitle>
                                <DialogDescription>
                                    Create a new assessment for a proposal.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="proposal" className="text-right">
                                        Proposal
                                    </Label>
                                    <div className="col-span-3">
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a proposal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 10 }).map((_, i) => (
                                                    <SelectItem key={i} value={`proposal-${i + 1}`}>
                                                        {`Project ${String.fromCharCode(65 + i)} - Team ${String.fromCharCode(65 + i)}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="juror" className="text-right">
                                        Juror
                                    </Label>
                                    <div className="col-span-3">
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a juror" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <SelectItem key={i} value={`juror-${i + 1}`}>
                                                        {`Juror ${i + 1}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Score: <span className="text-blue-600 font-medium">75</span>
                                    </Label>
                                    <Slider defaultValue={[75]} max={100} step={1} />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>0</span>
                                        <span>25</span>
                                        <span>50</span>
                                        <span>75</span>
                                        <span>100</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="comments">Comments</Label>
                                    <Textarea
                                        id="comments"
                                        placeholder="Enter assessment comments"
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right">
                                        Status
                                    </Label>
                                    <div className="col-span-3">
                                        <Select defaultValue="pending">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="approve">Approve</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="rejected">Reject</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button type="submit">Save Assessment</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="list">Assessments List</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>Proposal Assessments</CardTitle>
                            <CardDescription>
                                A list of all assessments for competition proposals.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={assessments}
                                searchKey="proposalTitle"
                                searchPlaceholder="Search assessments..."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
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
                                        <RechartsBarChart data={scoreDistribution}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="range" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" name="Number of Proposals" fill="hsl(var(--chart-1))" />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Average Scores by Category</CardTitle>
                                <CardDescription>
                                    Comparison of average scores across categories
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsBarChart data={categoryAverages}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="category" />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="average" name="Average Score" fill="hsl(var(--chart-2))" />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Assessment Summary</CardTitle>
                                <CardDescription>
                                    Key metrics from the assessment process
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-muted rounded-lg p-4">
                                        <div className="text-muted-foreground mb-2">Total Assessments</div>
                                        <div className="text-3xl font-bold">{assessments.length}</div>
                                    </div>

                                    <div className="bg-muted rounded-lg p-4">
                                        <div className="text-muted-foreground mb-2">Average Score</div>
                                        <div className="text-3xl font-bold">
                                            {Math.round(assessments.reduce((acc, item) => acc + item.score, 0) / assessments.length)}
                                        </div>
                                    </div>

                                    <div className="bg-muted rounded-lg p-4">
                                        <div className="text-muted-foreground mb-2">Approval Rate</div>
                                        <div className="text-3xl font-bold">
                                            {Math.round((assessments.filter(a => a.status === "approve").length / assessments.length) * 100)}%
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium mb-4">Top Scoring Proposals</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-3 px-4">Proposal</th>
                                                    <th className="text-left py-3 px-4">Team</th>
                                                    <th className="text-left py-3 px-4">Category</th>
                                                    <th className="text-left py-3 px-4">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assessments
                                                    .sort((a, b) => b.score - a.score)
                                                    .slice(0, 5)
                                                    .map((assessment) => (
                                                        <tr key={assessment.id} className="border-b">
                                                            <td className="py-3 px-4 font-medium">{assessment.proposalTitle}</td>
                                                            <td className="py-3 px-4">{assessment.teamName}</td>
                                                            <td className="py-3 px-4">{assessment.category}</td>
                                                            <td className="py-3 px-4 font-medium text-green-600">{assessment.score}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}