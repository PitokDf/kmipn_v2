import DashboardLayout from "@/components/layouts/DashboardLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/UserContext";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <SidebarProvider>
                <DashboardLayout>{children}</DashboardLayout>
            </SidebarProvider>
        </UserProvider>
    )
}