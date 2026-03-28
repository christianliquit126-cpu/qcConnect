import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Messages from "@/pages/Messages";
import GetHelp from "@/pages/GetHelp";
import GiveHelp from "@/pages/GiveHelp";
import Resources from "@/pages/Resources";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function AppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <AppLoading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route>
          <Navbar />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/messages" component={Messages} />
            <Route path="/get-help" component={GetHelp} />
            <Route path="/give-help" component={GiveHelp} />
            <Route path="/resources" component={Resources} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppRoutes />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
