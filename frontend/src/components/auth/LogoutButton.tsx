'use client'

import { LogOut } from "lucide-react"
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import axiosInstance from "@/lib/axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function LogOutButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [open, onOpenChange] = useState(false)
    const handleLogout = async () => {
        try {
            setIsLoading(true)
            const res = await axiosInstance.post("/auth/logout")

            if (res.data.success) {
                document.cookie = `token=; path=/; max-age=;`
                router.push("/admin/login", { scroll: false })
                onOpenChange(false)
            }
        } catch (error) {
            process.env.NODE_ENV === "production"
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                {/* Ini dia, kita pake itemnya buat trigger */}
                <Button
                    onSelect={(e) => e.preventDefault()} // biar menu nggak nutup otomatis
                    className="cursor-pointer w-full flex justify-start hover:bg-red-500 hover:text-white text-red-500 dark:hover:bg-red-500 dark:hover:text-white"
                    variant={"ghost"}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Yakin mau logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Kamu akan keluar dari akun ini.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <Button className="bg-red-500 hover:bg-red-500/80" onClick={() => { handleLogout() }}>{isLoading ? "Loading..." : "Logout"}</Button>
                    {/* <AlertDialogAction onSelect={e => e.preventDefault()} disabled={isLoading} onClick={handleLogout}>{isLoading ? "Loading..." : "Logout"}</AlertDialogAction> */}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
