'use client'

import {
    Users, ChevronDown, ChevronRight, LucideProps,
    LayoutDashboard, FolderKanban, UserCog, FileSearch,
    FileEdit, Upload, ClipboardCheck, Flag, BarChart3
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import React, { useState, useTransition } from "react"
import ThemeToggle from "../theme-toogle"
import { useUser } from "@/context/UserContext"

type itemsLink = {
    title: string;
    url: string,
    role: ("admin" | "operator" | "participant")[],
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    submenu?: {
        title: string;
        url: string;
    }[]
}

const items: itemsLink[] = [
    // admin dan operator access
    { title: "Dashboard", url: "/admin", role: ["admin", "operator"], icon: LayoutDashboard },
    { title: "Category", url: "/admin/categories", role: ["admin", "operator"], icon: FolderKanban },
    { title: "Team", url: "/admin/teams", role: ["admin", "operator"], icon: Users },
    { title: "Users", url: "/admin/users", role: ["admin"], icon: UserCog },
    { title: "Proposals", url: "/admin/proposals", role: ["admin", "operator"], icon: FileSearch },
    { title: "Assessments", url: "/admin/assessments", role: ["admin", "operator"], icon: ClipboardCheck },
    { title: "Rounds", url: "/admin/rounds", role: ["admin", "operator"], icon: Flag },
    {
        title: "Report", url: "/admin/reports", role: ["admin", "operator"], icon: BarChart3, submenu: [
            { title: "Assessments", url: "/admin/reports/assessments" },
            { title: "Teams", url: "/admin/reports/teams" },
        ]
    },

    // participant accesss
    { title: "Dashboard", url: "/participant", role: ["participant"], icon: LayoutDashboard },
    { title: "My Team", url: "/participant/team", role: ["participant"], icon: Users },
    { title: "Proposal", url: "/participant/proposal", role: ["participant"], icon: FileEdit },
    { title: "Submission", url: "/participant/submission", role: ["participant"], icon: Upload },
]

export function AppSidebar() {
    const user = useUser()
    const pathname = usePathname()
    const router = useRouter()
    const [loadingPath, setLoadingPath] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    // State to keep track of which menus are expanded for submenu toggling
    const [expandedMenus, setExpandedMenus] = useState<string[]>([])

    const toggleMenu = (title: string) => {
        setExpandedMenus(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        )
    }

    const NavItem = ({ href, icon, label, onClick, isSubmenu = false, isActiveOverride }: { href: string, icon?: React.ReactNode, label: string, onClick?: () => void, isSubmenu?: boolean, isActiveOverride?: boolean }) => {
        const isActive = isActiveOverride ?? (pathname === href);
        const isLoading = isPending && loadingPath === href;

        return (
            <button
                onClick={() => {
                    if (onClick) {
                        onClick()
                    }
                    else {
                        setLoadingPath(href)
                        startTransition(() => router.push(href))
                    }
                }}
                className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
                    isSubmenu ? "ml-6 text-sm" : "text-base",
                    isActive
                        ? "bg-orange-500 dark:text-white text-orange-100"
                        : "hover:bg-orange-500/10 text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-expanded={isSubmenu ? undefined : undefined}
            >
                {icon}
                <span>{label}</span>
                {isLoading && <Spinner />}
            </button>
        )
    }

    return (
        <Sidebar variant="sidebar" >
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-primary">KMIPN VII</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarMenu className="space-y-1">
                        {items.filter(e => e.role?.includes(user?.role!)).map((item) => {
                            const hasSubmenu = !!item.submenu
                            const isExpanded = expandedMenus.includes(item.title)
                            const isActive = pathname === item.url || (hasSubmenu && item.submenu?.some(sub => pathname === sub.url))

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        {hasSubmenu ? (
                                            <button
                                                onClick={() => toggleMenu(item.title)}
                                                className={cn(
                                                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all",
                                                    isActive
                                                        ? "bg-orange-500 text-primary-foreground"
                                                        : "hover:bg-primary/10 text-foreground"
                                                )}
                                                aria-expanded={isExpanded}
                                                aria-controls={`${item.title}-submenu`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="h-5 w-5" />
                                                    <span>{item.title}</span>
                                                </div>
                                                <span className="transition-transform duration-200">
                                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                </span>
                                            </button>
                                        ) : (
                                            <NavItem
                                                href={item.url}
                                                icon={<item.icon className="h-5 w-5" />}
                                                label={item.title}
                                                isActiveOverride={isActive}
                                            />
                                        )}
                                    </SidebarMenuButton>

                                    {hasSubmenu && (
                                        <div
                                            id={`${item.title}-submenu`}
                                            role="region"
                                            aria-label={`${item.title} submenu`}
                                            className={cn(
                                                "overflow-hidden transition-all duration-300 ease-in-out",
                                                isExpanded ? "max-h-max max-w-full" : "max-h-0"
                                            )}
                                        >
                                            <div className="ml-6 mt-1 max-w-full space-y-1 border-l border-primary/20">
                                                {item.submenu!.map(subItem => (
                                                    <NavItem
                                                        key={subItem.title}
                                                        href={subItem.url}
                                                        label={subItem.title}
                                                        isSubmenu
                                                        isActiveOverride={pathname === subItem.url}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">{user?.name}</span>
                    <ThemeToggle />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

const Spinner = () => (
    <div className="ml-auto h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
)
