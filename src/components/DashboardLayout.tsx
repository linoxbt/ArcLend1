import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <header className="flex h-14 items-center border-b border-border px-4">
            <SidebarTrigger />
          </header>
          <div className="dot-grid p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
