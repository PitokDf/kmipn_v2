import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamMemberData } from "@/types/api"
import { useQueryClient } from "@tanstack/react-query"
import { Eye, Trash2 } from "lucide-react"
import Link from "next/link"

export function TeamMember() {
    const qc = useQueryClient()
    const data = qc.getQueryData(["teamMemberData"]) as TeamMemberData
    const teamMembers = data.teamMembers
    return (
        <Card>
            <CardHeader>
                <CardTitle>Anggota Tim</CardTitle>
                <CardDescription>
                    Kelola anggota tim Anda
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {teamMembers.map((member, index) => (
                        <div key={member.name + index} className="pb-6 border-b last:border-0 last:pb-0">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div className="flex items-center gap-2 mb-2 md:mb-0">
                                    <h3 className="font-semibold text-lg">{member.name}</h3>
                                    <div className={`text-xs px-2 py-1 rounded-full ${member.role === "leader"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                        }`}>
                                        {member.role === "leader" ? "Team Leader" : "Member"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">NIM</p>
                                    <p>{member.nim}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p>{member.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                                    <p>{member.noWA}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Prodi</p>
                                    <p>{member.prodi}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-muted-foreground mb-2">File KTM</p>
                                <div className="flex items-center gap-2">
                                    <Link href={member.fileKTM} target="_blank">
                                        <Button variant="link" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Lihat
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* {teamMembers.length < 3 && (
                        <div className="pt-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Add Team Member
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add Team Member</DialogTitle>
                                        <DialogDescription>
                                            Add a new member to your team. They will receive an invitation email.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input id="name" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right">
                                                Email
                                            </Label>
                                            <Input id="email" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nim" className="text-right">
                                                NIM
                                            </Label>
                                            <Input id="nim" className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Send Invitation</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )} */}
                </div>
            </CardContent>
        </Card>

    )
}