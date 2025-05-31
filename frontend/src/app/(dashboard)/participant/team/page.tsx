"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamDetail } from "@/components/features/participant/team/TeamDetail";
import { TeamMember } from "@/components/features/participant/team/TeamMember";

export default function TeamPage() {
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Team Management</h1>
                    <p className="text-muted-foreground">
                        Manage your team information and members
                    </p>
                </div>
            </div>

            <Tabs defaultValue="info" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="info">Team Information</TabsTrigger>
                    <TabsTrigger value="members">Team Members</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <TeamDetail />
                </TabsContent>

                <TabsContent value="members">
                    <TeamMember />
                </TabsContent>
            </Tabs>
        </>
    );
}