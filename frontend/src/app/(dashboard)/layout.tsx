import DashboardLayout from "@/components/layouts/DashboardLayout";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </SidebarProvider>
    )
}