import { useState } from "react";
import { Heart, MessageCircle, Trash2, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Post, useComments } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

function timeAgo(ms: number) {
  const diff = Math.floor((Date.now() - ms) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface Props {
  post: Post;
  onLike: (postId: string, liked: boolean) => void;
  onDelete: (postId: string) => void;
}

export default function PostCard({ post, onLike, onDelete }: Props) {
  const { user } = useAuth();
  const { comments, addComment, deleteComment } = useComments(post.postId);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const liked = user ? !!(post.likes?.[user.uid]) : false;
  const isOwner = user?.uid === post.uid;

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    await addComment(commentText.trim());
    setCommentText("");
    setSubmitting(false);
    setShowComments(true);
  };

  const categoryColor: Record<string, string> = {
    "Food & Groceries": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Health & Medical": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Transportation": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "School & Supplies": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Flood Relief": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "Shelter": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Clothing": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    "Utilities": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "General": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{post.authorName}</p>
              <p className="text-xs text-gray-400">
                {post.createdAt ? timeAgo(post.createdAt) : "recently"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor[post.category] || categoryColor["General"]}`}>
              {post.category}
            </span>
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-gray-400 hover:text-red-500"
                onClick={() => onDelete(post.postId)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{post.content}</p>

        {post.imageURL && (
          <img
            src={post.imageURL}
            alt="post"
            className="w-full rounded-xl mb-3 max-h-72 object-cover"
          />
        )}

        <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => user && onLike(post.postId, liked)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span>{post.likes.length}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length || post.commentCount}</span>
            {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-h-48 overflow-y-auto p-4 space-y-3">
            {comments.length === 0 && (
              <p className="text-xs text-gray-400 text-center">No comments yet. Be the first!</p>
            )}
            {comments.map((c) => (
              <div key={c.commentId} className="flex items-start gap-2">
                <img src={c.authorAvatar} alt={c.authorName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{c.authorName}</p>
                    {user?.uid === c.uid && (
                      <button onClick={() => deleteComment(c.commentId)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          {user && (
            <form onSubmit={handleComment} className="p-4 pt-0 flex gap-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-0 h-9 text-xs resize-none py-2 flex-1"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(e as unknown as React.FormEvent); }}}
              />
              <Button type="submit" size="icon" className="h-9 w-9 bg-blue-600 hover:bg-blue-700 shrink-0" disabled={submitting}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
