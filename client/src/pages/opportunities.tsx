import { useQuery, useMutation } from "@tanstack/react-query";
import { OpportunityCard } from "@/components/opportunity-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, RefreshCw, Filter, TrendingUp, CheckCircle2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function OpportunitiesPage() {
  const { toast } = useToast();

  const { data: opportunities = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/opportunities"],
  });

  const dismissMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/opportunities/${id}`, { status: "dismissed" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
      toast({
        title: "Opportunity dismissed",
        description: "This opportunity has been removed from your active list.",
      });
    },
  });

  const pursueMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/opportunities/${id}`, { status: "pursuing" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
      toast({
        title: "Great choice!",
        description: "This opportunity has been marked as pursuing. Check your sessions for guidance.",
      });
    },
  });

  const activeOpportunities = opportunities.filter(o => o.status === "active");
  const pursuingOpportunities = opportunities.filter(o => o.status === "pursuing");
  const completedOpportunities = opportunities.filter(o => o.status === "completed");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-primary" />
            Opportunities
          </h1>
          <p className="text-muted-foreground mt-1">
            Curated money-making opportunities based on your profile
          </p>
        </div>
        <Button variant="outline" size="sm" data-testid="button-refresh-opportunities">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          <TrendingUp className="w-3 h-3 mr-1" />
          {activeOpportunities.length} Active
        </Badge>
        <Badge variant="outline">
          {pursuingOpportunities.length} Pursuing
        </Badge>
        <Badge variant="outline">
          {completedOpportunities.length} Completed
        </Badge>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active" data-testid="tab-active-opportunities">
            Active ({activeOpportunities.length})
          </TabsTrigger>
          <TabsTrigger value="pursuing" data-testid="tab-pursuing-opportunities">
            Pursuing ({pursuingOpportunities.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed-opportunities">
            Completed ({completedOpportunities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onDismiss={(id) => dismissMutation.mutate(id)}
                  onPursue={(id) => pursueMutation.mutate(id)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-3">
                <Lightbulb className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-bold text-foreground">No active opportunities</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Start a chat with MilesAI to discover personalized opportunities based on your skills and goals.
                </p>
                <Button asChild className="mt-4">
                  <a href="/chat" data-testid="link-start-chat">Start Chatting</a>
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pursuing" className="mt-6">
          {pursuingOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pursuingOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-3">
                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-bold text-foreground">No opportunities in progress</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Mark opportunities from the Active tab to start pursuing them.
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-bold text-foreground">No completed opportunities yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Your completed opportunities will appear here once you achieve them.
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
