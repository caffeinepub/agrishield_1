import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Leaf, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AuthPageProps {
  onAuth: () => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useInternetIdentity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login();
      onAuth();
    } catch {
      toast.error("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col page-enter">
      <div className="bg-primary pt-12 pb-16 px-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
          <Leaf size={36} className="text-white" strokeWidth={1.8} />
        </div>
        <h1 className="text-2xl font-bold text-white">AgriShield</h1>
        <p className="text-white/70 text-sm mt-1">
          Smart Plant Disease Detection
        </p>
      </div>

      <div className="flex-1 px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div
            className="flex bg-secondary rounded-xl p-1 mb-6"
            data-ocid="auth.tab"
          >
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              data-ocid="auth.login.tab"
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                isLogin
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              data-ocid="auth.signup.tab"
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isLogin
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="name"
                    data-ocid="auth.name.input"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 rounded-xl border-border h-12"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="email"
                  data-ocid="auth.email.input"
                  type="email"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 rounded-xl border-border h-12"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="password"
                  data-ocid="auth.password.input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 rounded-xl border-border h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              data-ocid="auth.submit.button"
              disabled={isLoggingIn}
              className="w-full rounded-xl bg-primary text-white text-base font-semibold mt-2 hover:bg-primary/90 transition-colors"
              style={{ height: "3.25rem" }}
            >
              {isLoggingIn
                ? "Connecting..."
                : isLogin
                  ? "Login"
                  : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Secured by Internet Identity — no passwords stored
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin((v) => !v)}
            className="text-primary font-semibold"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
