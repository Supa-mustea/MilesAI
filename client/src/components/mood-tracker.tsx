import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoodEntry } from "@shared/schema";
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodTrackerProps {
  currentMood?: MoodEntry;
  recentMoods?: MoodEntry[];
}

export function MoodTracker({ currentMood, recentMoods = [] }: MoodTrackerProps) {
  if (!currentMood) {
    return (
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="text-lg">Mood Tracking</CardTitle>
          <CardDescription>No mood data available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <Activity className="w-8 h-8 mr-2" />
            <p className="text-sm">Start chatting to track your mood</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMoodIcon = (emotion: string) => {
    const emotionLower = emotion.toLowerCase();
    if (emotionLower.includes("happy") || emotionLower.includes("optimistic") || emotionLower.includes("hopeful")) {
      return <Smile className="w-6 h-6 text-green-500" />;
    } else if (emotionLower.includes("sad") || emotionLower.includes("depressed") || emotionLower.includes("overwhelmed")) {
      return <Frown className="w-6 h-6 text-red-500" />;
    } else {
      return <Meh className="w-6 h-6 text-yellow-500" />;
    }
  };

  const averageEnergy = recentMoods.length > 0
    ? recentMoods.reduce((sum, m) => sum + m.energyLevel, 0) / recentMoods.length
    : currentMood.energyLevel;

  const averageStress = recentMoods.length > 0
    ? recentMoods.reduce((sum, m) => sum + m.stressLevel, 0) / recentMoods.length
    : currentMood.stressLevel;

  const energyTrend = recentMoods.length >= 2
    ? currentMood.energyLevel > recentMoods[recentMoods.length - 2].energyLevel
    : null;

  return (
    <Card className="hover-elevate" data-testid="card-mood-tracker">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Current Mood</CardTitle>
            <CardDescription>Real-time emotional state</CardDescription>
          </div>
          {getMoodIcon(currentMood.primaryEmotion)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Badge variant="outline" className="text-sm font-medium">
            {currentMood.primaryEmotion}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Energy Level</p>
              {energyTrend !== null && (
                energyTrend ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    currentMood.energyLevel >= 7 ? "bg-green-500" :
                    currentMood.energyLevel >= 4 ? "bg-yellow-500" :
                    "bg-red-500"
                  )}
                  style={{ width: `${currentMood.energyLevel * 10}%` }}
                />
              </div>
              <span className="text-sm font-bold tabular-nums">
                {currentMood.energyLevel}/10
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Stress Level</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    currentMood.stressLevel >= 7 ? "bg-red-500" :
                    currentMood.stressLevel >= 4 ? "bg-yellow-500" :
                    "bg-green-500"
                  )}
                  style={{ width: `${currentMood.stressLevel * 10}%` }}
                />
              </div>
              <span className="text-sm font-bold tabular-nums">
                {currentMood.stressLevel}/10
              </span>
            </div>
          </div>
        </div>

        {recentMoods.length > 0 && (
          <div className="pt-2 space-y-2 border-t border-border">
            <p className="text-xs font-semibold text-foreground">7-Day Average</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Energy</p>
                <p className="text-sm font-bold text-foreground tabular-nums">
                  {averageEnergy.toFixed(1)}/10
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Stress</p>
                <p className="text-sm font-bold text-foreground tabular-nums">
                  {averageStress.toFixed(1)}/10
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
