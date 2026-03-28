import { ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCommunityUpdates } from "@/hooks/useCommunityData";
import { useLocation } from "wouter";

function timeAgo(seconds: number) {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CommunityUpdates() {
  const { updates, loading } = useCommunityUpdates();
  const [, setLocation] = useLocation();

  return (
    <Card className="border border-gray-200 dark:border-gray-700 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-gray-900 dark:text-white">Community Updates</CardTitle>
          <button
            onClick={() => setLocation("/get-help")}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          </div>
        ) : updates.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No pending requests yet. Be the first to post!
          </p>
        ) : (
          updates.map((update) => (
            <div key={update.id} className="flex gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 mt-0.5 h-fit ${update.tagColor}`}>
                {update.tag}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">{update.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{update.desc}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {update.createdAt ? timeAgo(update.createdAt) : "recently"}
                  {update.location ? ` · ${update.location}` : ""}
                </p>
              </div>
            </div>
          ))
        )}

        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3 border border-blue-100 dark:border-blue-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Safe & Verified Community</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              All posts are moderated to ensure a safe and respectful environment for everyone in Quezon City.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
