import { useLocation } from "wouter";
import { HelpCircle, HandHeart, BookOpen, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: HelpCircle,
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Request Help",
    desc: "Need assistance? Let the community know what you need.",
    cta: "Get Started",
    ctaStyle: "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    href: "/get-help",
  },
  {
    icon: HandHeart,
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Offer Help",
    desc: "Want to help others? Share your time and resources.",
    cta: "I Want to Help",
    ctaStyle: "border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20",
    href: "/give-help",
  },
  {
    icon: BookOpen,
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "Browse Resources",
    desc: "Find verified resources and essential information.",
    cta: "Explore",
    ctaStyle: "border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20",
    href: "/resources",
  },
  {
    icon: Phone,
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    title: "Emergency Hotlines",
    desc: "Quick access to important contact numbers.",
    cta: "View Hotlines",
    ctaStyle: "border border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20",
    href: "/resources",
  },
];

export default function QuickActions() {
  const [, setLocation] = useLocation();

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.title} className="border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <CardContent className="p-5">
                <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{action.desc}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full text-sm ${action.ctaStyle}`}
                  onClick={() => setLocation(action.href)}
                >
                  {action.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
