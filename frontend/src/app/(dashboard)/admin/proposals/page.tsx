'use client'

import { useState } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ListProposals } from "@/components/features/admin/proposals/ListProposals";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Proposal } from "@/types/api";
import { DownloadApproved } from "@/components/features/admin/proposals/DownloadApproved";
import { ReviewProposal } from "@/components/features/admin/proposals/ReviewProposal";
import { DeleteProposal } from "@/components/features/admin/proposals/DeleteProposals";
import { getAllProposal } from "@/lib/apis/proposal";


export default function ProposalsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("all");
    const [isDialogReviewOpen, setIsDialogReviewOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentProposal, setCurrentProposal] = useState<Omit<Proposal, "creadAt" | "deadline"> | null>(null)
    const { data } = useQuery({
        queryKey: ["proposals"],
        queryFn: getAllProposal,
        staleTime: 5 * 60 * 1000
    });

    const allCategories = data?.map(p => p.teamCategory)
    const uniqueCategory = Array.from(new Set(allCategories)) as [] || []

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Manajemen Proposal</h1>
                    <p className="text-muted-foreground">Meninjau dan mengelola proposal kompetisi</p>
                </div>
                <DownloadApproved />
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
                <Input
                    placeholder="Search proposal..."
                    className="sm:w-1/2"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {uniqueCategory.map((ctg, ind) => (
                            <SelectItem key={ind} value={ctg}>{ctg}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Semua Proposal</TabsTrigger>
                    <TabsTrigger value="pending">
                        <Clock className="mr-2 h-4 w-4 " />Pending
                    </TabsTrigger>
                    <TabsTrigger value="approve">
                        <CheckCircle className="mr-2 h-4 w-4 " /> Disetujui
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        <XCircle className="mr-2 h-4 w-4 " /> Ditolak
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                    <ListProposals
                        activeTab={activeTab}
                        categoryFilter={categoryFilter}
                        searchParams={searchTerm}
                        onReview={(proposal) => {
                            setCurrentProposal(proposal)
                            setIsDialogReviewOpen(true)
                        }}
                        onDelete={(proposal) => {
                            setIsDeleteDialogOpen(true)
                            setCurrentProposal(proposal)
                        }}
                    />

                </TabsContent>
            </Tabs>

            {isDialogReviewOpen && currentProposal !== null && (
                <ReviewProposal
                    open={isDialogReviewOpen}
                    onOnpenChange={setIsDialogReviewOpen}
                    proposal={currentProposal}
                />
            )}

            {isDeleteDialogOpen && currentProposal !== null && (
                <DeleteProposal
                    data={currentProposal}
                    onOpenChange={setIsDeleteDialogOpen}
                    open={isDeleteDialogOpen}
                />
            )}
        </>
    );
}
