import { useState, useEffect } from "react";
import { ref, onValue, query, orderByChild, limitToLast, equalTo } from "firebase/database";
import { db } from "@/lib/firebase";

export interface RecentUser {
  uid: string;
  name: string;
  avatar: string;
  location?: string;
  createdAt?: number;
}

export interface CommunityUpdate {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  desc: string;
  location?: string;
  createdAt: number;
  authorName: string;
}

function getCategoryTag(category: string): { tag: string; tagColor: string } {
  const map: Record<string, { tag: string; tagColor: string }> = {
    "Food & Groceries": { tag: "FOOD", tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" },
    "Health & Medical": { tag: "HEALTH", tagColor: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
    "Transportation": { tag: "RIDE", tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
    "School & Supplies": { tag: "EDU", tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400" },
    "Flood Relief": { tag: "FLOOD", tagColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400" },
    "Shelter": { tag: "HOME", tagColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" },
    "Clothing": { tag: "CLOTH", tagColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400" },
    "Utilities": { tag: "UTIL", tagColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400" },
  };
  return map[category] || { tag: "NEED", tagColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
}

export function useCommunityUpdates() {
  const [updates, setUpdates] = useState<CommunityUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reqRef = query(ref(db, "helpRequests"), orderByChild("createdAt"), limitToLast(10));
    const unsub = onValue(reqRef, (snap) => {
      const items: CommunityUpdate[] = [];
      snap.forEach((child) => {
        const data = child.val();
        if (data.status === "Pending") {
          const { tag, tagColor } = getCategoryTag(data.category);
          items.push({
            id: child.key!,
            tag,
            tagColor,
            title: data.title,
            desc: data.description,
            location: data.location || "",
            createdAt: data.createdAt,
            authorName: data.authorName,
          });
        }
      });
      setUpdates(items.reverse().slice(0, 5));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { updates, loading };
}

export function useRecentUsers(count = 6) {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = query(ref(db, "users"), orderByChild("createdAt"), limitToLast(count));
    const unsub = onValue(usersRef, (snap) => {
      const data: RecentUser[] = [];
      snap.forEach((child) => {
        data.push({ uid: child.key!, ...child.val() });
      });
      setUsers(data.reverse());
      setLoading(false);
    });
    return () => unsub();
  }, [count]);

  return { users, loading };
}

export function useCategoryPostCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = ref(db, "posts");
    const unsub = onValue(postsRef, (snap) => {
      const map: Record<string, number> = {};
      snap.forEach((child) => {
        const cat = child.val().category as string;
        if (cat) map[cat] = (map[cat] || 0) + 1;
      });
      setCounts(map);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { counts, loading };
}
