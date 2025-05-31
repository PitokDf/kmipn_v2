import { Skeleton } from "@/components/ui/skeleton"

export function SidebarSkeleton() {
    return (
        <div className="w-64 h-screen border-r px-4 py-6 space-y-6">
            {/* Logo */}
            <Skeleton className="h-8 w-32" />

            {/* Menu Items */}
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded-md" />
                ))}
            </div>

            {/* Footer */}
            <div className="mt-auto space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-10" />
            </div>
        </div>
    )
}
