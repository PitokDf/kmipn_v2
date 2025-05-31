"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Clock, FileText, Upload, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SubmissionsPage() {
    const [user] = useState({
        name: "John Doe",
        role: "participant" as const,
    });

    const [submissionStatus, setSubmissionStatus] = useState<"preliminary" | "final" | null>("preliminary");
    const [preliminarySubmission] = useState({
        id: 1,
        teamId: 1,
        round: "preliminary" as const,
        status: "pending" as const,
        createdAt: "2025-07-25T10:15:00Z",
    });

    return (
        <DashboardLayout user={user}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Final Submissions</h1>
                    <p className="text-muted-foreground">
                        Submit your final project for competition rounds
                    </p>
                </div>
            </div>

            <Tabs defaultValue="preliminary" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="preliminary">Preliminary Round</TabsTrigger>
                    <TabsTrigger value="final">Final Round</TabsTrigger>
                </TabsList>

                <TabsContent value="preliminary">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <CardTitle>Preliminary Round Submission</CardTitle>
                                    <CardDescription>
                                        Submit your project for the preliminary round
                                    </CardDescription>
                                </div>
                                {submissionStatus === "preliminary" && (
                                    <StatusBadge status={preliminarySubmission.status} />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {submissionStatus === "preliminary" ? (
                                <div className="space-y-6">
                                    <div className="border rounded-lg p-6 bg-muted/50">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                                                <div>
                                                    <h3 className="font-medium">project_submission.zip</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Uploaded on {new Date(preliminarySubmission.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="outline">Download</Button>
                                        </div>

                                        <div className="p-4 border rounded-md bg-white">
                                            <h3 className="font-medium mb-2">Submission Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Project Title</p>
                                                    <p>Smart City Solution</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Submission Date</p>
                                                    <p>{new Date(preliminarySubmission.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                                                    <p>Software Development</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                                    <StatusBadge status={preliminarySubmission.status} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            {preliminarySubmission.status === "pending" && (
                                                <Alert>
                                                    <Clock className="h-4 w-4" />
                                                    <AlertTitle>Under Review</AlertTitle>
                                                    <AlertDescription>
                                                        Your submission is currently being reviewed. Results will be announced on August 1, 2025.
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {preliminarySubmission.status === "passed" && (
                                                <Alert className="bg-green-50 border-green-200 text-green-800">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <AlertTitle>Congratulations!</AlertTitle>
                                                    <AlertDescription>
                                                        Your team has advanced to the final round. Please prepare your final submission.
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {preliminarySubmission.status === "failed" && (
                                                <Alert variant="destructive">
                                                    <XCircle className="h-4 w-4" />
                                                    <AlertTitle>Not Selected</AlertTitle>
                                                    <AlertDescription>
                                                        Unfortunately, your team was not selected for the final round. Thank you for your participation.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Submission Requirements</AlertTitle>
                                        <AlertDescription>
                                            Your preliminary submission should include a working prototype of your project along with documentation.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="project-title">Project Title</Label>
                                            <Input id="project-title" placeholder="Enter project title" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="project-description">Project Description</Label>
                                            <Textarea
                                                id="project-description"
                                                placeholder="Enter a brief description of your project"
                                                rows={4}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="github-link">GitHub Repository (Optional)</Label>
                                            <Input id="github-link" placeholder="https://github.com/yourusername/your-repo" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Upload Project Files</Label>
                                            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-sm font-medium mb-1">
                                                    Drag & drop your files here
                                                </p>
                                                <p className="text-xs text-muted-foreground mb-4">
                                                    Upload a ZIP file containing your project (max 100MB)
                                                </p>
                                                <Button variant="outline" size="sm">
                                                    Select Files
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Upload Progress</Label>
                                                <span className="text-sm text-muted-foreground">0%</span>
                                            </div>
                                            <Progress value={0} className="h-2" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4">
                            {submissionStatus === "preliminary" ? (
                                <Button>Update Submission</Button>
                            ) : (
                                <>
                                    <Button variant="outline">Save as Draft</Button>
                                    <Button>Submit Project</Button>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="final">
                    <Card>
                        <CardHeader>
                            <CardTitle>Final Round Submission</CardTitle>
                            <CardDescription>
                                Submit your final project for the competition
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {submissionStatus === "final" ? (
                                <div className="space-y-6">
                                    {/* Final round submission content */}
                                    <div className="border rounded-lg p-6 bg-muted/50">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                                                <div>
                                                    <h3 className="font-medium">final_submission.zip</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Uploaded on September 10, 2025
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="outline">Download</Button>
                                        </div>

                                        <Alert className="mt-4">
                                            <Clock className="h-4 w-4" />
                                            <AlertTitle>Final Presentation</AlertTitle>
                                            <AlertDescription>
                                                Your team is scheduled to present on September 15, 2025 at 10:00 AM. Please prepare a 15-minute presentation followed by a 5-minute Q&A session.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </div>
                            ) : preliminarySubmission.status === "passed" ? (
                                <div className="space-y-6">
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Final Round Submission</AlertTitle>
                                        <AlertDescription>
                                            Congratulations on advancing to the final round! Please submit your completed project along with all required documentation.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="final-project-title">Project Title</Label>
                                            <Input id="final-project-title" placeholder="Enter project title" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="final-project-description">Project Description</Label>
                                            <Textarea
                                                id="final-project-description"
                                                placeholder="Enter a comprehensive description of your project"
                                                rows={4}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="final-github-link">GitHub Repository</Label>
                                            <Input id="final-github-link" placeholder="https://github.com/yourusername/your-repo" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Upload Project Files</Label>
                                            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-sm font-medium mb-1">
                                                    Drag & drop your files here
                                                </p>
                                                <p className="text-xs text-muted-foreground mb-4">
                                                    Upload a ZIP file containing your project (max 100MB)
                                                </p>
                                                <Button variant="outline" size="sm">
                                                    Select Files
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="presentation-link">Presentation Link (Optional)</Label>
                                            <Input id="presentation-link" placeholder="Link to your presentation slides" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="demo-link">Demo Video Link (Optional)</Label>
                                            <Input id="demo-link" placeholder="Link to your demo video" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                        <Clock className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">Not Available Yet</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                        The final round submission is only available to teams that pass the preliminary round. Please complete your preliminary submission first.
                                    </p>
                                    <Button variant="outline" onClick={() => document.querySelector('[value="preliminary"]')?.dispatchEvent(new Event('click'))}>
                                        Go to Preliminary Submission
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                        {(submissionStatus === "final" || preliminarySubmission.status === "passed") && (
                            <CardFooter className="flex justify-end gap-4">
                                {submissionStatus === "final" ? (
                                    <Button>Update Submission</Button>
                                ) : (
                                    <>
                                        <Button variant="outline">Save as Draft</Button>
                                        <Button>Submit Final Project</Button>
                                    </>
                                )}
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}