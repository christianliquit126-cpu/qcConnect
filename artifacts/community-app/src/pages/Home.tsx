import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import QuickActions from "@/components/QuickActions";
import CommunityFeed from "@/components/CommunityFeed";
import CommunityUpdates from "@/components/CommunityUpdates";
import CategoryBrowser from "@/components/CategoryBrowser";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <HeroSection onSearch={setSearchQuery} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CategoryBrowser onCategorySelect={setSelectedCategory} selected={selectedCategory === "All" ? undefined : selectedCategory} />
            <CommunityFeed searchQuery={searchQuery} categoryFilter={selectedCategory} />
          </div>

          <div className="space-y-6">
            <CommunityUpdates />
            <ActiveVolunteers />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveVolunteers() {
  const volunteers = [
    { name: "Maria Santos", role: "Medical Volunteer", avatar: "https://ui-avatars.com/api/?name=Maria+Santos&background=3B82F6&color=fff", online: true },
    { name: "Juan dela Cruz", role: "Food Distribution", avatar: "https://ui-avatars.com/api/?name=Juan+Cruz&background=10B981&color=fff", online: true },
    { name: "Ana Reyes", role: "School Supplies", avatar: "https://ui-avatars.com/api/?name=Ana+Reyes&background=8B5CF6&color=fff", online: false },
    { name: "Pedro Mendoza", role: "Transport Aid", avatar: "https://ui-avatars.com/api/?name=Pedro+Mendoza&background=F59E0B&color=fff", online: true },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">Active Volunteers</h3>
      <div className="space-y-3">
        {volunteers.map((v) => (
          <div key={v.name} className="flex items-center gap-3">
            <div className="relative">
              <img src={v.avatar} alt={v.name} className="w-9 h-9 rounded-full object-cover" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${v.online ? "bg-green-500" : "bg-gray-400"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{v.name}</p>
              <p className="text-xs text-gray-500">{v.role}</p>
            </div>
            <span className={`ml-auto text-xs ${v.online ? "text-green-500" : "text-gray-400"}`}>
              {v.online ? "Online" : "Offline"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
