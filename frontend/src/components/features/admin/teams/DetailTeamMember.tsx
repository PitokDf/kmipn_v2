'use client'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TeamMember } from "@/types/api"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function TeamMemberDetailDialog({ member, onOpenChange, open }
    : { member: TeamMember[], onOpenChange: (open: boolean) => void, open: boolean }) {
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px] md:w-[600px] max-h-[100dvh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Detail Anggota Tim</DialogTitle>
                    </DialogHeader>
                    {
                        member.map((mem, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-4 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={mem.fileKTM}
                                        alt={`Foto KTM ${mem.name}`}
                                        width={100}
                                        height={100}
                                        className="rounded-md border object-cover cursor-pointer"
                                        onClick={() => setPreviewImage(mem.fileKTM)}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold">{mem.name}</span>
                                        <Badge variant={mem.role === "leader" ? "default" : "secondary"}>
                                            {mem.role === "leader" ? "Ketua" : "Anggota"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid gap-1 text-sm">
                                    <DetailItem label="NIM" value={mem.nim} />
                                    <DetailItem label="Email" value={mem.email} />
                                    <DetailItem label="Prodi" value={mem.prodi} />
                                    <DetailItem label="No. WhatsApp" value={mem.noWA} />
                                </div>
                            </div>
                        ))
                    }
                </DialogContent>
                <DialogFooter>
                    <Button type="button" variant={"outline"} onClick={() => { onOpenChange(false) }}>Cancel</Button>
                </DialogFooter>
            </Dialog>
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)} >
                <DialogTitle>Foto KTM</DialogTitle>
                <DialogContent className="w-auto max-w-4xl p-4">
                    <Image
                        src={previewImage || "/images/default-image.png"}
                        alt="Preview Foto KTM"
                        width={800}
                        height={800}
                        className="mx-auto rounded-md border object-contain max-h-[80vh]"
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

function DetailItem({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between border-b py-2">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="text-sm text-right">{value}</span>
        </div>
    )
}
