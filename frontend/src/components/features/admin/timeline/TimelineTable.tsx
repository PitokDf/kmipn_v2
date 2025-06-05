'use client'

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllTimeline } from "@/lib/apis/timeline";
import { formatTanggal } from "@/lib/formatTanggal";
import { Timeline } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export function TimelineTable(
    { onEdit, onDelete }: {
        onEdit: (category: Timeline) => void,
        onDelete: (category: Timeline) => void
    }
) {
    const { data: timelines } = useQuery({
        queryFn: getAllTimeline,
        queryKey: ['timelines']
    })

    const columns: ColumnDef<Timeline>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Judul
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "description",
            header: "Deskripsi",
            cell: ({ row }) => {
                const description = row.getValue("description") as string;
                return (
                    <div className="max-w-md truncate" title={description}>
                        {description}
                    </div>
                );
            },
        },
        {
            accessorKey: "startTime",
            header: "Rentang Waktu",
            cell: ({ row }) => {
                const timeline = row.original;
                return <div>{timeline.endTime ? `${formatTanggal(timeline.startTime)} - ${formatTanggal(timeline.endTime)}` : formatTanggal(timeline.startTime)}</div>;
            },
        },

        {
            id: "actions",
            cell: ({ row }) => {
                const timeline = row.original;

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
                                onClick={() => onEdit(timeline)}
                            >Edit Timeline
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                                onClick={() => onDelete(timeline)}
                                className="text-red-600">
                                Delete Timeline
                            </DropdownMenuItem>
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
                data={timelines || []}
                searchKey="title"
                searchPlaceholder="Search timelines..."
            />
        </>
    )
}