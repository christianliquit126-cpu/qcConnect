import { useNotifications } from "@/hooks/useNotifications";
import { Bell, MessageSquare, Heart, HelpCircle, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface Props { onClose: () => void; }

function timeAgo(seconds: number) {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const icons: Record<string, React.ReactNode> = {
  message: <MessageSquare className="w-4 h-4 text-blue-500" />,
  comment: <MessageSquare className="w-4 h-4 text-green-500" />,
  like: <Heart className="w-4 h-4 text-red-500" />,
  help_update: <HelpCircle className="w-4 h-4 text-orange-500" />,
};

export default function NotificationPanel({ onClose }: Props) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-blue-600 h-7 px-2">
            <CheckCheck className="w-3 h-3 mr-1" /> All read
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="w-7 h-7">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">No notifications yet</div>
        ) : (
          notifications.slice(0, 20).map((n) => (
            <button
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${
                !n.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                {icons[n.type] || <Bell className="w-4 h-4 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {n.createdAt ? timeAgo(n.createdAt.seconds) : "recently"}
                </p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
