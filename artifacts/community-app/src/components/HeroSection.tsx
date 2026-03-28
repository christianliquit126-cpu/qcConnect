import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const POPULAR_TAGS = ["Food Assistance", "Medical Transport", "School Supplies", "Flood Help"];

interface Props {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const { userProfile } = useAuth();
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(search);
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-white blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
            How can we help you today{userProfile ? `, ${userProfile.name.split(" ")[0]}` : ""}?
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-xl">
            Connect with your community, get support, or lend a helping hand. We're stronger when we help each other.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for help, resources, or questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 bg-white dark:bg-gray-900 border-white/20 text-gray-900 dark:text-white placeholder-gray-400 text-sm rounded-xl"
              />
            </div>
            <Button type="submit" className="h-12 px-6 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-blue-200 text-sm font-medium">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => { setSearch(tag); if (onSearch) onSearch(tag); }}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors backdrop-blur-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
