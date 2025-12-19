"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

// Inner component that handles the form state
// using a key on this component (from the parent) ensures state is reset when mode changes
const AuthForm = ({ isLogin }: { isLogin: boolean }) => {
  const { login, signup, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // valid to use here if needed, but we rely on props
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const switchMode = (loginMode: boolean) => {
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', loginMode ? 'login' : 'signup');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        if (!sessionStorage.getItem("redirectAfterLogin")) {
          sessionStorage.setItem("redirectAfterLogin", "/profile");
        }
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await signup({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
        });
      }
    } catch {
      // Error is already handled in the hook with toast
    }
  };

  return (
    <div className="container-luxury">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border p-8 shadow-soft"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to access your account"
                : "Join GLOW for exclusive benefits"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-secondary rounded-xl p-1 mb-8">
            <button
              onClick={() => switchMode(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isLogin
                  ? "bg-card shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-card shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                    className="w-full pl-12 pr-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                    className="w-full pl-12 pr-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            {!isLogin && (
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full pl-12 pr-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
                className="w-full pl-12 pr-12 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full gap-2" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5 mt-30" />
                </>
              )}
            </Button>
          </form>

        </motion.div>
      </div>
    </div>
  );
};

const AuthPage = () => {
  const searchParams = useSearchParams();
  // Default to login (true) unless mode is explicitly 'signup'
  const isLogin = searchParams.get('mode') !== 'signup';

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-28 pb-16">
        <AuthForm key={isLogin ? 'login' : 'signup'} isLogin={isLogin} />
      </main>
    </div>
  );
};

export default AuthPage;
