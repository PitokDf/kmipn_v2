"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, CheckCircle, MoreHorizontal, PlusCircle, Search, XCircle } from "lucide-react";
import { UserTable } from "@/components/features/admin/user/UserTable";
import { AddUser } from "@/components/features/admin/user/AddUser";
import { useState } from "react";
import { User } from "@/types/api";
import { EditUser } from "@/components/features/admin/user/EditUser";
import { DeleteUser } from "@/components/features/admin/user/DeleteUser";
// import { User } from "@/lib/types";

export default function UsersPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage all users in the system
                    </p>
                </div>
                <AddUser />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        A list of all users in the KMIPN competition system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTable
                        onDelete={(user) => {
                            setCurrentUser(user)
                            setIsDeleteDialogOpen(true)
                        }}
                        onEdit={(user) => {
                            setCurrentUser(user)
                            setIsEditDialogOpen(true)
                        }
                        }
                    />
                </CardContent>
            </Card>

            {isEditDialogOpen && currentUser !== null && (
                <EditUser
                    data={currentUser}
                    onOpenChange={setIsEditDialogOpen}
                    open={isEditDialogOpen}
                />
            )}

            {isDeleteDialogOpen && currentUser !== null && (
                <DeleteUser
                    data={currentUser}
                    onOpenChange={setIsDeleteDialogOpen}
                    open={isDeleteDialogOpen}
                />
            )}
        </>
    );
}