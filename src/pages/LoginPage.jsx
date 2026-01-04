import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Zap, Shapes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SkipToContent } from "@/components/SkipToContent";
import { ParticleAnimation } from "@/components/ParticleAnimation";
import { Logo } from "@/components/Logo";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Navigate to strategy page
    navigate("/strategy");
  };

  const handleDemoLogin = () => {
    setEmail("demo@browserstack.com");
    setPassword("demo123");
    setTimeout(() => navigate("/strategy"), 300);
  };

  return (
    <div className="min-h-screen flex">
      <SkipToContent />

      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <Logo size="lg" className="rounded-lg" />
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent tracking-tight">
                Align
              </h1>
            </div>
            <p className="text-neutral-600 text-sm font-medium">
              AI-Native Sprint Planning for BrowserStack
            </p>
          </div>

          <Card
            className="p-8 shadow-lg !bg-white !border-neutral-100 !text-neutral-900"
            id="main-content"
          >
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label
                  htmlFor="email"
                  className="!text-black font-semibold mb-2 block"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@browserstack.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-11 bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-primary-500 focus:ring-primary-100"
                    aria-label="Email address"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="!text-black font-semibold mb-2 block"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 z-10" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-11 bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-primary-500 focus:ring-primary-100"
                    aria-label="Password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-6 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
                disabled={isLoading}
                aria-label="Sign in to your account"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-200">
              <p className="text-sm text-neutral-600 text-center mb-4 font-medium">
                Quick demo access
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                aria-label="Sign in with demo account"
              >
                <Shapes className="w-4 h-4" />
                Demo Login
              </Button>
            </div>
          </Card>

          <p className="mt-6 text-center text-sm text-neutral-400">
            Prototype build • Mock mode enabled
          </p>
        </motion.div>
      </div>

      {/* Right side - Particle animation */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <ParticleAnimation seed={42} />

        {/* Overlay content */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            className="text-center text-white max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Sprint Planning, Aligned
            </h2>
            <p className="text-primary-200 text-lg">
              AI-powered candidate selection, smart ticket grooming, and
              strategic fit analysis—all in one place.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
