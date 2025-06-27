import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import Platform from "@/pages/Platform";
import DataEnvironment from "@/pages/DataEnvironment";
import ProcessBuilder from "@/pages/ProcessBuilder";
import AgenticEngine from "@/pages/AgenticEngine";
import ExpertMarketplace from "@/pages/ExpertMarketplace";
import ModelEvaluations from "@/pages/ModelEvaluations";
import WealthManagement from "@/pages/WealthManagement";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Temporarily disable auth for testing
  // if (!isAuthenticated) {
  //   return <Login />;
  // }

  // Special handling for Process Builder - full page layout with white background
  if (location === "/process-builder") {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}
        
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={closeMobileMenu} 
        />
        
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Main Content - No Header, No Padding */}
        <main className="flex-1 min-w-0">
          <ProcessBuilder />
        </main>
      </div>
    );
  }



  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
      />
      
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={toggleMobileMenu} />
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Switch>
            <Route path="/" component={Platform} />
            <Route path="/platform" component={Platform} />
            <Route path="/data-environment" component={DataEnvironment} />
            <Route path="/agentic-engine" component={AgenticEngine} />
            <Route path="/expert-marketplace" component={ExpertMarketplace} />
            <Route path="/model-evaluations" component={ModelEvaluations} />
            <Route path="/wealth-management" component={WealthManagement} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
