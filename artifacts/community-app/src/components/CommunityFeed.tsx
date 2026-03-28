import { useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "./CategoryBrowser";

interface Props {
  searchQuery?: string;
  categoryFilter?: string;
}

export default function CommunityFeed({ searchQuery, categoryFilter }: Props) {
  const [category, setCategory] = useState(categoryFilter || "All");
  const { posts, loading, toggleLike, deletePost } = usePosts(category === "All" ? undefined : category);
  const { user } = useAuth();

  const filtered = posts.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Community Feed</h2>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {user && <CreatePost />}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No posts found. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onLike={toggleLike}
              onDelete={deletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}
