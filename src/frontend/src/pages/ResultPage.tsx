import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  Leaf,
  Lightbulb,
  Loader2,
  Save,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_low_high_medium } from "../backend.d";
import { useAddScanRecord } from "../hooks/useQueries";
import type { AppPage, MockAnalysisResult } from "../types";

interface ResultPageProps {
  result: MockAnalysisResult;
  imageUrl: string;
  onNavigate: (page: AppPage) => void;
}

function SeverityBadge({ severity }: { severity: Variant_low_high_medium }) {
  if (severity === Variant_low_high_medium.high) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
        <XCircle size={14} /> High Risk
      </span>
    );
  }
  if (severity === Variant_low_high_medium.medium) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
        <AlertTriangle size={14} /> Medium Risk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
      <CheckCircle size={14} /> Low Risk
    </span>
  );
}

function severityBarColor(s: Variant_low_high_medium) {
  if (s === Variant_low_high_medium.high) return "bg-red-500";
  if (s === Variant_low_high_medium.medium) return "bg-yellow-500";
  return "bg-green-500";
}

function severityBarWidth(s: Variant_low_high_medium) {
  if (s === Variant_low_high_medium.high) return "90%";
  if (s === Variant_low_high_medium.medium) return "55%";
  return "25%";
}

export default function ResultPage({
  result,
  imageUrl,
  onNavigate,
}: ResultPageProps) {
  const { mutateAsync: addRecord, isPending } = useAddScanRecord();
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await addRecord({
        id: BigInt(Date.now()),
        scanDate: BigInt(Date.now()) * BigInt(1_000_000),
        diseaseDetected: result.diseaseName,
        plantName: result.plantName,
        treatmentRecommendation: result.treatment,
        imageRef: imageUrl,
        severity: result.severity,
        preventionTips: result.prevention,
      });
      setSaved(true);
      toast.success("Scan saved to history!");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  };

  const preventionTips = result.prevention.split(". ").filter(Boolean);

  return (
    <div className="min-h-screen bg-secondary pb-24 page-enter">
      <div className="bg-primary px-5 pt-12 pb-6">
        <button
          type="button"
          data-ocid="result.back.button"
          onClick={() => onNavigate("scan")}
          className="flex items-center gap-1 text-white/80 text-sm mb-3"
        >
          <ChevronLeft size={18} /> Back to Scan
        </button>
        <h1 className="text-white text-xl font-bold">Analysis Result</h1>
        <p className="text-white/70 text-sm">
          AI-powered plant health detection
        </p>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {imageUrl && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-card">
            <img
              src={imageUrl}
              alt="Scanned plant"
              className="w-full object-cover"
              style={{ maxHeight: "180px" }}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Detected Disease
              </p>
              <h2 className="text-xl font-bold text-foreground">
                {result.diseaseName}
              </h2>
            </div>
            <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Leaf size={22} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <SeverityBadge severity={result.severity} />
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Severity Level</span>
              <span className="font-medium capitalize">{result.severity}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${severityBarColor(result.severity)}`}
                style={{ width: severityBarWidth(result.severity) }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Stethoscope size={16} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-foreground">
              Recommended Treatment
            </h3>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {result.treatment}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Lightbulb size={16} className="text-amber-600" />
            </div>
            <h3 className="font-semibold text-foreground">Prevention Tips</h3>
          </div>
          <ul className="flex flex-col gap-2">
            {preventionTips.map((tip, i) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <span
                    className="text-primary font-bold"
                    style={{ fontSize: "10px" }}
                  >
                    {i + 1}
                  </span>
                </span>
                {tip.replace(/\.$/, "")}.
              </li>
            ))}
          </ul>
        </div>

        <Button
          data-ocid="result.save.primary_button"
          onClick={handleSave}
          disabled={isPending || saved}
          className="w-full h-14 rounded-2xl bg-primary text-white text-base font-semibold flex items-center gap-3 justify-center shadow-card"
        >
          {isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle size={20} /> Saved to History
            </>
          ) : (
            <>
              <Save size={20} /> Save to History
            </>
          )}
        </Button>

        <Button
          data-ocid="result.scan_again.secondary_button"
          onClick={() => onNavigate("scan")}
          variant="outline"
          className="w-full h-12 rounded-2xl border-primary text-primary font-semibold"
        >
          Scan Another Plant
        </Button>
      </div>
    </div>
  );
}
