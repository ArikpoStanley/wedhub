import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { SiteProvider } from "@/context/site-context";
import { RequireAuth } from "@/components/require-auth";
import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import Home from "@/pages/home";
import OurStory from "@/pages/our-story";
import Gallery from "@/pages/gallery";
import Registry from "@/pages/registry";
import Schedule from "@/pages/schedule";
import Admin from "@/pages/admin";
import AdminSetup from "@/pages/admin-setup";
import NotFound from "@/pages/not-found";

function AdminSetupGated() {
  return (
    <RequireAuth>
      <AdminSetup />
    </RequireAuth>
  );
}

function AdminGated() {
  return (
    <RequireAuth>
      <Admin />
    </RequireAuth>
  );
}

function Router() {
  return (
    <SiteProvider>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/admin/setup" component={AdminSetupGated} />
        <Route path="/w/:slug" component={Home} />
        <Route path="/w/:slug/our-story" component={OurStory} />
        <Route path="/w/:slug/gallery" component={Gallery} />
        <Route path="/w/:slug/registry" component={Registry} />
        <Route path="/w/:slug/schedule" component={Schedule} />
        <Route path="/admin" component={AdminGated} />
        <Route path="/our-story">
          <Redirect href="/" />
        </Route>
        <Route path="/gallery">
          <Redirect href="/" />
        </Route>
        <Route path="/registry">
          <Redirect href="/" />
        </Route>
        <Route path="/schedule">
          <Redirect href="/" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </SiteProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
