import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useHelpRequests } from "@/hooks/useHelpRequests";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Edit3, Save, X, LogOut, Loader2 } from "lucide-react";
import PostCard from "@/components/PostCard";

export default function Profile() {
  const { user, userProfile, logout, updateUserProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || "");
  const [location, setLocation2] = useState(userProfile?.location || "");
  const [saving, setSaving] = useState(false);

  const { requests } = useHelpRequests(user?.uid);
  const { posts, toggleLike, deletePost } = usePosts();
  const myPosts = posts.filter((p) => p.uid === user?.uid);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Sign in to view your profile</p>
          <Button onClick={() => setLocation("/login")} className="bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    await updateUserProfile({ name, location });
    setEditing(false);
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Card className="border border-gray-200 dark:border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={userProfile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || "U")}&background=3B82F6&color=fff`}
                  alt={userProfile?.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Location</Label>
                      <Input value={location} onChange={(e) => setLocation2(e.target.value)} placeholder="e.g. Quezon City" className="h-8 text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5" disabled={saving}>
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="gap-1.5">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{userProfile?.name}</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{user.email}</p>
                    {userProfile?.location && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {userProfile.location}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(true); setName(userProfile?.name || ""); setLocation2(userProfile?.location || ""); }} className="gap-1.5 text-xs">
                        <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleLogout} className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50">
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{myPosts.length}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{requests.length}</p>
                <p className="text-xs text-gray-500">Help Requests</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{requests.filter(r => r.status === "Completed").length}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="posts" className="flex-1">My Posts ({myPosts.length})</TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">Help Requests ({requests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {myPosts.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500">No posts yet</p>
              </div>
            ) : (
              myPosts.map((post) => (
                <PostCard key={post.postId} post={post} onLike={toggleLike} onDelete={deletePost} />
              ))
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-3">
            {requests.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500">No help requests yet</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.requestId} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{req.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{req.description}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                      req.status === "Completed" ? "bg-green-100 text-green-700" :
                      req.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
