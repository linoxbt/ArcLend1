import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/components/Web3Provider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import Positions from "./pages/Positions";
import HealthMonitor from "./pages/HealthMonitor";
import Swap from "./pages/Swap";
import Liquidity from "./pages/Liquidity";
import Faucet from "./pages/Faucet";
import DeployGuide from "./pages/DeployGuide";
import Docs from "./pages/Docs";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/health" element={<HealthMonitor />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/faucet" element={<Faucet />} />
          <Route path="/deploy" element={<DeployGuide />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/coming-soon/:feature" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
