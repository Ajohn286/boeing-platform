import { Link, useLocation } from "wouter";
import { User, Database } from "lucide-react";
import { 
  PlatformIcon, 
  DataIcon, 
  ProcessIcon, 
  AgentIcon, 
  ExpertIcon, 
  ModelIcon,
  WealthIcon 
} from "@/components/icons/PlatformIcon";
import invisiblePlatformLogo from "@/assets/invisible-platform-logo.svg";

const navigationItems = [
  { path: "/platform", label: "Platform", icon: PlatformIcon },
  { path: "/wealth-management", label: "Wealth Manager", icon: WealthIcon, highlight: true },
  { path: "/data-environment", label: "Data Environment", icon: DataIcon },
  { path: "/process-builder", label: "Process Builder", icon: ProcessIcon },
  { path: "/agentic-engine", label: "Agentic Engine", icon: AgentIcon },
  { path: "/expert-marketplace", label: "Expert Marketplace", icon: ExpertIcon },
  { path: "/model-evaluations", label: "Model Evaluations", icon: ModelIcon },
];

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/platform" && (location === "/" || location === "/platform")) {
      return true;
    }
    return location === path;
  };

  return (
    <aside className="hidden lg:flex w-72 bg-sidebar text-sidebar-foreground flex-col">
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center">
            <img 
              src={invisiblePlatformLogo} 
              alt="Invisible Platform Logo" 
              className="h-8"
            />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 sidebar-scroll overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link href={item.path} className={`flex items-center px-3 py-2.5 rounded-lg nav-item-hover ${
                    isActive(item.path) 
                      ? 'active-nav' 
                      : 'text-gray-300'
                  } ${item.highlight ? 'relative' : ''}`}>
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                    {item.highlight && (
                      <span className="ml-auto px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                        NEW
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-gray-400 truncate">admin@invisible.ai</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
