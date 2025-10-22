import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ChatPage from "@/pages/chat";
import OpportunitiesPage from "@/pages/opportunities";
import SessionsPage from "@/pages/sessions";
import ProfilePage from "@/pages/profile";
import { AIMode } from "@shared/schema";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

function Router({ mode }: { mode: AIMode }) {
  return (
    <Switch>
      <Route path="/" component={() => <Dashboard mode={mode} />} />
      <Route path="/chat" component={() => <ChatPage mode={mode} />} />
      <Route path="/opportunities" component={OpportunitiesPage} />
      <Route path="/sessions" component={SessionsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [currentMode, setCurrentMode] = useState<AIMode>("therapy");

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar 
              currentMode={currentMode} 
              onModeChange={setCurrentMode}
            />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between gap-2 p-4 border-b border-border bg-background">
                <SidebarTrigger data-testid="button-sidebar-toggle">
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SidebarTrigger>
              </header>
              <main className="flex-1 overflow-auto bg-background">
                <Router mode={currentMode} />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
