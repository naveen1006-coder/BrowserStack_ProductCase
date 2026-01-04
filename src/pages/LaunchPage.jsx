import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Rocket,
  Zap,
  AlertTriangle,
  Sparkles,
  Check,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SkipToContent } from "@/components/SkipToContent";
import { LaunchLoadingOverlay } from "@/components/LaunchLoadingOverlay";
import { useSprint } from "@/context/SprintContext";

export function LaunchPage() {
  const navigate = useNavigate();
  const {
    strategy,
    selectedCandidates,
    summary,
    refinedTickets,
    launchSprint,
  } = useSprint();

  const [aiConfirmed, setAiConfirmed] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [launchStage, setLaunchStage] = useState("preparing");

  // Redirect if no candidates
  useEffect(() => {
    if (!selectedCandidates || selectedCandidates.length === 0) {
      navigate("/workspace");
    }
  }, [selectedCandidates, navigate]);

  const hasWarnings = summary?.warnings && summary.warnings.length > 0;
  const refinedCount = Object.keys(refinedTickets).length;
  const canLaunch = !hasWarnings || aiConfirmed;

  const handleLaunch = async () => {
    setIsLaunching(true);
    setLaunchProgress(0);
    setLaunchStage("preparing");

    // Stage 1: Preparing (0-30%)
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLaunchProgress(30);
    setLaunchStage("syncing");

    // Stage 2: Syncing (30-70%)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLaunchProgress(70);
    setLaunchStage("launching");

    // Stage 3: Launching (70-100%)
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLaunchProgress(100);
    setLaunchStage("complete");

    // Brief delay to show completion
    await new Promise((resolve) => setTimeout(resolve, 400));

    launchSprint();
    navigate("/success");
  };

  if (!summary) return null;

  return (
    <div className="min-h-screen !bg-neutral-50">
      <SkipToContent />

      {/* Launch Loading Overlay */}
      <LaunchLoadingOverlay
        isVisible={isLaunching}
        progress={launchProgress}
        stage={launchStage}
      />

      {/* Header */}
      <header className="!bg-white !border-neutral-200 border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/workspace")}
              aria-label="Go back to workspace"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Logo size="md" className="rounded-lg" />
              <span className="font-semibold !text-neutral-900">Align</span>
            </div>
          </div>
          <span className="text-sm !text-neutral-500">Launch Sprint</span>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Page title */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 !bg-primary-100 rounded-full mb-4">
              <Rocket className="w-8 h-8 !text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold !text-neutral-900 mb-2">
              Ready to Launch
            </h1>
            <p className="!text-neutral-500">
              Review your sprint plan before launching
            </p>
          </div>

          {/* Summary card */}
          <Card className="mb-6 !bg-white !border-neutral-200 !text-neutral-900">
            <CardHeader>
              <CardTitle className="text-base !text-neutral-900">
                Sprint Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Strategy */}
              <div className="mb-4 p-3 !bg-neutral-50 rounded-lg !border-neutral-100 border">
                <p className="text-sm !text-neutral-500 mb-1">Strategy</p>
                <p className="!text-neutral-900 font-medium">{strategy}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 !bg-primary-50 rounded-lg !border-primary-100 border">
                  <p className="text-2xl font-bold !text-primary-600">
                    {selectedCandidates.length}
                  </p>
                  <p className="text-sm !text-neutral-600">Tickets</p>
                </div>
                <div className="text-center p-4 !bg-primary-50 rounded-lg !border-primary-100 border">
                  <p className="text-2xl font-bold !text-primary-600">
                    {summary.totalPoints}
                  </p>
                  <p className="text-sm !text-neutral-600">Story Points</p>
                </div>
                <div className="text-center p-4 !bg-primary-50 rounded-lg !border-primary-100 border">
                  <p className="text-2xl font-bold !text-primary-600">
                    {summary.strategicFit}%
                  </p>
                  <p className="text-sm !text-neutral-600">Strategic Fit</p>
                </div>
                <div className="text-center p-4 !bg-emerald-50 rounded-lg !border-emerald-100 border">
                  <p className="text-2xl font-bold !text-emerald-600">
                    {refinedCount}
                  </p>
                  <p className="text-sm !text-neutral-600">AI Refined</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets list */}
          <Card className="mb-6 !bg-white !border-neutral-200 !text-neutral-900">
            <CardHeader>
              <CardTitle className="text-base !text-neutral-900">
                Selected Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="!divide-neutral-100 divide-y">
                {selectedCandidates.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="py-4 px-2 flex items-center justify-between hover:!bg-neutral-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs !bg-neutral-100 !text-neutral-700 !border-neutral-200 border shrink-0"
                      >
                        {ticket.id}
                      </Badge>
                      <span className="!text-neutral-900 font-medium text-sm flex-1 min-w-0 truncate group-hover:!text-primary-600 transition-colors">
                        {ticket.title}
                      </span>
                      {refinedTickets[ticket.id] && (
                        <Badge className="!bg-emerald-50 !text-emerald-700 !border-emerald-200 border flex items-center gap-1.5 px-2.5 py-0.5 shrink-0 shadow-sm">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          <span className="text-xs font-medium">Refined</span>
                        </Badge>
                      )}
                    </div>
                    <div className="ml-4 shrink-0">
                      <span className="text-sm font-semibold !text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-md">
                        {ticket.storyPoints} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {hasWarnings && (
            <Card className="mb-6 !border-amber-200 !bg-amber-50 !text-neutral-900">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 !text-amber-600 shrink-0" />
                  <div>
                    <p className="font-medium !text-amber-800 mb-2">
                      AI Suggestions Require Confirmation
                    </p>
                    <ul className="text-sm !text-amber-700 space-y-1 list-disc list-inside mb-4">
                      {summary.warnings.map((warning, idx) => (
                        <li key={idx}>{warning.message}</li>
                      ))}
                    </ul>

                    <label
                      className="flex items-center gap-2 cursor-pointer"
                      htmlFor="ai-confirm"
                    >
                      <Checkbox
                        id="ai-confirm"
                        checked={aiConfirmed}
                        onCheckedChange={setAiConfirmed}
                        aria-label="Confirm AI suggestions"
                        className="!border-neutral-300 !bg-white hover:!border-neutral-400 focus:!border-neutral-400 data-[state=unchecked]:!border-neutral-300 data-[state=unchecked]:!bg-white data-[state=checked]:!border-amber-600 data-[state=checked]:!bg-amber-600 focus-visible:!ring-amber-500 focus-visible:!ring-offset-2 focus-visible:!ring-offset-white"
                      />
                      <span className="text-sm !text-amber-800">
                        I have reviewed the AI suggestions and accept the risks
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Launch button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-primary-500 hover:bg-primary-600"
              onClick={handleLaunch}
              disabled={!canLaunch || isLaunching}
              aria-label="Launch sprint"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Launch Sprint
            </Button>
          </div>

          {!canLaunch && (
            <p className="text-center text-sm !text-neutral-500 mt-3">
              Please confirm the AI warnings above to proceed
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default LaunchPage;
