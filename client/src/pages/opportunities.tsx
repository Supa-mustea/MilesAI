import { useQuery, useMutation } from "@tanstack/react-query";
import { OpportunityCard } from "@/components/opportunity-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, RefreshCw, Filter, TrendingUp, CheckCircle2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useOpportunities } from "@/hooks/use-api";

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

  const mockOpportunities = [
    {
      id: "1",
      title: "Software Engineer",
      company: "Tech Corp",
      description: "Develop innovative software solutions.",
      status: "active",
      createdAt: "2023-01-01T10:00:00Z",
    },
    {
      id: "2",
      title: "Data Scientist",
      company: "Data Insights",
      description: "Analyze complex datasets to derive insights.",
      status: "active",
      createdAt: "2023-01-05T11:30:00Z",
    },
    {
      id: "3",
      title: "Product Manager",
      company: "Innovate Solutions",
      description: "Lead product development cycles.",
      status: "pursuing",
      createdAt: "2023-01-10T09:00:00Z",
    },
    {
      id: "4",
      title: "UX Designer",
      company: "Creative Minds",
      description: "Design user-friendly interfaces.",
      status: "completed",
      createdAt: "2023-01-15T14:00:00Z",
    },
  ];


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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(activeOpportunities.length > 0 ? activeOpportunities : mockOpportunities.filter(o => o.status === "active")).map((opportunity: any) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onDismiss={(id) => dismissMutation.mutate(id)}
                  onPursue={(id) => pursueMutation.mutate(id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pursuing" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(pursuingOpportunities.length > 0 ? pursuingOpportunities : mockOpportunities.filter(o => o.status === "pursuing")).map((opportunity: any) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(completedOpportunities.length > 0 ? completedOpportunities : mockOpportunities.filter(o => o.status === "completed")).map((opportunity: any) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}