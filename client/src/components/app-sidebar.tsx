import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  MessageCircle, 
  LayoutDashboard, 
  Lightbulb, 
  Heart, 
  User,
  Terminal,
  Brain,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIMode } from "@shared/schema";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  currentMode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Opportunities",
    url: "/opportunities",
    icon: Lightbulb,
  },
  {
    title: "Therapy Sessions",
    url: "/sessions",
    icon: Heart,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar({ currentMode, onModeChange }: AppSidebarProps) {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
            currentMode === "therapy" ? "bg-primary/20" : "bg-[hsl(var(--hacxgpt-primary)_/_0.2)]"
          )}>
            {currentMode === "therapy" ? (
              <Brain className={cn("w-6 h-6", currentMode === "therapy" ? "text-primary" : "text-[hsl(var(--hacxgpt-primary))]")} />
            ) : (
              <Terminal className={cn("w-6 h-6", currentMode === "therapy" ? "text-primary" : "text-[hsl(var(--hacxgpt-primary))]")} />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">MilesAI</h2>
            <p className="text-xs text-muted-foreground">
              {currentMode === "therapy" ? "Life Coach Mode" : "HacxGPT Mode"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">AI Mode</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={currentMode === "therapy" ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange("therapy")}
              className={cn(
                "rounded-full transition-all duration-300",
                currentMode === "therapy" && "bg-primary hover:bg-primary/90"
              )}
              data-testid="button-mode-therapy"
            >
              <Heart className="w-3.5 h-3.5 mr-1.5" />
              Therapy
            </Button>
            <Button
              variant={currentMode === "hacxgpt" ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange("hacxgpt")}
              className={cn(
                "rounded-md transition-all duration-300",
                currentMode === "hacxgpt" && "bg-[hsl(var(--hacxgpt-primary))] hover:bg-[hsl(var(--hacxgpt-primary)_/_0.9)] text-black border-[hsl(var(--hacxgpt-primary))]"
              )}
              data-testid="button-mode-hacxgpt"
            >
              <Terminal className="w-3.5 h-3.5 mr-1.5" />
              HacxGPT
            </Button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-muted-foreground px-2">
            Quick Stats
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Opportunities</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  12
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sessions</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  <Heart className="w-3 h-3 mr-1" />
                  8
                </Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "rounded-lg p-3 transition-all duration-300",
          currentMode === "therapy" ? "bg-primary/10 border border-primary/20" : "bg-[hsl(var(--hacxgpt-primary)_/_0.1)] border border-[hsl(var(--hacxgpt-primary)_/_0.2)]"
        )}>
          <p className="text-xs font-medium text-sidebar-foreground mb-1">
            {currentMode === "therapy" ? "💙 Your Success = My Medicine" : "⚡ Unrestricted AI Power"}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentMode === "therapy" 
              ? "Empathetic support & opportunity finding" 
              : "Built by BlackTechX - No limits"
            }
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
