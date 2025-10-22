import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TherapySession } from "@shared/schema";
import { Calendar, Lightbulb, Target, Sparkles, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface TherapySessionCardProps {
  session: TherapySession;
}

export function TherapySessionCard({ session }: TherapySessionCardProps) {
  const getMoodChange = () => {
    if (!session.userMoodAfter) return null;
    
    const moodImprovement = 
      session.userMoodAfter.toLowerCase().includes("better") ||
      session.userMoodAfter.toLowerCase().includes("hopeful") ||
      session.userMoodAfter.toLowerCase().includes("motivated");

    return moodImprovement;
  };

  const moodImproved = getMoodChange();

  return (
    <Card className="hover-elevate" data-testid={`card-session-${session.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                {format(new Date(session.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
            <CardTitle className="text-base">
              Session {session.sessionId.split('-')[0]}
            </CardTitle>
          </div>
          {moodImproved !== null && (
            <Badge 
              variant="outline" 
              className={moodImproved ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}
            >
              {moodImproved ? <TrendingUp className="w-3 h-3 mr-1" /> : null}
              {moodImproved ? "Improved" : "In Progress"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Mood Before</p>
            <Badge variant="secondary" className="text-xs">
              {session.userMoodBefore}
            </Badge>
          </div>
          {session.userMoodAfter && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Mood After</p>
              <Badge variant="secondary" className="text-xs">
                {session.userMoodAfter}
              </Badge>
            </div>
          )}
        </div>

        {session.topicsDiscussed.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Topics Discussed
            </p>
            <div className="flex flex-wrap gap-1.5">
              {session.topicsDiscussed.slice(0, 3).map((topic, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {session.topicsDiscussed.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{session.topicsDiscussed.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {session.insightsProvided.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              Key Insights
            </p>
            <ul className="space-y-1">
              {session.insightsProvided.slice(0, 2).map((insight, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  <span className="flex-1 line-clamp-2">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {session.actionItems.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Target className="w-3 h-3 text-secondary" />
              Action Items
            </p>
            <ul className="space-y-1">
              {session.actionItems.slice(0, 2).map((action, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                  <span className="text-secondary font-mono">{idx + 1}.</span>
                  <span className="flex-1">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {session.breakthroughMoments.length > 0 && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 space-y-1">
            <p className="text-xs font-semibold text-primary flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Breakthrough Moment
            </p>
            <p className="text-xs text-foreground">
              {session.breakthroughMoments[0]}
            </p>
          </div>
        )}

        {session.nextSessionFocus && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Next Focus:</span> {session.nextSessionFocus}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
