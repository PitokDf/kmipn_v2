"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, FileText, Users, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function RoundsPage() {
    const [user] = useState({
        name: "Admin User",
        role: "admin" as const,
    });

    const preliminaryStats = {
        totalTeams: 156,
        submittedTeams: 142,
        passedTeams: 85,
        submissionRate: 91,
        passRate: 60,
        daysLeft: 3,
    };

    const finalStats = {
        totalTeams: 85,
        submittedTeams: 78,
        presentedTeams: 45,
        submissionRate: 92,
        presentationRate: 58,
        daysLeft: 5,
    };

    // Mock team data
    const [teams] = useState([
        { id: 1, name: "Team Alpha", category: "Software Development", status: "pending" },
        { id: 2, name: "Team Beta", category: "IoT", status: "passed" },
        { id: 3, name: "Team Gamma", category: "AI", status: "failed" },
    ]);

    return (
        <DashboardLayout user={user}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Competition Rounds</h1>
                    <p className="text-muted-foreground">
                        Manage and monitor competition rounds
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Update Round Status</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Round Status</DialogTitle>
                            <DialogDescription>
                                Change the status of teams for the current round.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Select Team</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teams.map(team => (
                                            <SelectItem key={team.id} value={team.id.toString()}>
                                                {team.name} - {team.category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Round</Label>
                                <Select defaultValue="preliminary">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="preliminary">Preliminary</SelectItem>
                                        <SelectItem value="final">Final</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="passed">Pass</SelectItem>
                                        <SelectItem value="failed">Fail</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Comments (Optional)</Label>
                                <Input placeholder="Add any comments about the decision" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Update Status</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="preliminary" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="preliminary">Preliminary Round</TabsTrigger>
                    <TabsTrigger value="final">Final Round</TabsTrigger>
                    <TabsTrigger value="teams">Team Status</TabsTrigger>
                </TabsList>

                <TabsContent value="preliminary">
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
                                            <div className="text-3xl font-bold">{preliminaryStats.totalTeams}</div>
                                            <p className="text-muted-foreground">Registered teams</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Submission Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center">
                                        <FileText className="h-8 w-8 text-green-600 mr-2" />
                                        <div>
                                            <div className="text-3xl font-bold">{preliminaryStats.submissionRate}%</div>
                                            <p className="text-muted-foreground">{preliminaryStats.submittedTeams} teams submitted</p>
                                        </div>
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
                                            <div className="text-3xl font-bold">{preliminaryStats.daysLeft} days</div>
                                            <p className="text-muted-foreground">Until round ends</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Round Progress</CardTitle>
                                <CardDescription>
                                    Current status of the preliminary round
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Submissions</span>
                                        <span className="font-medium">{preliminaryStats.submissionRate}%</span>
                                    </div>
                                    <Progress value={preliminaryStats.submissionRate} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Assessment Progress</span>
                                        <span className="font-medium">75%</span>
                                    </div>
                                    <Progress value={75} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Pass Rate</span>
                                        <span className="font-medium">{preliminaryStats.passRate}%</span>
                                    </div>
                                    <Progress value={preliminaryStats.passRate} className="h-2" />
                                </div>

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Round Status</AlertTitle>
                                    <AlertDescription>
                                        Preliminary round is currently in progress. {preliminaryStats.totalTeams - preliminaryStats.submittedTeams} teams still need to submit their proposals.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="final">
                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Qualified Teams</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center">
                                        <Users className="h-8 w-8 text-blue-600 mr-2" />
                                        <div>
                                            <div className="text-3xl font-bold">{finalStats.totalTeams}</div>
                                            <p className="text-muted-foreground">Teams in final round</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Submission Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center">
                                        <FileText className="h-8 w-8 text-green-600 mr-2" />
                                        <div>
                                            <div className="text-3xl font-bold">{finalStats.submissionRate}%</div>
                                            <p className="text-muted-foreground">{finalStats.submittedTeams} teams submitted</p>
                                        </div>
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
                                            <div className="text-3xl font-bold">{finalStats.daysLeft} days</div>
                                            <p className="text-muted-foreground">Until presentations</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Final Round Progress</CardTitle>
                                <CardDescription>
                                    Current status of the final round
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Final Submissions</span>
                                        <span className="font-medium">{finalStats.submissionRate}%</span>
                                    </div>
                                    <Progress value={finalStats.submissionRate} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Presentations Completed</span>
                                        <span className="font-medium">{finalStats.presentationRate}%</span>
                                    </div>
                                    <Progress value={finalStats.presentationRate} className="h-2" />
                                </div>

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Round Status</AlertTitle>
                                    <AlertDescription>
                                        Final round presentations will begin in {finalStats.daysLeft} days. {finalStats.totalTeams - finalStats.submittedTeams} teams still need to submit their final projects.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="teams">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Status Overview</CardTitle>
                            <CardDescription>
                                Current status of all participating teams
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {teams.map(team => (
                                    <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-medium">{team.name}</h3>
                                            <p className="text-sm text-muted-foreground">{team.category}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center">
                                                {team.status === "passed" && (
                                                    <div className="flex items-center text-green-600">
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        <span>Passed</span>
                                                    </div>
                                                )}
                                                {team.status === "failed" && (
                                                    <div className="flex items-center text-red-600">
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        <span>Failed</span>
                                                    </div>
                                                )}
                                                {team.status === "pending" && (
                                                    <div className="flex items-center text-yellow-600">
                                                        <Clock className="h-4 w-4 mr-2" />
                                                        <span>Pending</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm">Update Status</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Update Team Status</DialogTitle>
                                                        <DialogDescription>
                                                            Change the status for {team.name}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label>New Status</Label>
                                                            <Select defaultValue={team.status}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="passed">Pass</SelectItem>
                                                                    <SelectItem value="failed">Fail</SelectItem>
                                                                    <SelectItem value="pending">Pending</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Comments</Label>
                                                            <Input placeholder="Add any comments about the decision" />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit">Save Changes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}