import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAllCategory } from "@/lib/apis/category";
import { formatTanggal } from "@/lib/formatTanggal";
import { Category } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export function CategoriesTable(
    { onEdit, onDelete }: {
        onEdit: (category: Category) => void,
        onDelete: (category: Category) => void
    }
) {
    const { data: categories } = useQuery({
        queryFn: getAllCategory,
        queryKey: ['categories']
    })

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: "categoriName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
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
            accessorKey: "deadline",
            header: "Deadline",
            cell: ({ row }) => {
                return <div>{formatTanggal(row.getValue("deadline"))}</div>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const category = row.original;

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
                                onClick={() => onEdit(category)}
                            >Edit category
                            </DropdownMenuItem>
                            <DropdownMenuItem>View teams</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                                onClick={() => onDelete(category)}
                                className="text-red-600">
                                Delete category
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
                data={categories || []}
                searchKey="categoriName"
                searchPlaceholder="Search categories..."
            />
        </>
    )
}