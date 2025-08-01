import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ResumeBuilder from "./pages/ResumeBuilder";
import CoverLetter from "./pages/CoverLetter";
import InterviewPrep from "./pages/InterviewPrep";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import RecruiterOutreach from "./pages/RecruiterOutreach";
import PromotionPlanner from "./pages/PromotionPlanner";
import LayoffTracker from "./pages/LayoffTracker";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/cover-letter" element={<CoverLetter />} />
              <Route path="/interview-prep" element={<InterviewPrep />} />
              <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
              <Route path="/recruiter" element={<RecruiterOutreach />} />
              <Route path="/promotion-planner" element={<PromotionPlanner />} />
              <Route path="/layoff-tracker" element={<LayoffTracker />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/auth" element={<Auth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
