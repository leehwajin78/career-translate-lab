import CoachingDashboard from "./pages/coaching/CoachingDashboard";
import CoachingQuestions from "./pages/coaching/CoachingQuestions";
import CoachingReview from "./pages/coaching/CoachingReview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/site/Layout";
import Index from "./pages/Index.tsx";
import Service from "./pages/Service.tsx";
import Diagnosis from "./pages/Diagnosis.tsx";
import Result from "./pages/Result.tsx";
import Consultation from "./pages/Consultation.tsx";
import Admin from "./pages/Admin.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import ApplyDiagnosis from "./pages/apply/ApplyDiagnosis.tsx";
import ApplyBuild from "./pages/apply/ApplyBuild.tsx";
import ApplyLaunch from "./pages/apply/ApplyLaunch.tsx";
import ApplyPartner from "./pages/apply/ApplyPartner.tsx";
import ApplyThankYou from "./pages/apply/ApplyThankYou.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/service" element={<Service />} />
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/result" element={<Result />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/apply/diagnosis" element={<ApplyDiagnosis />} />
            <Route path="/apply/build" element={<ApplyBuild />} />
            <Route path="/apply/launch" element={<ApplyLaunch />} />
            <Route path="/apply/partner" element={<ApplyPartner />} />
            <Route path="/apply/thank-you" element={<ApplyThankYou />} />
            <Route path="/coaching" element={<CoachingDashboard />} />
            <Route path="/coaching/questions" element={<CoachingQuestions />} />
            <Route path="/coaching/question" element={<CoachingQuestions />} />
            <Route path="/coaching/review" element={<CoachingReview />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

