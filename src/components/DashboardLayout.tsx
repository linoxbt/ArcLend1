import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        {!isMobile && (
          <aside className="w-64 shrink-0">
            <AppSidebar onClose={() => {}} />
          </aside>
        )}

        {/* Mobile overlay */}
        {isMobile && mobileOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
            <aside className="fixed inset-y-0 left-0 z-50 w-64">
              <AppSidebar onClose={() => setMobileOpen(false)} />
            </aside>
          </>
        )}

        <main className="flex min-w-0 flex-1 flex-col overflow-auto">
          <header className="flex h-14 items-center border-b border-border px-4">
            {isMobile && (
              <button onClick={() => setMobileOpen(true)} className="mr-3 text-foreground">
                <Menu className="h-5 w-5" />
              </button>
            )}
            <span className="text-sm text-muted-foreground">ArcLend Protocol</span>
          </header>
          <div className="dot-grid flex-1 p-4 md:p-6">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
