import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Auth
import Register from "@/pages/register/index";
import Login from "@/pages/login/index";
import ForgotPassword from "@/pages/forgot-password/index";
import ResetPassword from "@/pages/reset-password/index";

// Main app
import Home from "@/pages/home/index";
import Search from "@/pages/search/index";
import SearchPopup from "@/pages/search-popup/index";
import UserProfile from "@/pages/user-profile/index";
import MyProfile from "@/pages/my-profile/index";
import Friends from "@/pages/friends/index";
import Chat from "@/pages/chat/index";
import Call from "@/pages/call/index";
import Events from "@/pages/events/index";
import Games from "@/pages/games/index";
import GameRoom from "@/pages/game-room/index";
import EventDetail from "@/pages/event-detail/index";

// Admin
import AdminStats from "@/pages/admin-stats/index";
import AdminEventsManagement from "@/pages/admin-stats/EventsManagement";
import EventManagement from "@/pages/event-management/index";
import EventStats from "@/pages/event-stats/index";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Main app */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-popup" element={<SearchPopup />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/call" element={<Call />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/games" element={<Games />} />
          <Route path="/game" element={<GameRoom />} />

          {/* Admin */}
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/events-management" element={<AdminEventsManagement />} />
          <Route path="/admin/events" element={<EventManagement />} />
          <Route path="/admin/events/:id/stats" element={<EventStats />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
