'use client';

import { useState, useEffect, useRef } from 'react';
import Topbar from './Topbar';
import { AppSidebar } from './Sidebar';
import { useUser } from '@/context/UserContext';
import socket from '@/lib/socket';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useWindowFocus } from '@/hooks/useWindowFocus';
// import socket from '@/app/socket';

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const user = useUser()
    const registered = useRef(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const qc = useQueryClient()

    useWindowFocus(() => {
        if (!registered.current && user?.id) {
            socket.emit('register', { userId: user?.id })
            registered.current = true
        }
    })

    useEffect(() => {
        if (!user?.id) return
        socket.emit("register", { userId: user.id })

        const handlers = {
            "proposal:submitted": (d: any) => {
                toast.info(d.message, { position: "top-center" })
                qc.invalidateQueries({ queryKey: ["dashboard_participant"] })
                qc.invalidateQueries({ queryKey: ["dashboard_admin"] })
                qc.invalidateQueries({ queryKey: ["proposals"] })
            },

            "team:verified": (d: any) => {
                toast.info(d.message, { position: "top-center" })
                qc.invalidateQueries({ queryKey: ["dashboard_participant"] })
                qc.invalidateQueries({ queryKey: ["proposal"] })
            },

            "team:new": (d: any) => {
                toast.info(d.message, { position: "top-center" })
                qc.invalidateQueries({ queryKey: ["dashboard_admin"] })
                qc.invalidateQueries({ queryKey: ["teams"] })
            },

            "proposal:reviewed": (d: any) => {
                toast.info(d.message, { position: "top-center" })
                qc.invalidateQueries({ queryKey: ["dashboard_participant"] })
                qc.invalidateQueries({ queryKey: ["dashboard_admin"] })
                qc.invalidateQueries({ queryKey: ["proposal"] })
            },
        }

        Object.entries(handlers).forEach(([event, fn]) => socket.on(event, fn))
        return () => Object.entries(handlers).forEach(([event, fn]) => socket.off(event, fn))
    }, [user?.id, qc])
    return (
        <>
            <div className="flex h-screen w-screen ">
                {/* Sidebar */}
                <AppSidebar />
                {/* Main content area */}
                <div className="flex flex-col flex-1 lg:ml-0 min-w-0">
                    <Topbar onMenuToggle={toggleSidebar} />
                    <main className="flex-1 overflow-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
