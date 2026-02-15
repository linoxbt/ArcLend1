import { LayoutDashboard, Store, Layers, Activity } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { WalletButton } from "./WalletButton";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Markets", url: "/markets", icon: Store },
  { title: "Positions", url: "/positions", icon: Layers },
  { title: "Health Monitor", url: "/health", icon: Activity },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <div className="flex items-center gap-3 p-4">
        <img src={logo} alt="ArcLend" className="h-8 w-8" />
        <span className="text-lg font-bold text-foreground">ArcLend</span>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="mr-3 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto border-t border-border p-4">
        <WalletButton />
      </div>
    </Sidebar>
  );
}
