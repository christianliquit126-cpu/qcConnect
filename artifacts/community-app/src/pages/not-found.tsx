import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</h1>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Page not found</p>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">The page you're looking for doesn't exist.</p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
