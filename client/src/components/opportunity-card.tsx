import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OpportunityAlert } from "@shared/schema";
import { 
  TrendingUp, 
  Clock, 
  BarChart3, 
  CheckCircle2,
  XCircle,
  Calendar,
  Briefcase,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: OpportunityAlert;
  onDismiss?: (id: string) => void;
  onPursue?: (id: string) => void;
}

export function OpportunityCard({ opportunity, onDismiss, onPursue }: OpportunityCardProps) {
  const difficultyColor = 
    opportunity.difficultyLevel <= 3 ? "text-green-500" :
    opportunity.difficultyLevel <= 7 ? "text-yellow-500" :
    "text-red-500";

  const statusBadge = 
    opportunity.status === "completed" ? (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Completed
      </Badge>
    ) : opportunity.status === "dismissed" ? (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        <XCircle className="w-3 h-3 mr-1" />
        Dismissed
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
        <TrendingUp className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-opportunity-${opportunity.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-primary" />
              {statusBadge}
            </div>
            <CardTitle className="text-lg leading-tight">{opportunity.opportunityType}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {opportunity.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Potential Earnings
            </p>
            <p className="text-lg font-bold text-foreground">
              ₦{opportunity.potentialEarnings.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/month</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Time Investment
            </p>
            <p className="text-sm font-semibold text-foreground">{opportunity.timeInvestment}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Difficulty Level
            </p>
            <span className={cn("text-sm font-bold", difficultyColor)}>
              {opportunity.difficultyLevel}/10
            </span>
          </div>
          <Progress value={opportunity.difficultyLevel * 10} className="h-1.5" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Confidence Score</p>
            <span className="text-sm font-bold text-primary">
              {(opportunity.confidenceScore * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={opportunity.confidenceScore * 100} className="h-1.5" />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Deadline: <span className="font-medium text-foreground">{opportunity.deadline}</span></span>
        </div>

        {opportunity.requirements.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Requirements:</p>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.requirements.slice(0, 3).map((req, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {req}
                </Badge>
              ))}
              {opportunity.requirements.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{opportunity.requirements.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {opportunity.actionSteps.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Action Steps:</p>
            <ul className="space-y-1">
              {opportunity.actionSteps.slice(0, 3).map((step, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                  <span className="text-primary font-mono">{idx + 1}.</span>
                  <span className="flex-1">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          size="sm"
          className="flex-1 rounded-full"
          onClick={() => onPursue?.(opportunity.id)}
          disabled={opportunity.status === "completed" || opportunity.status === "dismissed"}
          data-testid={`button-pursue-${opportunity.id}`}
        >
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Pursue This
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDismiss?.(opportunity.id)}
          disabled={opportunity.status === "dismissed"}
          data-testid={`button-dismiss-${opportunity.id}`}
        >
          <XCircle className="w-4 h-4 mr-1.5" />
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  );
}
