import { useQuery, useMutation } from "@tanstack/react-query";
import UserProfileForm from "@/components/user-profile-form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/use-api";

export default function ProfilePage() {
  const { toast } = useToast();

  const { data: profile, isLoading } = useProfile();

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated. MilesAI will use this information to provide better support.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <UserProfileForm
        initialData={profile}
        onSubmit={(data) => updateProfileMutation.mutate(data)}
        isLoading={updateProfileMutation.isPending}
      />
    </div>
  );
}