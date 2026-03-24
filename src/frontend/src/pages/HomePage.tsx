import {
  Activity,
  Bell,
  ChevronRight,
  Leaf,
  ScanLine,
  TrendingUp,
} from "lucide-react";
import { Variant_low_high_medium } from "../backend.d";
import { useGetScanHistory, useGetUserProfile } from "../hooks/useQueries";
import type { AppPage } from "../types";

interface HomePageProps {
  onNavigate: (page: AppPage) => void;
}

const sampleRecentActivity = [
  {
    plant: "Tomato",
    disease: "Late Blight",
    severity: Variant_low_high_medium.high,
    date: "Mar 20",
  },
  {
    plant: "Wheat",
    disease: "Leaf Rust",
    severity: Variant_low_high_medium.medium,
    date: "Mar 18",
  },
];

const weekBars = [60, 45, 75, 55, 80, 70, 78];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function severityColor(s: Variant_low_high_medium) {
  if (s === Variant_low_high_medium.high) return "bg-red-100 text-red-700";
  if (s === Variant_low_high_medium.medium)
    return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: history } = useGetScanHistory();
  const { data: profile } = useGetUserProfile();

  const totalScans =
    profile?.totalScanCount !== undefined
      ? Number(profile.totalScanCount)
      : (history?.length ?? sampleRecentActivity.length);

  const recentItems =
    history && history.length > 0
      ? history
          .slice(-2)
          .reverse()
          .map((r) => ({
            plant: r.plantName,
            disease: r.diseaseDetected,
            severity: r.severity,
            date: new Date(Number(r.scanDate) / 1_000_000).toLocaleDateString(
              "en",
              {
                month: "short",
                day: "numeric",
              },
            ),
          }))
      : sampleRecentActivity;

  const farmerName = profile?.name || "Farmer";

  return (
    <div className="min-h-screen bg-secondary pb-24 page-enter">
      <div className="bg-primary px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">AgriShield</span>
          </div>
          <button
            type="button"
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
            data-ocid="home.notification.button"
          >
            <Bell size={18} className="text-white" />
          </button>
        </div>
        <h2 className="text-white/70 text-sm font-medium">Welcome back,</h2>
        <h1 className="text-white text-2xl font-bold">
          Hello, {farmerName}! 👋
        </h1>
        <p className="text-white/60 text-xs mt-1">
          Keep your crops healthy today
        </p>
      </div>

      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center mb-3">
              <ScanLine size={18} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalScans}</p>
            <p className="text-xs text-muted-foreground font-medium">
              Total Scans
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center mb-3">
              <Activity size={18} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">78%</p>
            <p className="text-xs text-muted-foreground font-medium">
              Health Score
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card mb-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">
              This Week's Trend
            </span>
          </div>
          <div className="flex gap-1 h-10 items-end">
            {weekBars.map((h, i) => (
              <div
                key={weekDays[i]}
                className="flex-1 rounded-sm bg-primary/20"
                style={{
                  height: `${h}%`,
                  opacity: i === 6 ? 1 : 0.6 + i * 0.05,
                }}
              >
                <div
                  className="w-full h-full rounded-sm bg-primary"
                  style={{ opacity: 0.5 + i * 0.07 }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Mon — Sun (health %)
          </p>
        </div>

        <button
          type="button"
          data-ocid="home.scan.primary_button"
          onClick={() => onNavigate("scan")}
          className="w-full bg-primary text-white rounded-2xl p-5 flex items-center justify-between shadow-card mb-5 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <ScanLine size={24} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-base">Scan a Plant</p>
              <p className="text-white/70 text-xs">Detect disease instantly</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/70" />
        </button>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Recent Scans</h3>
            <button
              type="button"
              data-ocid="home.history.link"
              onClick={() => onNavigate("history")}
              className="text-xs text-primary font-medium"
            >
              View All
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {recentItems.map((item, i) => (
              <div
                key={`${item.plant}-${item.date}`}
                data-ocid={`home.recent.item.${i + 1}`}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Leaf size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.plant}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.disease}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColor(item.severity)}`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
