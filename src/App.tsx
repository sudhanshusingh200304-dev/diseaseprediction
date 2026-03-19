import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Predict from "./pages/Predict";
import AIPredict from "./pages/AIPredict";
import HealthInfo from "./pages/HealthInfo";
import PatientAuth from "./pages/PatientAuth";
import DoctorLogin from "./pages/DoctorLogin";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/ai-predict" element={<AIPredict />} />
              <Route path="/health-info" element={<HealthInfo />} />
              <Route path="/patient/auth" element={<PatientAuth />} />
              <Route path="/doctor/login" element={<DoctorLogin />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
