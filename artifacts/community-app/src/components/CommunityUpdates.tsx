import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const updates = [
  {
    tag: "NEW",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    title: "Mobile Medical Clinic",
    desc: "Free check-up this Saturday at Barangay North Fairview, 8AM-12NN.",
    time: "Today",
    location: "Barangay North Fairview",
  },
  {
    tag: "NEED",
    tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    title: "Donations Needed",
    desc: "Family needs clothes and school supplies for two children.",
    time: "2 hours ago",
    location: "Barangay Payatas",
  },
  {
    tag: "EVENT",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    title: "Community Clean-up Drive",
    desc: "Volunteers needed this Sunday at La Mesa Eco Park, 6AM.",
    time: "1 day ago",
    location: "La Mesa",
  },
];

export default function CommunityUpdates() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-gray-900 dark:text-white">Community Updates</CardTitle>
          <button className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
            View All <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {updates.map((update) => (
          <div key={update.title} className="flex gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 mt-0.5 h-fit ${update.tagColor}`}>
              {update.tag}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">{update.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{update.desc}</p>
              <p className="text-xs text-gray-400 mt-1">{update.time} · {update.location}</p>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3 border border-blue-100 dark:border-blue-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Safe & Verified Community</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">All posts are moderated to ensure a safe and respectful environment for everyone in Quezon City.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
