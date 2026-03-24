import { Button } from "@/components/ui/button";
import {
  Camera,
  FlipHorizontal,
  ImagePlus,
  Loader2,
  ScanLine,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useCamera } from "../camera/useCamera";
import { runMockAnalysis } from "../lib/mockAnalysis";
import type { AppPage, MockAnalysisResult } from "../types";

interface ScanPageProps {
  onResult: (result: MockAnalysisResult, imageUrl: string) => void;
  onNavigate: (page: AppPage) => void;
}

export default function ScanPage({ onResult }: ScanPageProps) {
  const [mode, setMode] = useState<"idle" | "camera" | "preview">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isActive,
    isLoading,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
    isSupported,
  } = useCamera({
    facingMode: "environment",
  });

  const handleOpenCamera = async () => {
    setMode("camera");
    await startCamera();
  };

  const handleCloseCamera = async () => {
    await stopCamera();
    setMode("idle");
  };

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMode("preview");
      await stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMode("preview");
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    await new Promise((res) => setTimeout(res, 1800));
    const result = runMockAnalysis();
    setAnalyzing(false);
    onResult(result, previewUrl ?? "");
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setMode("idle");
  };

  return (
    <div className="min-h-screen bg-secondary pb-24 page-enter">
      <div className="bg-primary px-5 pt-12 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <ScanLine size={20} className="text-white" />
          <h1 className="text-white text-xl font-bold">Scan Plant</h1>
        </div>
        <p className="text-white/70 text-sm">
          Capture or upload a photo to analyze
        </p>
      </div>

      <div className="px-4 mt-4">
        {mode === "idle" && (
          <>
            <div
              className="bg-white rounded-2xl shadow-card p-6 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border mb-5"
              style={{ minHeight: "220px" }}
              data-ocid="scan.dropzone"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <ImagePlus size={32} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  Upload Plant Photo
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or WEBP supported
                </p>
              </div>
              <Button
                data-ocid="scan.upload_button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="rounded-xl border-primary text-primary font-semibold px-6"
              >
                Choose from Gallery
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">
                or
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {isSupported !== false && (
              <Button
                data-ocid="scan.camera.button"
                onClick={handleOpenCamera}
                className="w-full h-14 rounded-2xl bg-primary text-white text-base font-semibold flex items-center gap-3 justify-center shadow-card"
              >
                <Camera size={22} />
                Take Photo with Camera
              </Button>
            )}
          </>
        )}

        {mode === "camera" && (
          <div
            className="bg-black rounded-2xl overflow-hidden shadow-card"
            data-ocid="scan.canvas_target"
          >
            <div className="relative" style={{ aspectRatio: "4/3" }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 size={32} className="text-white animate-spin" />
                </div>
              )}
              {error && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/80 p-4"
                  data-ocid="scan.error_state"
                >
                  <p className="text-white text-center text-sm">
                    {error.message}
                  </p>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white/60 rounded-2xl" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-900">
              <button
                type="button"
                data-ocid="scan.close.button"
                onClick={handleCloseCamera}
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={20} className="text-white" />
              </button>
              <button
                type="button"
                data-ocid="scan.capture.primary_button"
                onClick={handleCapture}
                disabled={!isActive || isLoading}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-full bg-primary" />
              </button>
              <button
                type="button"
                data-ocid="scan.switch.button"
                onClick={() => switchCamera()}
                disabled={isLoading}
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center"
              >
                <FlipHorizontal size={20} className="text-white" />
              </button>
            </div>
          </div>
        )}

        {mode === "preview" && previewUrl && (
          <>
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-card mb-4">
              <img
                src={previewUrl}
                alt="Plant to analyze"
                className="w-full object-cover"
                style={{ maxHeight: "280px" }}
              />
              <button
                type="button"
                data-ocid="scan.clear.button"
                onClick={handleClear}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm text-foreground font-medium">
                  Image ready for analysis
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                AI will detect diseases, pests, and health status
              </p>
            </div>

            <Button
              data-ocid="scan.analyze.primary_button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full h-14 rounded-2xl bg-primary text-white text-base font-semibold flex items-center gap-3 justify-center shadow-card"
            >
              {analyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Analyzing
                  Plant...
                </>
              ) : (
                <>
                  <ScanLine size={20} /> Analyze Plant
                </>
              )}
            </Button>
            {analyzing && (
              <div
                className="mt-3 bg-white rounded-xl p-3 shadow-card"
                data-ocid="scan.loading_state"
              >
                <p className="text-xs text-muted-foreground text-center">
                  🔬 Running AI disease detection...
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
