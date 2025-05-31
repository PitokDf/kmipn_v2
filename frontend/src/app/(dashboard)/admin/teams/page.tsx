"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getAllTeams } from "@/lib/apis/team";
import { TeamsTable } from "@/components/features/admin/teams/TeamsTable";
import { Team, TeamMember } from "@/types/api";
import { TeamMemberDetailDialog } from "@/components/features/admin/teams/DetailTeamMember";
import { DeleteTeam } from "@/components/features/admin/teams/DeleteTeam";
import { VerifyTeam } from "@/components/features/admin/teams/VerifyTeam";
import { ExportData } from "@/components/features/admin/teams/ExportData";

export default function TeamsPage() {
    const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
    const [currentMember, setCurrentMember] = useState<TeamMember[] | null>(null);
    const [dialogs, setDialogs] = useState({
        detailMember: false,
        deleteTeam: false,
        verifyTeam: false,
    });

    const { data: teams = [] } = useQuery({
        queryFn: getAllTeams,
        queryKey: ["teams"],
    });

    const handleShowDetailMember = (members: TeamMember[]) => {
        setCurrentMember(members);
        setDialogs((prev) => ({ ...prev, detailMember: true }));
    };

    const handleDeleteTeam = (team: Team) => {
        setCurrentTeam(team);
        setDialogs((prev) => ({ ...prev, deleteTeam: true }));
    };

    const handleVerifyTeam = (team: Team) => {
        setCurrentTeam(team);
        setDialogs((prev) => ({ ...prev, verifyTeam: true }));
    };

    const renderTeamsTable = (filteredTeams: Team[]) => (
        <TeamsTable
            data={filteredTeams}
            onShowDetailMember={handleShowDetailMember}
            onDelete={handleDeleteTeam}
            onVerifyTeam={handleVerifyTeam}
        />
    );

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Teams Management</h1>
                    <p className="text-muted-foreground">
                        Manage and monitor competition teams
                    </p>
                </div>
                <ExportData />
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Semua Tim</TabsTrigger>
                    <TabsTrigger value="verified">Terverifikasi</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>Semua Tim</CardTitle>
                            <CardDescription>Daftar semua tim yang terdaftar di kompetisi.</CardDescription>
                        </CardHeader>
                        <CardContent>{renderTeamsTable(teams)}</CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="verified">
                    <Card>
                        <CardHeader>
                            <CardTitle>Terverifikasi</CardTitle>
                            <CardDescription>Tim yang telah diverifikasi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderTeamsTable(teams.filter((t) => t.status === "verified"))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending</CardTitle>
                            <CardDescription>Tim yang menunggu verifikasi.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderTeamsTable(teams.filter((t) => t.status === "pending"))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {currentTeam !== null && dialogs.detailMember && (
                <TeamMemberDetailDialog
                    member={currentMember || []}
                    open={dialogs.detailMember}
                    onOpenChange={(open) => setDialogs((prev) => ({ ...prev, detailMember: open }))}
                />
            )}

            {currentTeam !== null && dialogs.deleteTeam && (
                <DeleteTeam
                    data={currentTeam}
                    open={dialogs.deleteTeam}
                    onOpenChange={(open) => setDialogs((prev) => ({ ...prev, deleteTeam: open }))}
                />
            )}

            {currentTeam !== null && dialogs.verifyTeam && (
                <VerifyTeam
                    data={currentTeam}
                    open={dialogs.verifyTeam}
                    onOpenChange={(open) => setDialogs((prev) => ({ ...prev, verifyTeam: open }))}
                />
            )}
        </>
    );
}
