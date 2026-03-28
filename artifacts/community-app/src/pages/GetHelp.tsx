import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useHelpRequests, HelpStatus } from "@/hooks/useHelpRequests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, MapPin, Clock, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/components/CategoryBrowser";

function timeAgo(seconds: number) {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const statusConfig: Record<HelpStatus, { color: string; icon: React.ReactNode; label: string }> = {
  "Pending": { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <Clock className="w-3 h-3" />, label: "Pending" },
  "In Progress": { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: <AlertCircle className="w-3 h-3" />, label: "In Progress" },
  "Completed": { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircle className="w-3 h-3" />, label: "Completed" },
};

export default function GetHelp() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { requests, loading, createRequest, updateStatus, deleteRequest } = useHelpRequests();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "General", location: "" });
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createRequest(form);
      setForm({ title: "", description: "", category: "General", location: "" });
      setOpen(false);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const filtered = requests.filter((r) => filterStatus === "All" || r.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help Requests</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Post and browse community help requests</p>
          </div>
          {user ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <Plus className="w-4 h-4" /> Request Help
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Submit a Help Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input placeholder="Brief title of your request" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe what you need in detail..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[100px]" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Location</Label>
                      <Input placeholder="e.g. Barangay X" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={submitting}>
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Request"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <Button onClick={() => setLocation("/login")} className="bg-blue-600 hover:bg-blue-700 text-white">Sign In to Request</Button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          {["All", "Pending", "In Progress", "Completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === s
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-blue-500 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No help requests found</p>
            {user && <Button onClick={() => setOpen(true)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">Submit First Request</Button>}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => {
              const sc = statusConfig[req.status];
              const isOwner = user?.uid === req.uid;
              return (
                <Card key={req.requestId} className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <img src={req.authorAvatar} alt={req.authorName} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{req.title}</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}>
                              {sc.icon} {sc.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{req.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location || "Not specified"}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.createdAt ? timeAgo(req.createdAt.seconds) : "recently"}</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">{req.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isOwner && (
                          <>
                            <Select
                              value={req.status}
                              onValueChange={(v) => updateStatus(req.requestId, v as HelpStatus)}
                            >
                              <SelectTrigger className="h-7 w-32 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" className="w-7 h-7 text-red-400 hover:text-red-600" onClick={() => deleteRequest(req.requestId)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
