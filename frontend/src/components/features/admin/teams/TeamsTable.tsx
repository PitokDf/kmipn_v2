import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatTanggal } from "@/lib/formatTanggal";
import { Team, TeamMember } from "@/types/api";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";

type TeamsTableProps = {
    data: Team[]
    onShowDetailMember: (member: TeamMember[]) => void
    onDelete: (team: Team) => void
    onVerifyTeam: (team: Team) => void
}

export function TeamsTable(
    { data, onVerifyTeam, onDelete, onShowDetailMember }: TeamsTableProps) {

    const columns: ColumnDef<Team>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama Tim
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "category",
            header: "Kategori",
        },
        {
            accessorKey: "institution",
            header: "Politeknik",
        },
        {
            accessorKey: "members",
            header: "Anggota",
            cell: ({ row }) => {
                const count = row.original.members.length;
                return (
                    <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{count}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "lecture",
            header: "Dosen",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as "verified" | "pending";
                return <StatusBadge status={status} />;
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Terdaftar Pada
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt") as string);
                return <div>{formatTanggal(date)}</div>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const team = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                                onClick={() => { onShowDetailMember(team.members) }}
                            >Lihat Anggota</DropdownMenuItem>
                            {team.proposalLink !== null && (
                                <DropdownMenuItem>
                                    <Link
                                        href={team.proposalLink}
                                        target="_blank"
                                    >Lihat Proposal</Link>
                                </DropdownMenuItem>
                            )}
                            {team.status === "pending" && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onSelect={e => e.preventDefault()}
                                        onClick={() => { onVerifyTeam(team) }}
                                        className="text-green-600">Verifikasi Tim</DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 hover:bg-red-600/30  hover:text-red-600"
                                onSelect={e => e.preventDefault()}
                                onClick={() => { onDelete(team) }}
                            >Hapus tim</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
    return (
        <>
            <DataTable
                columns={columns}
                data={data || []}
                searchKey="name"
                searchPlaceholder="Search teams..."
            />
        </>
    )
}