"use client";

import { useState } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoriesTable } from "@/components/features/admin/categories/CategoriesTable";
import { CategoriesStatistik } from "@/components/features/admin/categories/CategoriesStatistik";
import { AddCategory } from "@/components/features/admin/categories/AddCateory";
import { Category } from "@/types/api";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { DeleteCateory } from "@/components/features/admin/categories/DeleteCategory";
import { EditCategory } from "@/components/features/admin/categories/EditCategory";

export default function CategoriesPage() {
    const [currentCategory, setCurrenctCateory] = useState<Category | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Kategori Manajemen</h1>
                    <p className="text-muted-foreground">
                        Kelola kategori kompetisi dan lacak statistik
                    </p>
                </div>
                <AddCategory />
            </div>

            <Tabs defaultValue="categories" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="categories">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kategori Manajemen</CardTitle>
                            <CardDescription>
                                Daftar semua kategori dalam kompetisi KMIPN.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CategoriesTable
                                onEdit={(category) => {

                                    setCurrenctCateory(category)
                                    setIsEditDialogOpen(true)
                                }}
                                onDelete={(category) => {
                                    setCurrenctCateory(category)
                                    setIsDeleteDialogOpen(true)
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="statistics">
                    <CategoriesStatistik />
                </TabsContent>
            </Tabs>

            {isDeleteDialogOpen && currentCategory !== null && (
                <DeleteCateory
                    data={currentCategory}
                    onOpenChange={setIsDeleteDialogOpen}
                    open={isDeleteDialogOpen}
                />
            )}

            {isEditDialogOpen && currentCategory !== null && (
                <EditCategory
                    data={currentCategory}
                    onOpenChange={setIsEditDialogOpen}
                    open={isEditDialogOpen}
                />
            )}
        </>
    );
}