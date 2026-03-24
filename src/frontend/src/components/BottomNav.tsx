import { History, Home, ScanLine, User } from "lucide-react";
import type { AppPage } from "../types";

interface BottomNavProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const navItems = [
  { id: "home" as AppPage, icon: Home, label: "Home" },
  { id: "scan" as AppPage, icon: ScanLine, label: "Scan" },
  { id: "history" as AppPage, icon: History, label: "History" },
  { id: "profile" as AppPage, icon: User, label: "Profile" },
];

export default function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border"
      style={{ boxShadow: "0 -2px 12px rgba(46,125,50,0.08)" }}
    >
      <div className="max-w-sm mx-auto flex">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-ocid={`nav.${item.id}.link`}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon
                size={22}
                className={
                  isActive ? "stroke-primary" : "stroke-muted-foreground"
                }
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
