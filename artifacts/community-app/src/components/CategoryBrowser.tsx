import { Utensils, Stethoscope, Car, BookOpen, Droplets, Home, Shirt, Zap } from "lucide-react";
import { useCategoryPostCounts } from "@/hooks/useCommunityData";

interface Props {
  onCategorySelect?: (cat: string) => void;
  selected?: string;
}

const categories = [
  { id: "Food & Groceries", label: "Food & Groceries", icon: Utensils, color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
  { id: "Health & Medical", label: "Health & Medical", icon: Stethoscope, color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
  { id: "Transportation", label: "Transportation", icon: Car, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { id: "School & Supplies", label: "School & Supplies", icon: BookOpen, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  { id: "Flood Relief", label: "Flood Relief", icon: Droplets, color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400" },
  { id: "Shelter", label: "Shelter", icon: Home, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
  { id: "Clothing", label: "Clothing", icon: Shirt, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
  { id: "Utilities", label: "Utilities", icon: Zap, color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" },
];

export const CATEGORIES = categories.map(c => c.id);

export default function CategoryBrowser({ onCategorySelect, selected }: Props) {
  const { counts } = useCategoryPostCounts();

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selected === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect?.(isSelected ? "All" : cat.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{cat.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {count === 0 ? "No posts yet" : `${count} ${count === 1 ? "post" : "posts"}`}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
