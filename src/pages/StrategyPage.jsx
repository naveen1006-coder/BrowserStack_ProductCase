import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Settings2,
  ChevronRight,
  Lightbulb,
  Zap,
  LogOut,
  Footprints,
  PercentDiamond,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkipToContent } from "@/components/SkipToContent";
import { TeamOverviewBar } from "@/components/TeamOverviewBar";
import { ResourceDrawer } from "@/components/ResourceDrawer";
import { GeneratingLoadingOverlay } from "@/components/GeneratingLoadingOverlay";
import { useSprint } from "@/context/SprintContext";
import { selectCandidates } from "@/utils/selectCandidates";
import { stringToSeed } from "@/utils/seededRandom";
import backlogData from "@/data/backlog.json";
import { TEAM_ROSTER, getTeamTotals } from "@/data/teamRoster";

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

export function StrategyPage() {
  const navigate = useNavigate();
  const {
    strategy,
    setStrategy,
    capacityPoints,
    setCapacityPoints,
    capacityMode,
    setCapacityMode,
    debtPercent,
    setDebtPercent,
    setCandidates,
    isGenerating,
    setIsGenerating,
    currentStep,
    setCurrentStep,
  } = useSprint();

  const [selectedDemo, setSelectedDemo] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const demoStrategies = backlogData.demoStrategies;

  // Calculate team totals for capacity sync
  const teamTotals = getTeamTotals(TEAM_ROSTER);

  // Handle demo strategy selection
  useEffect(() => {
    if (selectedDemo) {
      const demo = demoStrategies.find((d) => d.id === selectedDemo);
      if (demo) {
        setStrategy(demo.description);
      }
    }
  }, [selectedDemo, demoStrategies, setStrategy]);

  // Listen for demo-coffee keyboard shortcut
  useEffect(() => {
    let typedKeys = "";
    const handleKeyPress = (e) => {
      typedKeys += e.key;
      if (typedKeys.includes("demo-coffee")) {
        const coffeeDemo = demoStrategies.find((d) => d.id === "demo-coffee");
        if (coffeeDemo) {
          setSelectedDemo("demo-coffee");
          setStrategy(coffeeDemo.description);
        }
        typedKeys = "";
      }
      // Reset after 2 seconds of no typing
      setTimeout(() => {
        typedKeys = "";
      }, 2000);
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [demoStrategies, setStrategy]);

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

    // Navigate to workspace after generation completes
    navigate("/workspace");
  }, [
    strategy,
    capacityPoints,
    capacityMode,
    debtPercent,
    setCandidates,
    setCurrentStep,
    setIsGenerating,
    navigate,
  ]);

  const handleGenerate = () => {
    runGeneration();
  };

  const handleLogout = () => {
    navigate("/");
  };

  const canGenerate = strategy.trim().length > 10 && capacityPoints > 0;

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
      <header className="!bg-white !border-neutral-200 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="md" className="rounded-lg" />
            <span className="font-semibold text-neutral-900 text-sm sm:text-base">
              Align
            </span>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="cursor-pointer p-0 border-0 bg-transparent rounded transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 hover:text-neutral-400" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main
        id="main-content"
        className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Team Intelligence Bar */}
          <TeamOverviewBar
            roster={TEAM_ROSTER}
            onViewDetails={() => setIsDrawerOpen(true)}
            className="mb-4 sm:mb-6"
          />

          {/* Page title */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1.5 sm:mb-2">
              Define Your Sprint Strategy
            </h1>
            <p className="text-sm sm:text-base text-neutral-500">
              Describe your sprint goals and let AI suggest the best candidate
              tickets
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Strategy input - main column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Demo strategy selector */}
              <Card className="!bg-white !border-neutral-200 !text-neutral-900 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2 !text-neutral-900">
                    <div className="p-1 sm:p-1.5 rounded-lg bg-warning-50">
                      <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-warning-500" />
                    </div>
                    <span className="text-sm sm:text-base">
                      Quick Start with Demo Strategy
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <Select value={selectedDemo} onValueChange={setSelectedDemo}>
                    <SelectTrigger
                      aria-label="Select demo strategy"
                      className="!bg-white !border-neutral-300 !text-neutral-900 h-10 sm:h-11 text-sm sm:text-base hover:!border-primary-400 transition-colors"
                    >
                      <SelectValue placeholder="Choose a demo strategy..." />
                    </SelectTrigger>
                    <SelectContent className="!bg-white !border-neutral-200 !text-neutral-900 shadow-lg">
                      {demoStrategies.map((demo) => (
                        <SelectItem
                          key={demo.id}
                          value={demo.id}
                          className="!text-neutral-900 focus:!bg-primary-50 focus:!text-primary-700 text-sm sm:text-base"
                        >
                          {demo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Strategy text area */}
              <Card className="!bg-white !border-neutral-200 !text-neutral-900 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2 !text-neutral-900">
                    <div className="p-1 sm:p-1.5 rounded-lg bg-primary-50">
                      <PercentDiamond className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                    </div>
                    <span className="text-sm sm:text-base">
                      Sprint Strategy
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <Label htmlFor="strategy" className="sr-only">
                    Enter your sprint strategy
                  </Label>
                  <Textarea
                    id="strategy"
                    placeholder={
                      selectedDemo
                        ? "Describe your sprint goals, priorities, and any specific focus areas. For example: 'Fix Q3 retention issues by addressing critical bugs and improving user experience...'"
                        : "Please select a demo strategy first to enable editing"
                    }
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    disabled={true}
                    className="min-h-[120px] sm:min-h-[150px] text-sm sm:text-base !bg-white !border-neutral-300 !text-neutral-900 !placeholder:text-neutral-400 disabled:!bg-neutral-100 disabled:!cursor-not-allowed"
                    aria-describedby="strategy-hint"
                  />
                  {!selectedDemo && (
                    <p className="mt-2 sm:mt-3 text-xs !text-neutral-500 flex items-center gap-1.5">
                      <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-warning-500 flex-shrink-0" />
                      <span>
                        Select a demo strategy above to start customizing your
                        sprint plan
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Settings sidebar */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="!bg-white !border-neutral-200 !text-neutral-900 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2 !text-neutral-900">
                    <div className="p-1 sm:p-1.5 rounded-lg bg-neutral-100">
                      <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
                    </div>
                    <span className="text-sm sm:text-base">
                      Sprint Configuration
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
                  {/* Capacity points */}
                  <div>
                    <Label
                      htmlFor="capacity"
                      className="!text-neutral-700 font-medium mb-1.5 sm:mb-2 block text-sm sm:text-base"
                    >
                      Capacity Points
                    </Label>
                    <div className="mt-2 flex items-center gap-2 sm:gap-3">
                      <Input
                        id="capacity"
                        type="number"
                        min={1}
                        max={100}
                        value={capacityPoints}
                        onChange={(e) =>
                          setCapacityPoints(Number(e.target.value))
                        }
                        className="w-20 sm:w-24 !bg-white !border-neutral-300 !text-neutral-900 h-9 sm:h-10 text-sm sm:text-base focus:!border-primary-500 focus:!ring-2 focus:!ring-primary-100"
                        aria-label="Sprint capacity in story points"
                      />
                      <span className="text-xs sm:text-sm !text-neutral-500 font-medium">
                        story points
                      </span>
                    </div>
                    <p className="mt-1.5 sm:mt-2 text-xs !text-primary-600 font-medium">
                      Team net available: {teamTotals.totalNet} pts
                    </p>
                  </div>

                  {/* Capacity mode */}
                  <div>
                    <Label className="mb-2 sm:mb-3 block !text-neutral-700 font-medium text-sm sm:text-base">
                      Capacity Mode
                    </Label>
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-xs sm:text-sm !text-neutral-700 font-medium">
                        {capacityMode === "conservative"
                          ? "Conservative"
                          : "Aggressive"}
                      </span>
                      <Switch
                        checked={capacityMode === "aggressive"}
                        onCheckedChange={(checked) =>
                          setCapacityMode(
                            checked ? "aggressive" : "conservative"
                          )
                        }
                        aria-label="Toggle capacity mode"
                        className="!data-[state=unchecked]:!bg-neutral-200"
                      />
                    </div>
                    <p className="text-xs !text-neutral-500 leading-relaxed">
                      {capacityMode === "conservative"
                        ? "90% capacity buffer for unexpected work"
                        : "110% capacity for stretch goals"}
                    </p>
                  </div>

                  {/* Tech debt slider */}
                  <div>
                    <Label className="mb-3 sm:mb-4 block !text-neutral-700 font-medium text-sm sm:text-base">
                      Tech Debt Allocation:{" "}
                      <span className="!text-primary-600 font-semibold">
                        {debtPercent}%
                      </span>
                    </Label>
                    <div className="px-1">
                      <Slider
                        value={[debtPercent]}
                        onValueChange={([value]) => setDebtPercent(value)}
                        min={0}
                        max={30}
                        step={5}
                        aria-label="Tech debt percentage"
                        className="[&>span:first-child]:!h-2.5 [&>span:first-child]:!bg-neutral-200 [&>span:first-child]:!rounded-full [&>span:first-child>span]:!bg-primary-500 [&>span:first-child>span]:!rounded-full [&>span:last-child]:!h-6 [&>span:last-child]:!w-6   [&>span:last-child]:hover:!border-primary-600 [&>span:last-child]:hover:!scale-110 [&>span:last-child]:transition-all [&>span:last-child]:cursor-grab [&>span:last-child]:active:!cursor-grabbing [&>span:last-child]:active:!scale-105"
                      />
                    </div>
                    <div className="mt-2 sm:mt-3 flex justify-between text-xs !text-neutral-500 font-medium">
                      <span>0%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generate button */}
              <Button
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all disabled:shadow-none"
                onClick={handleGenerate}
                disabled={!canGenerate}
                aria-label="Generate sprint plan"
              >
                Generate Sprint Plan
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
              </Button>

              {!canGenerate && (
                <p className="text-xs text-center !text-neutral-500 flex items-center justify-center gap-1.5 px-2">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span>Enter a strategy (min 10 characters) to continue</span>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Resource Bifurcation Drawer */}
      <ResourceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        roster={TEAM_ROSTER}
        requiredByRole={{
          Frontend: 8,
          Backend: 10,
          QA: 4,
        }}
      />
    </div>
  );
}

export default StrategyPage;
