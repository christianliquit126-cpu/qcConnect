import { useState } from "react";
import { useLocation } from "wouter";
import HeroSection from "@/components/HeroSection";
import QuickActions from "@/components/QuickActions";
import CommunityFeed from "@/components/CommunityFeed";
import CommunityUpdates from "@/components/CommunityUpdates";
import CategoryBrowser from "@/components/CategoryBrowser";
import { useRecentUsers } from "@/hooks/useCommunityData";
import { useChats } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <HeroSection onSearch={setSearchQuery} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CategoryBrowser
              onCategorySelect={setSelectedCategory}
              selected={selectedCategory === "All" ? undefined : selectedCategory}
            />
            <CommunityFeed searchQuery={searchQuery} categoryFilter={selectedCategory} />
          </div>

          <div className="space-y-6">
            <CommunityUpdates />
            <RecentMembers />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentMembers() {
  const { users, loading } = useRecentUsers(6);
  const { startChat } = useChats();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleMessage = async (uid: string) => {
    if (!user) { setLocation("/login"); return; }
    await startChat(uid);
    setLocation("/messages");
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">Community Members</h3>

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-3">
          No members yet. Sign up to be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {users
            .filter((u) => u.uid !== user?.uid)
            .map((member) => (
              <div key={member.uid} className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{member.name}</p>
                  {member.location && (
                    <p className="text-xs text-gray-500 truncate">{member.location}</p>
                  )}
                </div>
                {user && user.uid !== member.uid && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 shrink-0"
                    onClick={() => handleMessage(member.uid)}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
