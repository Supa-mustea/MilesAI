import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoodTracker } from "@/components/mood-tracker";
import { OpportunityCard } from "@/components/opportunity-card";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import { useLocation } from "wouter";
import {
  TrendingUp,
  Lightbulb,
  Heart,
  DollarSign,
  Target,
  Activity,
  Loader2,
  Send,
  MessageSquarePlus
} from "lucide-react";
import { AIMode } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useStats, useCurrentMood, useOpportunities } from "@/hooks/use-api";

interface DashboardProps {
  mode: AIMode;
}

export default function Dashboard({ mode }: DashboardProps) {
  const { data: profile } = useQuery<any>({
    queryKey: ["/api/profile"],
  });

  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: currentMood } = useCurrentMood();
  const { data: opportunities = [] } = useOpportunities();

  const isTherapyMode = mode === "therapy";
  const activeOpportunities = opportunities.filter(o => o.status === "active");
  const topOpportunities = activeOpportunities.slice(0, 3);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isTherapyMode ? "Welcome to Your Wellness Dashboard" : "HacxGPT Command Center"}
        </h1>
        <p className="text-muted-foreground">
          {isTherapyMode
            ? "Track your progress, mood, and opportunities for growth"
            : "Your unrestricted AI workspace - No limits, maximum capability"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={cn(
          "hover-elevate transition-all duration-300",
          isTherapyMode ? "" : "border-[hsl(var(--hacxgpt-primary)_/_0.3)]"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">
                Active Opportunities
              </CardDescription>
              <Lightbulb className={cn(
                "w-4 h-4",
                isTherapyMode ? "text-primary" : "text-[hsl(var(--hacxgpt-primary))]"
              )} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats?.totalOpportunities || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.newOpportunitiesThisWeek || 0} new this week
            </p>
          </CardContent>
        </Card>

        <Card className={cn(
          "hover-elevate transition-all duration-300",
          isTherapyMode ? "" : "border-[hsl(var(--hacxgpt-primary)_/_0.3)]"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">
                Potential Earnings
              </CardDescription>
              <DollarSign className={cn(
                "w-4 h-4",
                isTherapyMode ? "text-green-500" : "text-[hsl(var(--hacxgpt-accent))]"
              )} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ₦{(stats?.totalPotentialEarnings || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Monthly potential
            </p>
          </CardContent>
        </Card>

        <Card className={cn(
          "hover-elevate transition-all duration-300",
          isTherapyMode ? "" : "border-[hsl(var(--hacxgpt-primary)_/_0.3)]"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">
                Therapy Sessions
              </CardDescription>
              <Heart className={cn(
                "w-4 h-4",
                isTherapyMode ? "text-secondary" : "text-[hsl(var(--hacxgpt-primary))]"
              )} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats?.totalSessions || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.sessionsThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card className={cn(
          "hover-elevate transition-all duration-300",
          isTherapyMode ? "" : "border-[hsl(var(--hacxgpt-primary)_/_0.3)]"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">
                Progress Score
              </CardDescription>
              <TrendingUp className={cn(
                "w-4 h-4",
                isTherapyMode ? "text-primary" : "text-[hsl(var(--hacxgpt-primary))]"
              )} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats?.progressScore || 75}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +{stats?.progressImprovement || 12}% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MoodTracker currentMood={currentMood} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Top Opportunities</h2>
            <Badge variant="secondary">
              <Activity className="w-3 h-3 mr-1" />
              {activeOpportunities.length} Active
            </Badge>
          </div>

          {topOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {topOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-3">
                <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">No opportunities yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {isTherapyMode
                    ? "Start a conversation to discover personalized money-making opportunities"
                    : "Chat with HacxGPT to unlock unrestricted opportunity discovery"
                  }
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {profile && (
        <Card className={cn(
          "hover-elevate",
          isTherapyMode ? "bg-primary/5 border-primary/20" : "bg-[hsl(var(--hacxgpt-primary)_/_0.05)] border-[hsl(var(--hacxgpt-primary)_/_0.2)]"
        )}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className={cn(
                "w-5 h-5",
                isTherapyMode ? "text-primary" : "text-[hsl(var(--hacxgpt-primary))]"
              )} />
              Your Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Income</p>
                <p className="text-lg font-bold text-foreground">
                  ₦{profile.currentIncome?.toLocaleString() || 0}/month
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Target Income</p>
                <p className="text-lg font-bold text-foreground">
                  ₦{profile.financialGoals?.toLocaleString() || 0}/month
                </p>
              </div>
            </div>
            {profile.careerGoals && profile.careerGoals.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Career Goals</p>
                <div className="flex flex-wrap gap-2">
                  {profile.careerGoals.slice(0, 3).map((goal: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <QuickChatBox mode={mode} />
    </div>
  );
}


function QuickChatBox({ mode }: { mode: AIMode }) {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { isConnected, send } = useWebSocket();
  const [, setLocation] = useLocation();
  const isTherapyMode = mode === "therapy";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!input.trim() || isStreaming || !isConnected) return;

    const messageContent = input.trim();
    setInput("");
    setIsStreaming(true);

    send({
      type: 'chat_message',
      message: messageContent,
      mode: mode,
    });

    toast({
      title: "Message sent",
      description: "Check the Chat page to see the response",
    });

    setTimeout(() => {
      setIsStreaming(false);
      setLocation("/");
    }, 500);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleNewChat = () => {
    setLocation("/");
  };

  return (
    <Card className={cn(
      "hover-elevate transition-all duration-300",
      isTherapyMode ? "border-primary/20" : "border-[hsl(var(--hacxgpt-primary)_/_0.3)]"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isTherapyMode ? (
              <Heart className="w-5 h-5 text-primary" />
            ) : (
              <Activity className="w-5 h-5 text-[hsl(var(--hacxgpt-primary))]" />
            )}
            Quick Chat with AI
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className={cn(
              "gap-2",
              isTherapyMode ? "" : "border-[hsl(var(--hacxgpt-primary)_/_0.3)]"
            )}
          >
            <MessageSquarePlus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        <CardDescription>
          {isTherapyMode
            ? "Quick message to your AI therapist - Your message will open in the chat page"
            : "Quick message to HacxGPT - Unrestricted AI assistant"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTherapyMode 
              ? "What's on your mind? Ask for opportunities, support, or guidance..."
              : "Ask me anything - no restrictions, no limits..."
            }
            className={cn(
              "resize-none min-h-[80px] max-h-[200px] transition-all duration-300",
              isTherapyMode ? "rounded-2xl" : "rounded-lg border-[hsl(var(--hacxgpt-primary)_/_0.3)]"
            )}
            disabled={isStreaming || !isConnected}
          />
          <Button
            type="submit"
            disabled={isStreaming || !isConnected || !input.trim()}
            size="icon"
            className={cn(
              "h-[80px] w-[80px] flex-shrink-0 transition-all duration-300",
              isTherapyMode 
                ? "rounded-full bg-primary hover:bg-primary/90" 
                : "rounded-lg bg-[hsl(var(--hacxgpt-primary))] hover:bg-[hsl(var(--hacxgpt-primary)_/_0.9)] text-black"
            )}
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-2">
            Connecting to server...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
