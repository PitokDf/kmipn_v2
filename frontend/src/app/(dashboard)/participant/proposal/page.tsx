"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProposalForm from "@/components/features/participant/proposal/ProposalForm";
import { CurrentProposal } from "@/components/features/participant/proposal/CurrentProposal";
import Link from "next/link";
import { Download } from "lucide-react";

export default function ProposalsPage() {

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen proposal</h1>
          <p className="text-muted-foreground">
            Kirimkan dan kelola proposal tim Anda
          </p>
        </div>
        <Link
          className="w-fit"
          href={"/files/BUKU PANDUAN KMIPN VII.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          download={"PANDUAN-KMIPN.pdf"}>
          <Button variant="outline" className="w-full bg-green-500 hover:bg-green-500/80 text-white">
            <Download /> Unduh Pedoman sebagai PDF
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Proposal Saat Ini</TabsTrigger>
          <TabsTrigger value="submit">Submit Proposal</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <CurrentProposal />
        </TabsContent>

        <TabsContent value="submit">
          <ProposalForm />
        </TabsContent>
      </Tabs>
    </>
  );
}