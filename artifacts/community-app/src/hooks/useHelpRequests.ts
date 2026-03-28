import { useState, useEffect } from "react";
import {
  collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, where,
} from "firebase/firestore";
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
  createdAt: { seconds: number } | null;
}

export function useHelpRequests(filterUid?: string) {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    let q = query(collection(db, "helpRequests"), orderBy("createdAt", "desc"));
    if (filterUid) {
      q = query(collection(db, "helpRequests"), where("uid", "==", filterUid), orderBy("createdAt", "desc"));
    }
    const unsub = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map((d) => ({ requestId: d.id, ...d.data() })) as HelpRequest[]);
      setLoading(false);
    });
    return unsub;
  }, [filterUid]);

  const createRequest = async (data: {
    title: string;
    description: string;
    category: string;
    location: string;
  }) => {
    if (!user || !userProfile) return;
    await addDoc(collection(db, "helpRequests"), {
      uid: user.uid,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      ...data,
      status: "Pending" as HelpStatus,
      createdAt: serverTimestamp(),
    });
  };

  const updateStatus = async (requestId: string, status: HelpStatus) => {
    await updateDoc(doc(db, "helpRequests", requestId), { status });
  };

  const deleteRequest = async (requestId: string) => {
    await deleteDoc(doc(db, "helpRequests", requestId));
  };

  return { requests, loading, createRequest, updateStatus, deleteRequest };
}
