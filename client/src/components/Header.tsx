import { useLocation } from "wouter";
import { Menu, Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, logout } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageContent = {
  '/': { title: 'Platform Overview', subtitle: 'Manage your data platform and infrastructure' },
  '/platform': { title: 'Platform Overview', subtitle: 'Manage your data platform and infrastructure' },
  '/data-environment': { title: 'Data Environment', subtitle: 'Configure and monitor your data sources' },
  '/process-builder': { title: 'Process Builder', subtitle: 'Design and orchestrate data workflows' },
  '/agentic-engine': { title: 'Agentic Engine', subtitle: 'Manage AI agents and automation' },
  '/expert-marketplace': { title: 'Expert Marketplace', subtitle: 'Connect with domain specialists' },
  '/model-evaluations': { title: 'Model Evaluations', subtitle: 'Assess AI model performance' },
  '/sensor-monitoring': { title: 'Sensor Monitoring', subtitle: 'Real-time aircraft sensor analysis with AI anomaly detection' },
  '/predictive-maintenance': { title: 'Predictive Maintenance', subtitle: 'AI-powered maintenance forecasting and optimization' },
  '/quality-inspection': { title: 'Quality Inspection', subtitle: 'Computer vision quality control and defect detection' },
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const currentPage = pageContent[location as keyof typeof pageContent] || pageContent['/'];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-border px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {currentPage.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentPage.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name || user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
