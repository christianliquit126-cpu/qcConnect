import { useState, useEffect } from "react";
import {
  ref, onValue, push, update, remove, get,
  query, orderByChild, limitToLast,
} from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface Comment {
  commentId: string;
  postId: string;
  uid: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: number;
}

export interface Post {
  postId: string;
  uid: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageURL?: string;
  category: string;
  likes: Record<string, boolean>;
  commentCount: number;
  createdAt: number;
}

export function usePosts(category?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    const postsRef = query(ref(db, "posts"), orderByChild("createdAt"), limitToLast(50));
    const unsub = onValue(postsRef, (snap) => {
      const data: Post[] = [];
      snap.forEach((child) => {
        const post = { postId: child.key!, ...child.val() } as Post;
        if (!category || category === "All" || post.category === category) {
          data.push(post);
        }
      });
      setPosts(data.reverse());
      setLoading(false);
    });
    return () => unsub();
  }, [category]);

  const createPost = async (content: string, cat: string, imageURL?: string) => {
    if (!user || !userProfile) return;
    const newPost = {
      uid: user.uid,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      content,
      imageURL: imageURL || null,
      category: cat,
      likes: {},
      commentCount: 0,
      createdAt: Date.now(),
    };
    await push(ref(db, "posts"), newPost);
  };

  const toggleLike = async (postId: string, liked: boolean) => {
    if (!user) return;
    const likeRef = ref(db, `posts/${postId}/likes/${user.uid}`);
    if (liked) {
      await remove(likeRef);
    } else {
      await update(ref(db, `posts/${postId}/likes`), { [user.uid]: true });
    }
  };

  const deletePost = async (postId: string) => {
    await remove(ref(db, `posts/${postId}`));
    const commentsSnap = await get(query(ref(db, "comments"), orderByChild("postId")));
    commentsSnap.forEach((child) => {
      if (child.val().postId === postId) {
        remove(child.ref);
      }
    });
  };

  return { posts, loading, createPost, toggleLike, deletePost };
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (!postId) return;
    const commentsRef = query(ref(db, `comments/${postId}`), orderByChild("createdAt"));
    const unsub = onValue(commentsRef, (snap) => {
      const data: Comment[] = [];
      snap.forEach((child) => {
        data.push({ commentId: child.key!, postId, ...child.val() });
      });
      setComments(data);
    });
    return () => unsub();
  }, [postId]);

  const addComment = async (content: string) => {
    if (!user || !userProfile) return;
    await push(ref(db, `comments/${postId}`), {
      postId,
      uid: user.uid,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      content,
      createdAt: Date.now(),
    });
    const snap = await get(ref(db, `comments/${postId}`));
    await update(ref(db, `posts/${postId}`), { commentCount: snap.size });
  };

  const deleteComment = async (commentId: string) => {
    await remove(ref(db, `comments/${postId}/${commentId}`));
    const snap = await get(ref(db, `comments/${postId}`));
    await update(ref(db, `posts/${postId}`), { commentCount: snap.size });
  };

  return { comments, addComment, deleteComment };
}
