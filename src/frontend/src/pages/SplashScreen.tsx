import { Leaf } from "lucide-react";
import { useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-6">
        <div className="logo-reveal flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center shadow-lg">
            <Leaf size={56} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              AgriShield
            </h1>
          </div>
        </div>
        <p className="tagline-reveal text-white/80 text-center text-lg font-medium px-8">
          Protect Your Crops, <br />
          Empower Your Farm
        </p>
      </div>
      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-white/40 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="text-white/50 text-xs">
          © {new Date().getFullYear()} AgriShield
        </p>
      </div>
    </div>
  );
}
