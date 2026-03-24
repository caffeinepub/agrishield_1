import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  History,
  Leaf,
  XCircle,
} from "lucide-react";
import { Variant_low_high_medium } from "../backend.d";
import { useGetScanHistory } from "../hooks/useQueries";

const sampleHistory = [
  {
    id: 1,
    plantName: "Tomato",
    diseaseDetected: "Late Blight",
    severity: Variant_low_high_medium.high,
    date: "Mar 20, 2026",
  },
  {
    id: 2,
    plantName: "Wheat",
    diseaseDetected: "Leaf Rust",
    severity: Variant_low_high_medium.medium,
    date: "Mar 18, 2026",
  },
  {
    id: 3,
    plantName: "Corn",
    diseaseDetected: "Healthy",
    severity: Variant_low_high_medium.low,
    date: "Mar 15, 2026",
  },
  {
    id: 4,
    plantName: "Potato",
    diseaseDetected: "Early Blight",
    severity: Variant_low_high_medium.medium,
    date: "Mar 10, 2026",
  },
  {
    id: 5,
    plantName: "Rice",
    diseaseDetected: "Bacterial Spot",
    severity: Variant_low_high_medium.low,
    date: "Mar 5, 2026",
  },
];

function SeverityIcon({ severity }: { severity: Variant_low_high_medium }) {
  if (severity === Variant_low_high_medium.high)
    return <XCircle size={14} className="text-red-600" />;
  if (severity === Variant_low_high_medium.medium)
    return <AlertTriangle size={14} className="text-yellow-600" />;
  return <CheckCircle size={14} className="text-green-600" />;
}

function SeverityBadge({ severity }: { severity: Variant_low_high_medium }) {
  const classes = {
    [Variant_low_high_medium.high]: "bg-red-100 text-red-700",
    [Variant_low_high_medium.medium]: "bg-yellow-100 text-yellow-700",
    [Variant_low_high_medium.low]: "bg-green-100 text-green-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${classes[severity]}`}
    >
      <SeverityIcon severity={severity} />
      {severity}
    </span>
  );
}

export default function HistoryPage() {
  const { data: history, isLoading } = useGetScanHistory();

  const items =
    history && history.length > 0
      ? history.map((r) => ({
          id: Number(r.id),
          plantName: r.plantName,
          diseaseDetected: r.diseaseDetected,
          severity: r.severity,
          date: new Date(Number(r.scanDate) / 1_000_000).toLocaleDateString(
            "en",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          ),
        }))
      : sampleHistory;

  return (
    <div className="min-h-screen bg-secondary pb-24 page-enter">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <History size={20} className="text-white" />
          <h1 className="text-white text-xl font-bold">Scan History</h1>
        </div>
        <p className="text-white/70 text-sm">{items.length} records found</p>
      </div>

      <div className="px-4 mt-4">
        {isLoading ? (
          <div
            className="flex flex-col gap-3"
            data-ocid="history.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-8 shadow-card flex flex-col items-center gap-3"
            data-ocid="history.empty_state"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
              <Leaf size={28} className="text-primary" />
            </div>
            <p className="font-semibold text-foreground">No scans yet</p>
            <p className="text-sm text-muted-foreground text-center">
              Start scanning your plants to see history here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3" data-ocid="history.list">
            {items.map((item, idx) => (
              <div
                key={item.id}
                data-ocid={`history.item.${idx + 1}`}
                className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Leaf size={22} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground truncate">
                      {item.plantName}
                    </p>
                    <SeverityBadge severity={item.severity} />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.diseaseDetected}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Calendar size={11} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
