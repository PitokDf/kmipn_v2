'use client'

import { LoaderPinwheel } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const qc = new QueryClient()
export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsloading] = useState(true)
    useEffect(() => {
        const handleLoaded = () => setIsloading(false)

        if (document.readyState === "complete" || document.readyState === "interactive") {
            handleLoaded()
        } else {
            window.addEventListener("DOMContentLoaded", handleLoaded)

            return () => {
                window.removeEventListener("DOMContentLoaded", handleLoaded)
            }
        }
    }, [])
    return (
        <>
            <QueryClientProvider client={qc}>
                {
                    isLoading ? (
                        <div className="h-dvh flex justify-center items-center">
                            <LoaderPinwheel className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>)
                        : (
                            <>
                                {children}
                            </>
                        )
                }
            </QueryClientProvider>
            <Toaster position="top-right" richColors />
        </>
    );
}