import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAllUser } from "@/lib/apis/user";
import { formatTanggal } from "@/lib/formatTanggal";
import { User } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, MoreHorizontal, XCircle } from "lucide-react";

export function UserTable(
    { onEdit, onDelete }: {
        onEdit: (user: User) => void,
        onDelete: (user: User) => void
    }
) {
    const { data: categories } = useQuery({
        queryFn: getAllUser,
        queryKey: ['users']
    })

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role") as string;
                return (
                    <div className="capitalize">{role}</div>
                );
            },
        },
        {
            accessorKey: "verified",
            header: "Verification",
            cell: ({ row }) => {
                const verified = row.getValue("verified") as boolean;
                return verified ? (
                    <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        <span>Verified</span>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        <span>Unverified</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Registered
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
                const user = row.original;

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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                                Copy user ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                                onClick={() => { onEdit(user) }}
                            >
                                Edit user
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={e => e.preventDefault()}
                                onClick={() => { onDelete(user) }}
                                className="text-red-600">
                                Delete user
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
                searchKey="name"
                searchPlaceholder="Search users..."
            />
        </>
    )
}