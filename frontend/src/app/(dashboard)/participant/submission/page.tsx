"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock, FileText, Upload, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { getInfoSubmission } from "@/lib/apis/team";
import { useUser } from "@/context/UserContext";
import { formatTanggal } from "@/lib/formatTanggal";
import { Preliminary } from "@/components/features/participant/submission/Preliminary";

export default function SubmissionsPage() {
    const user = useUser()
    const [submissionStatus, setSubmissionStatus] = useState<"preliminary" | "final" | null>(null);
    const { data: preliminarySubmission, isPending } = useQuery({
        queryKey: ["submission_preliminary"],
        queryFn: async () => {
            return await getInfoSubmission(user?.id!) as {
                id: number, teamId: number, round: string, status: string, createdAt: string
            }
        }
    })

    useEffect(() => {
        if (preliminarySubmission?.status) {
            setSubmissionStatus(preliminarySubmission.round as "preliminary" | "final")
        }
    }, [preliminarySubmission])

    if (isPending && !preliminarySubmission) return (
        <p>Loading...</p>
    )

    const round = preliminarySubmission?.round as "preliminary" | "final"
    const status = preliminarySubmission?.status as any

    console.log(round, status);
    console.log(preliminarySubmission);

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Submissions</h1>
                    <p className="text-muted-foreground">
                        Submit your final submission for competition rounds
                    </p>
                </div>
            </div>

            <Preliminary />
        </>
    );
}