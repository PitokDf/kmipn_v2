import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
// import { getAllCategory } from "@/lib/apis/category";
import { getAllSubmissions } from "@/lib/apis/submission";
import { formatTanggal } from "@/lib/formatTanggal";
import { Category, Submission } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, FileText, Github, MoreHorizontal } from "lucide-react";
import Link from "next/link";

type SubmissionTableProps = {
    onEdit: (submission: Submission) => void,
    onDelete: (submission: Submission) => void,
    onDetail: (submission: Submission) => void,
    activeTab?: string
}

export function SubmissionTable(
    {
        onEdit,
        onDelete,
        onDetail,
        activeTab = "penyisihan"
    }: SubmissionTableProps) {

    const { data: submissions, isPending } = useQuery({
        queryFn: getAllSubmissions,
        queryKey: ['submissions']
    })

    if (isPending) return <p>Loading...</p>

    const filteredData = submissions?.filter((sub) => {
        const matchStatus = (activeTab === 'penyisihan' && sub.round === "preliminary") || (activeTab === "final" && sub.round === "final")
        return matchStatus
    })

    const columns: ColumnDef<Submission>[] = [
        {
            accessorKey: "teamName",
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
            accessorKey: "title",
            header: "Judul"
        },
        {
            accessorKey: "round",
            header: "Ronde",
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="max-w-md gap-2 flex" title={data.round}>
                        <div>
                            {data.round === "preliminary" ? "Penyisihan" : "Final"}
                        </div>
                        <StatusBadge status={data.status as any} />
                    </div>
                );
            },
        },
        {
            accessorKey: "fileUrl",
            header: "Projek",
            cell: ({ row }) => {
                const data = row.original
                return (
                    <div className="gap-2 flex justify-start items-center" >
                        {data.githubUrl && (
                            <>
                                <Link href={data.githubUrl} target="_blank"
                                    title="Github Url"
                                    className="hover:text-blue-500">
                                    <Github className="w-4 h-4" />
                                </Link> |
                            </>
                        )}
                        <Link href={data.fileUrl} target="_blank"
                            title="File Url" className="hover:text-blue-500 max-w-md truncate">
                            <span className="flex gap-1 justify-center items-center">
                                <FileText className="w-4 h-4" /> {data.fileName}
                            </span>
                        </Link>
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Pengajuan",
            cell: ({ row }) => {
                return <div>{formatTanggal(row.getValue("createdAt"))}</div>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const submission = row.original;

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
                                onClick={() => onEdit(submission)}
                            >Update Pengajuan
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                                onClick={() => onDetail(submission)}
                            >Detail Pengajuan
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                                onClick={() => { onDelete(submission); console.log(submission) }}
                                className="text-red-600">
                                Hapus Pengajuan
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
    return (
        <>
            {/* <iframe src="https://drive.google.com/file/d/1jDOd_c4M0j_-bHjazYtUkmJPu414l51I/preview" width="640" height="480" allow="autoplay" className="rounded-lg"></iframe> */}

            <DataTable
                columns={columns}
                data={filteredData || []}
                searchKey="teamName"
                searchPlaceholder="Search submissions..."
            />
        </>
    )
}