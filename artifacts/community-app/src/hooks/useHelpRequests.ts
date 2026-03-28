import { useState, useEffect } from "react";
import { ref, onValue, push, update, remove, query, orderByChild, limitToLast } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export type HelpStatus = "Pending" | "In Progress" | "Completed";

export interface HelpRequest {
  requestId: string;
  uid: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: HelpStatus;
  createdAt: number;
}

export function useHelpRequests(filterUid?: string) {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    const reqRef = query(ref(db, "helpRequests"), orderByChild("createdAt"), limitToLast(100));
    const unsub = onValue(reqRef, (snap) => {
      const data: HelpRequest[] = [];
      snap.forEach((child) => {
        const req = { requestId: child.key!, ...child.val() } as HelpRequest;
        if (!filterUid || req.uid === filterUid) {
          data.push(req);
        }
      });
      setRequests(data.reverse());
      setLoading(false);
    });
    return () => unsub();
  }, [filterUid]);

  const createRequest = async (data: {
    title: string;
    description: string;
    category: string;
    location: string;
  }) => {
    if (!user || !userProfile) return;
    await push(ref(db, "helpRequests"), {
      uid: user.uid,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      ...data,
      status: "Pending" as HelpStatus,
      createdAt: Date.now(),
    });
  };

  const updateStatus = async (requestId: string, status: HelpStatus) => {
    await update(ref(db, `helpRequests/${requestId}`), { status });
  };

  const deleteRequest = async (requestId: string) => {
    await remove(ref(db, `helpRequests/${requestId}`));
  };

  return { requests, loading, createRequest, updateStatus, deleteRequest };
}
