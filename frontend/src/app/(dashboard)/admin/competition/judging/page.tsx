"use client";

import { useState } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table";
import { AlertCircle, ArrowUpDown, Clock, FileText, MoreHorizontal, PlusCircle, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type JudgingAssignment = {
    id: number;
    proposalId: number;
    proposalTitle: string;
    teamName: string;
    category: string;
    jurorName: string;
    status: "pending" | "completed" | "in_progress";
    deadline: string;
};

export default function JudgingPage() {
    const [user] = useState({
        name: "Admin User",
        role: "admin" as const,
    });

    const mockAssignments: JudgingAssignment[] = Array.from({ length: 30 }).map((_, i) => ({
        id: i + 1,
        proposalId: 100 + i,
        proposalTitle: `Project ${String.fromCharCode(65 + (i % 26))}`,
        teamName: `Team ${String.fromCharCode(65 + (i % 26))}`,
        category: ["Software Development", "IoT", "AI", "Cybersecurity", "Data Science", "UI/UX"][i % 6],
        jurorName: `Juror ${i % 5 + 1}`,
        status: ["pending", "completed", "in_progress"][i % 3] as "pending" | "completed" | "in_progress",
        deadline: new Date(Date.now() + ((i % 7) * 86400000)).toISOString(),
    }));

    const [assignments] = useState<JudgingAssignment[]>(mockAssignments);

    const columns: ColumnDef<JudgingAssignment>[] = [
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
            header: "Assigned To",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as "pending" | "completed" | "in_progress";
                return <StatusBadge status={status as any} />;
            },
        },
        {
            accessorKey: "deadline",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Deadline
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue("deadline") as string);
                return <div>{date.toLocaleDateString()}</div>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const assignment = row.original;

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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(assignment.id.toString())}>
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Reassign juror</DropdownMenuItem>
                            <DropdownMenuItem>Update deadline</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Remove assignment</DropdownMenuItem>
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
                    <h1 className="text-3xl font-bold">Judging Management</h1>
                    <p className="text-muted-foreground">
                        Manage proposal assessments and juror assignments
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Assignment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Assignment</DialogTitle>
                            <DialogDescription>
                                Assign a proposal to a juror for assessment.
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
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <SelectItem key={i} value={`proposal-${i + 1}`}>
                                                    Project {String.fromCharCode(65 + i)} - Team {String.fromCharCode(65 + i)}
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
                                                    Juror {i + 1}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="deadline" className="text-right">
                                    Deadline
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="deadline"
                                        type="date"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Create Assignment</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Assignments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-blue-600 mr-2" />
                                <div>
                                    <div className="text-3xl font-bold">142</div>
                                    <p className="text-muted-foreground">Active assignments</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Jurors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-green-600 mr-2" />
                                <div>
                                    <div className="text-3xl font-bold">15</div>
                                    <p className="text-muted-foreground">Assigned jurors</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Completion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold">68%</div>
                                <Progress value={68} className="h-2" />
                                <p className="text-muted-foreground">97 of 142 completed</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Time Remaining</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-orange-600 mr-2" />
                                <div>
                                    <div className="text-3xl font-bold">5 days</div>
                                    <p className="text-muted-foreground">Until deadline</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Judging Assignments</CardTitle>
                        <CardDescription>
                            Manage and track assessment assignments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="all">All Assignments</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                            </TabsList>

                            <TabsContent value="all">
                                <DataTable
                                    columns={columns}
                                    data={assignments}
                                    searchKey="proposalTitle"
                                    searchPlaceholder="Search assignments..."
                                />
                            </TabsContent>

                            <TabsContent value="pending">
                                <DataTable
                                    columns={columns}
                                    data={assignments.filter(a => a.status === "pending")}
                                    searchKey="proposalTitle"
                                    searchPlaceholder="Search pending assignments..."
                                />
                            </TabsContent>

                            <TabsContent value="in_progress">
                                <DataTable
                                    columns={columns}
                                    data={assignments.filter(a => a.status === "in_progress")}
                                    searchKey="proposalTitle"
                                    searchPlaceholder="Search in-progress assignments..."
                                />
                            </TabsContent>

                            <TabsContent value="completed">
                                <DataTable
                                    columns={columns}
                                    data={assignments.filter(a => a.status === "completed")}
                                    searchKey="proposalTitle"
                                    searchPlaceholder="Search completed assignments..."
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Juror Workload</CardTitle>
                            <CardDescription>
                                Assessment distribution among jurors
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Juror {i + 1}</span>
                                            <span className="font-medium">{10 - i} assignments</span>
                                        </div>
                                        <Progress value={((10 - i) / 10) * 100} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Deadlines</CardTitle>
                            <CardDescription>
                                Assignments due soon
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {assignments
                                    .filter(a => a.status !== "completed")
                                    .slice(0, 5)
                                    .map((assignment) => (
                                        <div key={assignment.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-medium">{assignment.proposalTitle}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Assigned to {assignment.jurorName}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {new Date(assignment.deadline).toLocaleDateString()}
                                                </p>
                                                <StatusBadge status={assignment.status as any} />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Alert>

                </Alert>
            </div>
        </>
    )
}