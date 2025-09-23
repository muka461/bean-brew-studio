import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CoffeePage from "./pages/CoffeePage";
import EquipmentPage from "./pages/EquipmentPage";
import CartPage from "./pages/CartPage";
import EventsPage from "./pages/EventsPage";
import OffersPage from "./pages/OffersPage";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/coffee" element={<CoffeePage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
