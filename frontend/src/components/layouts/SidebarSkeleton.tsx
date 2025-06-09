import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "../ui/sidebar";

export function SidebarSkeleton() {
    return (
        <Sidebar variant="sidebar" className="border-r border-border/50 dark:border-gray-800">
            <SidebarHeader className="p-6 border-b border-border/50 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-5 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-4 py-4">
                <div className="space-y-3">
                    {/* Navigation Label */}
                    <div className="mb-3">
                        <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                                    <div className="flex-1 space-y-1">
                                        <div className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse`}
                                            style={{ width: `${60 + Math.random() * 40}px` }} />
                                        <div className={`h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse`}
                                            style={{ width: `${80 + Math.random() * 60}px` }} />
                                    </div>
                                    {/* Randomly show badge skeleton */}
                                    {index % 3 === 0 && (
                                        <div className="h-5 w-12 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 dark:from-orange-800 dark:via-orange-700 dark:to-orange-800 rounded-full animate-pulse" />
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Submenu example */}
                        <div className="px-3 py-3 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                                <div className="flex-1 space-y-1">
                                    <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                                    <div className="h-3 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                                </div>
                                <div className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                            </div>
                            {/* Submenu items */}
                            <div className="ml-8 mt-2 space-y-1">
                                <div className="py-2">
                                    <div className="h-3 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                                </div>
                                <div className="py-2">
                                    <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-border/50 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse" />
                    <div className="w-9 h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-md animate-pulse" />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}