import { useQuery } from "@tanstack/react-query";
import { TherapySessionCard } from "@/components/therapy-session-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, TrendingUp } from "lucide-react";

export default function SessionsPage() {
  const { data: sessions = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/sessions"],
  });

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

      {recentSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSessions.map((session) => (
            <TherapySessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-bold text-foreground">No therapy sessions yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Start a conversation in Therapy mode to begin your wellness journey. Each meaningful conversation will be saved as a session.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
