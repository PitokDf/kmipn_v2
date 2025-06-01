"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubmissionTable } from "@/components/features/admin/submission/SubmissionTable";
import { Submission } from "@/types/api";
import { UpdateSubmission } from "@/components/features/admin/submission/UpdateSubmission";
import { DeleteSubmission } from "@/components/features/admin/submission/DeleteSubmission";
import { DownloadFileSubmission } from "@/components/features/admin/submission/DownloadSubmission";

export default function RoundsPage() {
    const [activeTab, setAvtiveTab] = useState("penyisihan")
    const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null)
    const [dialogs, setDialogs] = useState({
        update: false,
        delete: false
    })

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Competition Rounds</h1>
                    <p className="text-muted-foreground">
                        Manage and monitor competition rounds
                    </p>
                </div>
                <DownloadFileSubmission />
            </div>

            <Tabs defaultValue="penyisihan"
                value={activeTab}
                onValueChange={setAvtiveTab}
                className="space-y-4">
                <TabsList>
                    <TabsTrigger value="penyisihan">Ronde Penyisihan</TabsTrigger>
                    <TabsTrigger value="final">Ronde Final</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                    <Card>
                        <CardHeader>
                        </CardHeader>
                        <CardContent>
                            <SubmissionTable
                                onDelete={(s) => {
                                    console.log(s)
                                    setCurrentSubmission(s)
                                    setDialogs((prev => ({ ...prev, delete: true })))
                                }}
                                onEdit={
                                    (s) => {
                                        setCurrentSubmission(s)
                                        setDialogs((prev => ({ ...prev, update: true })))
                                    }}
                                activeTab={activeTab}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {dialogs.update && currentSubmission !== null && (
                <UpdateSubmission
                    data={currentSubmission}
                    open={dialogs.update}
                    onOpenChange={(open) => setDialogs((prev) => ({ ...prev, update: open }))}
                />
            )}
            {dialogs.delete && currentSubmission !== null && (
                <DeleteSubmission
                    data={currentSubmission}
                    open={dialogs.delete}
                    onOpenChange={(open) => setDialogs((prev) => ({ ...prev, delete: open }))}
                />
            )}
        </>
    );
}