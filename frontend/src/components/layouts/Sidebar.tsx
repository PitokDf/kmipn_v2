'use client'

import {
    Users, ChevronDown, LucideProps,
    LayoutDashboard, FolderKanban, UserCog, FileSearch,
    FileEdit, Upload, Flag, BarChart3,
    CalendarClock
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
import { Badge } from "@/components/ui/badge"

type itemsLink = {
    title: string;
    url: string,
    role: ("admin" | "operator" | "participant")[],
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
    submenu?: {
        title: string;
        url: string;
        badge?: string;
    }[]
    badge?: string;
    description?: string;
}

const items: itemsLink[] = [
    // admin dan operator access
    {
        title: "Dashboard",
        url: "/admin",
        role: ["admin", "operator"],
        icon: LayoutDashboard,
        description: "Overview & Analytics"
    },
    {
        title: "Users",
        url: "/admin/users",
        role: ["admin"],
        icon: UserCog,
        description: "User Administration",
        badge: "Admin"
    },
    {
        title: "Category",
        url: "/admin/categories",
        role: ["admin"],
        icon: FolderKanban,
        description: "Manage Competition Categories",
        badge: "Admin"
    },
    {
        title: "Team",
        url: "/admin/teams",
        role: ["admin", "operator"],
        icon: Users,
        description: "Team Management"
    },

    {
        title: "Proposals",
        url: "/admin/proposals",
        role: ["admin", "operator"],
        icon: FileSearch,
        description: "Review Proposals"
    },
    {
        title: "Rounds",
        url: "/admin/rounds",
        role: ["admin", "operator"],
        icon: Flag,
        description: "Competition Rounds"
    },
    {
        title: "Timeline",
        url: "/admin/timeline",
        icon: CalendarClock,
        badge: "Admin",
        description: "Create Competition Timeline",
        role: ["admin"],
    },
    {
        title: "Report",
        url: "/admin/reports",
        role: ["admin", "operator"],
        icon: BarChart3,
        description: "Analytics & Reports",
        submenu: [
            { title: "Teams", url: "/admin/reports/teams" },
        ]
    },

    // participant access
    {
        title: "Dashboard",
        url: "/participant",
        role: ["participant"],
        icon: LayoutDashboard,
        description: "Your Competition Overview"
    },
    {
        title: "My Team",
        url: "/participant/team",
        role: ["participant"],
        icon: Users,
        description: "Team Information"
    },
    {
        title: "Proposal",
        url: "/participant/proposal",
        role: ["participant"],
        icon: FileEdit,
        description: "Submit Your Proposal"
    },
    {
        title: "Submission",
        url: "/participant/submission",
        role: ["participant"],
        icon: Upload,
        description: "Competition Submissions"
    },
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

    const NavItem = ({
        href,
        icon,
        label,
        description,
        badge,
        onClick,
        isSubmenu = false,
        isActiveOverride
    }: {
        href: string,
        icon?: React.ReactNode,
        label: string,
        description?: string,
        badge?: string,
        onClick?: () => void,
        isSubmenu?: boolean,
        isActiveOverride?: boolean
    }) => {
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
                    "group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ease-in-out",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    isSubmenu ? "ml-6 text-sm py-2" : "text-base",
                    isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white shadow-lg shadow-orange-500/25 dark:shadow-orange-600/25"
                        : "hover:bg-orange-50 dark:hover:bg-orange-950/30 text-foreground dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-300"
                )}
                aria-current={isActive ? "page" : undefined}
                disabled={isLoading}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {icon && (
                        <div className={cn(
                            "flex-shrink-0 transition-colors duration-200",
                            isActive ? "text-white" : "text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400"
                        )}>
                            {icon}
                        </div>
                    )}
                    <div className="flex-1 min-w-0 text-left">
                        <div className="font-medium truncate">{label}</div>
                        {description && !isSubmenu && (
                            <div className={cn(
                                "text-xs truncate mt-0.5 transition-colors duration-200",
                                isActive
                                    ? "text-orange-100"
                                    : "text-muted-foreground group-hover:text-orange-600/70 dark:group-hover:text-orange-400/70"
                            )}>
                                {description}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {badge && (
                        <Badge
                            variant="secondary"
                            className={cn(
                                "text-xs px-2 py-0.5 transition-colors duration-200",
                                isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                            )}
                        >
                            {badge}
                        </Badge>
                    )}
                    {isLoading && <Spinner />}
                </div>

                {/* Active indicator */}
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
            </button>
        )
    }

    const filteredItems = items.filter(e => e.role?.includes(user?.role!))

    return (
        <Sidebar variant="sidebar" className="border-r border-border/50 dark:border-gray-800">
            <SidebarHeader className="p-6 border-b border-border/50 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="font-bold text-white text-lg">K</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
                            KMIPN VII
                        </span>
                        <div className="text-xs text-muted-foreground dark:text-gray-400">
                            Competition Platform
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-4 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground dark:text-gray-400 uppercase tracking-wider mb-3">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarMenu className="space-y-2">
                        {filteredItems.map((item) => {
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
                                                    "group relative flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 transition-all duration-200 ease-in-out",
                                                    "hover:scale-[1.02] active:scale-[0.98]",
                                                    isActive
                                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white shadow-lg shadow-orange-500/25 dark:shadow-orange-600/25"
                                                        : "hover:bg-orange-50 dark:hover:bg-orange-950/30 text-foreground dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-300"
                                                )}
                                                aria-expanded={isExpanded}
                                                aria-controls={`${item.title}-submenu`}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className={cn(
                                                        "flex-shrink-0 transition-colors duration-200",
                                                        isActive ? "text-white" : "text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400"
                                                    )}>
                                                        <item.icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <div className="font-medium truncate">{item.title}</div>
                                                        {item.description && (
                                                            <div className={cn(
                                                                "text-xs truncate mt-0.5 transition-colors duration-200",
                                                                isActive
                                                                    ? "text-orange-100"
                                                                    : "text-muted-foreground group-hover:text-orange-600/70 dark:group-hover:text-orange-400/70"
                                                            )}>
                                                                {item.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {item.badge && (
                                                        <Badge
                                                            variant="secondary"
                                                            className={cn(
                                                                "text-xs px-2 py-0.5",
                                                                isActive
                                                                    ? "bg-white/20 text-white"
                                                                    : "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                                                            )}
                                                        >
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                    <div className={cn(
                                                        "transition-transform duration-300 ease-in-out",
                                                        isExpanded ? "rotate-180" : ""
                                                    )}>
                                                        <ChevronDown className="h-4 w-4" />
                                                    </div>
                                                </div>
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                                                )}
                                            </button>
                                        ) : (
                                            <NavItem
                                                href={item.url}
                                                icon={<item.icon className="h-5 w-5" />}
                                                label={item.title}
                                                description={item.description}
                                                badge={item.badge}
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
                                                isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                            )}
                                        >
                                            <div className="ml-6 mt-2 space-y-1">
                                                <div className="w-px h-full bg-gradient-to-b from-orange-200 dark:from-orange-800 to-transparent absolute left-6 top-0" />
                                                {item.submenu!.map(subItem => (
                                                    <div key={subItem.title} className="relative">
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-px bg-orange-200 dark:bg-orange-800" />
                                                        <NavItem
                                                            href={subItem.url}
                                                            label={subItem.title}
                                                            badge={subItem.badge}
                                                            isSubmenu
                                                            isActiveOverride={pathname === subItem.url}
                                                        />
                                                    </div>
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

            <SidebarFooter className="p-4 border-t border-border/50 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                        Theme
                    </span>
                    <ThemeToggle />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

const Spinner = () => (
    <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin opacity-70" />
)