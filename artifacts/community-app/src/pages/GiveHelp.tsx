import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useHelpRequests } from "@/hooks/useHelpRequests";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Clock, MessageSquare } from "lucide-react";
import { useChats } from "@/hooks/useChat";

function timeAgo(seconds: number) {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function GiveHelp() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { requests, loading } = useHelpRequests();
  const { startChat } = useChats();

  const pending = requests.filter((r) => r.status === "Pending" && r.uid !== user?.uid);

  const handleHelp = async (uid: string) => {
    if (!user) { setLocation("/login"); return; }
    const chatId = await startChat(uid);
    setLocation("/messages");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Give Help</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Browse pending help requests and offer your assistance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pending Requests", value: pending.length, color: "text-orange-600 dark:text-orange-400" },
            { label: "Total Requests", value: requests.length, color: "text-blue-600 dark:text-blue-400" },
            { label: "Completed", value: requests.filter(r => r.status === "Completed").length, color: "text-green-600 dark:text-green-400" },
          ].map((stat) => (
            <Card key={stat.label} className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-blue-500 animate-spin" /></div>
        ) : pending.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-sm">No pending requests right now. Check back later!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((req) => (
              <Card key={req.requestId} className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img src={req.authorAvatar} alt={req.authorName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{req.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{req.authorName}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleHelp(req.uid)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs gap-1.5 shrink-0"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Offer Help
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{req.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location || "Not specified"}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.createdAt ? timeAgo(req.createdAt.seconds) : "recently"}</span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">{req.category}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
