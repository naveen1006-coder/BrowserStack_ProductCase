import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  RotateCcw,
  AlertTriangle,
  Archive,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkipToContent } from "@/components/SkipToContent";
import { DonutChart } from "@/components/DonutChart";
import { TicketCard } from "@/components/TicketCard";
import { StepList } from "@/components/StepList";
import { TicketModal } from "@/components/TicketModal";
import { GeneratingLoadingOverlay } from "@/components/GeneratingLoadingOverlay";
import { useSprint } from "@/context/SprintContext";
import { selectCandidates } from "@/utils/selectCandidates";
import { stringToSeed } from "@/utils/seededRandom";
import backlogData from "@/data/backlog.json";

const GENERATION_STEPS = [
  {
    id: "analyze",
    title: "Analyzing Strategy",
    description: "Understanding sprint goals...",
  },
  {
    id: "score",
    title: "Scoring Candidates",
    description: "Evaluating ticket alignment...",
  },
  {
    id: "select",
    title: "Selecting Best Fit",
    description: "Optimizing for capacity...",
  },
  {
    id: "validate",
    title: "Validating Dependencies",
    description: "Checking constraints...",
  },
  {
    id: "complete",
    title: "Plan Ready",
    description: "Sprint candidates selected!",
  },
];

export function WorkspacePage() {
  const navigate = useNavigate();
  const {
    strategy,
    capacityPoints,
    capacityMode,
    debtPercent,
    selectedCandidates,
    backupCandidates,
    summary,
    setCandidates,
    rejectCandidate,
    clearRefinedTickets,
    isGenerating,
    setIsGenerating,
    currentStep,
    setCurrentStep,
  } = useSprint();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [rejectingTicketId, setRejectingTicketId] = useState(null);

  // Redirect if no strategy
  useEffect(() => {
    if (!strategy) {
      navigate("/strategy");
    }
  }, [strategy, navigate]);

  // Run generation on mount if not already done
  useEffect(() => {
    if (strategy && selectedCandidates.length === 0 && !isGenerating) {
      runGeneration();
    }
  }, [strategy]); // eslint-disable-line react-hooks/exhaustive-deps

  const runGeneration = useCallback(async () => {
    setIsGenerating(true);
    setCurrentStep(0);

    // Simulate step-by-step generation with delays
    for (let i = 0; i < GENERATION_STEPS.length - 1; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(i + 1);
    }

    // Generate candidates using deterministic algorithm
    const seed = stringToSeed(strategy);
    const result = selectCandidates(
      strategy,
      backlogData.tickets,
      seed,
      capacityPoints,
      capacityMode,
      debtPercent
    );

    setCandidates(result.selected, result.backups, result.summary);
    setCurrentStep(GENERATION_STEPS.length);
    setIsGenerating(false);
  }, [
    strategy,
    capacityPoints,
    capacityMode,
    debtPercent,
    setCandidates,
    setCurrentStep,
    setIsGenerating,
  ]);

  const handleReject = (ticket) => {
    setRejectingTicketId(ticket.id);
    setTimeout(() => {
      rejectCandidate(ticket.id);
      setRejectingTicketId(null);
    }, 400);
  };

  const handleRegenerate = () => {
    setCandidates([], [], null);
    clearRefinedTickets();
    runGeneration();
  };

  const handleProceed = () => {
    navigate("/launch");
  };

  return (
    <div className="min-h-screen !bg-neutral-50">
      <SkipToContent />

      {/* Full-screen generating overlay */}
      <GeneratingLoadingOverlay
        isVisible={isGenerating}
        currentStep={currentStep}
        steps={GENERATION_STEPS}
      />

      {/* Header */}
      <header className="!bg-white !border-neutral-200 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/strategy")}
                aria-label="Go back to strategy"
                className="h-9 w-9 sm:h-10 sm:w-10"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Logo size="md" className="rounded-lg" />
                <span className="font-semibold !text-neutral-900 text-sm sm:text-base">
                  Align
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isGenerating}
                aria-label="Regenerate sprint plan"
                className="h-9 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Regenerate</span>
              </Button>
              <Button
                onClick={handleProceed}
                disabled={isGenerating || selectedCandidates.length === 0}
                aria-label="Proceed to launch"
                className="h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4 flex-1 sm:flex-initial"
              >
                <span className="hidden sm:inline">Proceed to Launch</span>
                <span className="sm:hidden">Launch</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8"
      >
        {/* Generation in progress */}
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8 sm:py-16"
            >
              <Card className="w-full max-w-md p-4 sm:p-6 !bg-white !border-neutral-200 !text-neutral-900">
                <h2 className="text-base sm:text-lg font-semibold !text-neutral-900 mb-4 sm:mb-6 text-center">
                  Generating Sprint Plan
                </h2>
                <StepList
                  steps={GENERATION_STEPS}
                  currentStep={currentStep}
                  isScanning={true}
                />
              </Card>
            </motion.div>
          )}

          {/* Results view */}
          {!isGenerating && summary && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Left sidebar - Strategic Fit */}
                <div className="lg:col-span-1">
                  <Card className="lg:sticky lg:top-24 !bg-white !border-neutral-200 !text-neutral-900">
                    <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                      <CardTitle className="text-sm sm:text-base !text-neutral-900">
                        Strategic Fit
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center px-4 sm:px-6 pb-4 sm:pb-6">
                      <DonutChart
                        value={summary.strategicFit}
                        label="Alignment"
                      />

                      <div className="mt-4 sm:mt-6 w-full space-y-2.5 sm:space-y-3">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="!text-neutral-500">
                            Total Points
                          </span>
                          <span className="font-medium !text-neutral-900">
                            {summary.totalPoints}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="!text-neutral-500">
                            Feature Points
                          </span>
                          <span className="font-medium !text-neutral-900">
                            {summary.featurePoints}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="!text-neutral-500">Tech Debt</span>
                          <span className="font-medium !text-neutral-900">
                            {summary.techDebtPoints}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="!text-neutral-500">
                            Capacity Used
                          </span>
                          <span className="font-medium !text-neutral-900">
                            {summary.capacityUtilization}%
                          </span>
                        </div>
                      </div>

                      {/* Warnings */}
                      {summary.warnings && summary.warnings.length > 0 && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 !border-neutral-200 border-t w-full">
                          {summary.warnings.map((warning, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm !text-warning-600"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
                              <span>{warning.message}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right content - Candidates list */}
                <div className="lg:col-span-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold !text-neutral-900">
                        Proposed Sprint Candidates
                      </h2>
                      <p className="text-xs sm:text-sm !text-neutral-500 mt-0.5">
                        {selectedCandidates.length} tickets selected • Click to
                        review and refine
                      </p>
                    </div>
                    {backupCandidates.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="!bg-primary-50 !text-primary-700 !border-primary-200 border px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 font-medium shadow-sm text-xs sm:text-sm self-start sm:self-auto"
                      >
                        <Archive className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>
                          {backupCandidates.length} backup
                          {backupCandidates.length !== 1 ? "s" : ""} available
                        </span>
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2.5 sm:space-y-3">
                    {selectedCandidates.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onClick={setSelectedTicket}
                        onReject={handleReject}
                        isRejecting={rejectingTicketId === ticket.id}
                      />
                    ))}
                  </div>

                  {selectedCandidates.length === 0 && (
                    <Card className="p-6 sm:p-8 text-center !bg-white !border-neutral-200 !text-neutral-900">
                      <p className="text-sm sm:text-base !text-neutral-500">
                        No candidates match your criteria. Try adjusting your
                        strategy or capacity settings.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 text-sm sm:text-base"
                        onClick={() => navigate("/strategy")}
                      >
                        Adjust Strategy
                      </Button>
                    </Card>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Ticket Modal */}
      <TicketModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}

export default WorkspacePage;
