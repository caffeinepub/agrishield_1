import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import BottomNav from "./components/BottomNav";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AuthPage from "./pages/AuthPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ResultPage from "./pages/ResultPage";
import ScanPage from "./pages/ScanPage";
import SplashScreen from "./pages/SplashScreen";
import type { AppPage, MockAnalysisResult } from "./types";

type AppState = "splash" | "auth" | "app";

export default function App() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [activePage, setActivePage] = useState<AppPage>("home");
  const [scanResult, setScanResult] = useState<MockAnalysisResult | null>(null);
  const [scanImageUrl, setScanImageUrl] = useState("");

  const { isLoginSuccess } = useInternetIdentity();

  const handleSplashComplete = useCallback(() => {
    setAppState("auth");
  }, []);

  const handleAuth = useCallback(() => {
    setAppState("app");
    setActivePage("home");
  }, []);

  const handleNavigate = useCallback((page: AppPage) => {
    setActivePage(page);
  }, []);

  const handleScanResult = useCallback(
    (result: MockAnalysisResult, imageUrl: string) => {
      setScanResult(result);
      setScanImageUrl(imageUrl);
      setActivePage("result");
    },
    [],
  );

  // If II login succeeds externally, transition to app
  if (isLoginSuccess && appState === "auth") {
    setAppState("app");
  }

  const showBottomNav = appState === "app" && activePage !== "result";

  return (
    <div className="max-w-sm mx-auto min-h-screen relative bg-secondary overflow-x-hidden">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {appState === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50"
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}

        {appState === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <AuthPage onAuth={handleAuth} />
          </motion.div>
        )}

        {appState === "app" && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {activePage === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <HomePage onNavigate={handleNavigate} />
                </motion.div>
              )}
              {activePage === "scan" && (
                <motion.div
                  key="scan"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <ScanPage
                    onResult={handleScanResult}
                    onNavigate={handleNavigate}
                  />
                </motion.div>
              )}
              {activePage === "result" && scanResult && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResultPage
                    result={scanResult}
                    imageUrl={scanImageUrl}
                    onNavigate={handleNavigate}
                  />
                </motion.div>
              )}
              {activePage === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <HistoryPage />
                </motion.div>
              )}
              {activePage === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProfilePage />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {showBottomNav && (
        <BottomNav activePage={activePage} onNavigate={handleNavigate} />
      )}
    </div>
  );
}
