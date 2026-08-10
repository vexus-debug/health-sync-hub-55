import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/dashboard/ProtectedRoute";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import Book from "./pages/Book.tsx";
import Results from "./pages/Results.tsx";
import Locations from "./pages/Locations.tsx";
import FAQs from "./pages/FAQs.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/layout/ScrollToTop";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import TestForms from "./pages/dashboard/TestForms.tsx";
import Pending from "./pages/dashboard/Pending.tsx";
import CompletedResults from "./pages/dashboard/Completed.tsx";
import Scientists from "./pages/dashboard/Scientists.tsx";
import ManageTests from "./pages/dashboard/ManageTests.tsx";
import DashboardSettings from "./pages/dashboard/Settings.tsx";
import ResultEntry from "./pages/dashboard/ResultEntry.tsx";
import NewTestForm from "./pages/dashboard/NewTestForm.tsx";
import ResultsSearch from "./pages/dashboard/ResultsSearch.tsx";
import Shop from "./pages/Shop.tsx";
import ShopAdmin from "./pages/dashboard/ShopAdmin.tsx";
import Pharmacy from "./pages/Pharmacy.tsx";
import PharmacyAdmin from "./pages/dashboard/PharmacyAdmin.tsx";
import ScanOverview from "./pages/scan/Overview.tsx";
import ScanPatients from "./pages/scan/Patients.tsx";
import ScanPatientDetail from "./pages/scan/PatientDetail.tsx";
import ScansList from "./pages/scan/Scans.tsx";
import ScanDetail from "./pages/scan/ScanDetail.tsx";
import ScanAppointments from "./pages/scan/Appointments.tsx";
import ScanActivity from "./pages/scan/Activity.tsx";
import ScanRegister from "./pages/scan/Register.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<Book />} />
            <Route path="/results" element={<Results />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/shop" element={<ProtectedRoute><ShopAdmin /></ProtectedRoute>} />
            <Route path="/dashboard/pharmacy" element={<ProtectedRoute><PharmacyAdmin /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/forms" element={<ProtectedRoute><TestForms /></ProtectedRoute>} />
            <Route path="/dashboard/forms/new" element={<ProtectedRoute><NewTestForm /></ProtectedRoute>} />
            <Route path="/dashboard/forms/:serial" element={<ProtectedRoute><ResultEntry /></ProtectedRoute>} />
            <Route path="/dashboard/results" element={<ProtectedRoute><ResultsSearch /></ProtectedRoute>} />
            <Route path="/dashboard/pending" element={<ProtectedRoute><Pending /></ProtectedRoute>} />
            <Route path="/dashboard/completed" element={<ProtectedRoute><CompletedResults /></ProtectedRoute>} />
            <Route path="/dashboard/manage-tests" element={<ProtectedRoute><ManageTests /></ProtectedRoute>} />
            <Route path="/dashboard/scientists" element={<ProtectedRoute><Scientists /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
            <Route path="/scan-dashboard" element={<ProtectedRoute><ScanOverview /></ProtectedRoute>} />
            <Route path="/scan-dashboard/patients" element={<ProtectedRoute><ScanPatients /></ProtectedRoute>} />
            <Route path="/scan-dashboard/patients/:id" element={<ProtectedRoute><ScanPatientDetail /></ProtectedRoute>} />
            <Route path="/scan-dashboard/scans" element={<ProtectedRoute><ScansList /></ProtectedRoute>} />
            <Route path="/scan-dashboard/scans/:id" element={<ProtectedRoute><ScanDetail /></ProtectedRoute>} />
            <Route path="/scan-dashboard/appointments" element={<ProtectedRoute><ScanAppointments /></ProtectedRoute>} />
            <Route path="/scan-dashboard/activity" element={<ProtectedRoute><ScanActivity /></ProtectedRoute>} />
            <Route path="/scan-dashboard/register" element={<ProtectedRoute><ScanRegister /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
