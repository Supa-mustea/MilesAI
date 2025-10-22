import { useQuery } from "@tanstack/react-query";
import { TherapySessionCard } from "@/components/therapy-session-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, TrendingUp } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useSessions } from "@/hooks/use-api";

export default function SessionsPage() {
  const { data: sessions = [], isLoading } = useSessions();
  const mockSessions = [
    {
      id: "1",
      timestamp: "2024-01-15T10:00:00Z",
      notes: "Felt anxious about work.",
      mood: "anxious",
      progress: "managed to discuss concerns with manager",
    },
    {
      id: "2",
      timestamp: "2024-01-18T14:30:00Z",
      notes: "Feeling more relaxed after the session.",
      mood: "calm",
      progress: "practiced mindfulness techniques",
    },
  ];

  const recentSessions = [...sessions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const sessionsThisWeek = sessions.filter(session => {
    const sessionDate = new Date(session.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  }).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary" />
          Therapy Sessions
        </h1>
        <p className="text-muted-foreground mt-1">
          Review your therapy journey and track emotional progress
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          <Calendar className="w-3 h-3 mr-1" />
          {sessions.length} Total Sessions
        </Badge>
        <Badge variant="outline">
          <TrendingUp className="w-3 h-3 mr-1" />
          {sessionsThisWeek} This Week
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          {(sessions.length > 0 ? sessions : mockSessions).map((session: any) => (
            <TherapySessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}