import { useState, useEffect } from "react";
import {
  collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, arrayUnion, arrayRemove, serverTimestamp, where, getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface Comment {
  commentId: string;
  postId: string;
  uid: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: unknown;
}

export interface Post {
  postId: string;
  uid: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageURL?: string;
  category: string;
  likes: string[];
  commentCount: number;
  createdAt: { seconds: number } | null;
}

export function usePosts(category?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    let q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    if (category && category !== "All") {
      q = query(collection(db, "posts"), where("category", "==", category), orderBy("createdAt", "desc"));
    }
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ postId: d.id, ...d.data() })) as Post[];
      setPosts(data);
      setLoading(false);
    });
    return unsub;
  }, [category]);

  const createPost = async (content: string, category: string, imageURL?: string) => {
    if (!user || !userProfile) return;
    await addDoc(collection(db, "posts"), {
      uid: user.uid,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      content,
      imageURL: imageURL || null,
      category,
      likes: [],
      commentCount: 0,
      createdAt: serverTimestamp(),
    });
  };

  const toggleLike = async (postId: string, liked: boolean) => {
    if (!user) return;
    const ref = doc(db, "posts", postId);
    await updateDoc(ref, {
      likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  };

  const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, "posts", postId));
  };

  return { posts, loading, createPost, toggleLike, deletePost };
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (!postId) return;
    const q = query(collection(db, "comments"), where("postId", "==", postId), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ commentId: d.id, ...d.data() })) as Comment[]);
    });
    return unsub;
  }, [postId]);

  const addComment = async (content: string) => {
    if (!user || !userProfile) return;
    await addDoc(collection(db, "comments"), {
      postId,
      uid: user.uid,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      content,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "posts", postId), {
      commentCount: (await getDocs(query(collection(db, "comments"), where("postId", "==", postId)))).size + 1,
    });
  };

  const deleteComment = async (commentId: string) => {
    await deleteDoc(doc(db, "comments", commentId));
  };

  return { comments, addComment, deleteComment };
}
