import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Target,
  BarChart3,
  Activity,
  Trash2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkipToContent } from "@/components/SkipToContent";
import { cn } from "@/lib/utils";
import { getSprintHistory, clearSprintHistory } from "@/utils/storage";
import { exportSprintHistory } from "@/utils/exportTeamData";

// Mock sprint history data for demo
const MOCK_SPRINT_HISTORY = [
  {
    id: "SPR-2024-01",
    name: "Q1 Performance Sprint",
    launchedAt: "2024-01-15T10:00:00.000Z",
    totalPoints: 42,
    ticketCount: 8,
    strategicFit: 87,
    capacityUtilization: 92,
    refinedCount: 5,
    velocity: 38,
  },
  {
    id: "SPR-2024-02",
    name: "Security Hardening",
    launchedAt: "2024-01-29T10:00:00.000Z",
    totalPoints: 35,
    ticketCount: 6,
    strategicFit: 95,
    capacityUtilization: 78,
    refinedCount: 4,
    velocity: 35,
  },
  {
    id: "SPR-2024-03",
    name: "UX Improvements",
    launchedAt: "2024-02-12T10:00:00.000Z",
    totalPoints: 28,
    ticketCount: 7,
    strategicFit: 72,
    capacityUtilization: 65,
    refinedCount: 3,
    velocity: 25,
  },
  {
    id: "SPR-2024-04",
    name: "API Optimization",
    launchedAt: "2024-02-26T10:00:00.000Z",
    totalPoints: 45,
    ticketCount: 9,
    strategicFit: 91,
    capacityUtilization: 98,
    refinedCount: 6,
    velocity: 42,
  },
];

function getTrendIcon(current, previous) {
  if (!previous) return null;
  if (current > previous)
    return <TrendingUp className="w-3 h-3 text-emerald-500" />;
  if (current < previous)
    return <TrendingDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-neutral-400" />;
}

// Helper to safely get sprint date
function getSprintDate(sprint) {
  if (!sprint) return new Date().toISOString();
  return sprint.launchedAt || sprint.date || new Date().toISOString();
}

// Helper to safely get ticket count
function getTicketCount(sprint) {
  if (!sprint) return 0;
  if (sprint.ticketCount) return sprint.ticketCount;
  if (sprint.selectedCandidates?.length)
    return sprint.selectedCandidates.length;
  return 0;
}

// Helper to safely get strategic fit
function getStrategicFit(sprint) {
  if (!sprint) return null;
  if (sprint.strategicFit) return sprint.strategicFit;
  if (sprint.summary?.strategicFit) return sprint.summary.strategicFit;
  return 75;
}

// Helper to safely get capacity utilization
function getCapacityUtilization(sprint) {
  if (!sprint) return null;
  if (sprint.capacityUtilization) return sprint.capacityUtilization;
  if (sprint.summary?.capacityUtilization)
    return sprint.summary.capacityUtilization;
  return 80;
}

// Helper to safely get total points
function getTotalPoints(sprint) {
  if (!sprint) return null;
  if (sprint.totalPoints) return sprint.totalPoints;
  if (sprint.summary?.totalPoints) return sprint.summary.totalPoints;
  return 30;
}

export function SprintHistoryPage() {
  const navigate = useNavigate();
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [historyVersion, setHistoryVersion] = useState(0);

  // Get history from localStorage or use mock data
  const sprintHistory = useMemo(() => {
    const saved = getSprintHistory();
    return saved.length > 0 ? saved : MOCK_SPRINT_HISTORY;
  }, [historyVersion]);

  // Calculate averages
  const averages = useMemo(() => {
    if (sprintHistory.length === 0) return null;

    const sum = sprintHistory.reduce(
      (acc, sprint) => ({
        points: acc.points + getTotalPoints(sprint),
        fit: acc.fit + getStrategicFit(sprint),
        util: acc.util + getCapacityUtilization(sprint),
        velocity:
          acc.velocity + (sprint.velocity || getTotalPoints(sprint) * 0.9),
      }),
      { points: 0, fit: 0, util: 0, velocity: 0 }
    );

    return {
      avgPoints: Math.round(sum.points / sprintHistory.length),
      avgFit: Math.round(sum.fit / sprintHistory.length),
      avgUtil: Math.round(sum.util / sprintHistory.length),
      avgVelocity: Math.round(sum.velocity / sprintHistory.length),
    };
  }, [sprintHistory]);

  const handleExport = () => {
    exportSprintHistory(sprintHistory);
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all sprint history and show demo data?")) {
      clearSprintHistory();
      setHistoryVersion((v) => v + 1);
    }
  };

  return (
    <div className="min-h-screen !bg-neutral-50">
      <SkipToContent />

      {/* Header */}
      <header className="!bg-white !border-neutral-200 border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/success")}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Logo size="md" className="rounded-lg" />
              <span className="font-semibold !text-neutral-900">Align</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-6xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold !text-neutral-900 mb-2">
              Sprint History
            </h1>
            <p className="!text-neutral-500">
              Review past sprints and compare performance metrics
            </p>
          </div>

          {/* Summary cards */}
          {averages && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="!bg-white !border-neutral-200 !text-neutral-900">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs !text-neutral-500 uppercase">
                        Avg Points/Sprint
                      </p>
                      <p className="text-2xl font-bold !text-neutral-900">
                        {averages.avgPoints}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 !text-primary-500/30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="!bg-white !border-neutral-200 !text-neutral-900">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs !text-neutral-500 uppercase">
                        Avg Strategic Fit
                      </p>
                      <p className="text-2xl font-bold !text-primary-600">
                        {averages.avgFit}%
                      </p>
                    </div>
                    <Target className="w-8 h-8 !text-primary-500/30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="!bg-white !border-neutral-200 !text-neutral-900">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs !text-neutral-500 uppercase">
                        Avg Velocity
                      </p>
                      <p className="text-2xl font-bold !text-emerald-600">
                        {averages.avgVelocity}
                      </p>
                    </div>
                    <Activity className="w-8 h-8 !text-emerald-500/30" />
                  </div>
                </CardContent>
              </Card>

              <Card className="!bg-white !border-neutral-200 !text-neutral-900">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs !text-neutral-500 uppercase">
                        Total Sprints
                      </p>
                      <p className="text-2xl font-bold !text-neutral-900">
                        {sprintHistory.length}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 !text-neutral-400/30" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sprint list */}
          <Card className="!bg-white !border-neutral-200 !text-neutral-900">
            <CardHeader>
              <CardTitle className="text-base !text-neutral-900">
                Sprint Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sprintHistory.length === 0 ? (
                <div className="text-center py-8 !text-neutral-500">
                  No sprint history available
                </div>
              ) : (
                <div className="space-y-3">
                  {sprintHistory.map((sprint, index) => {
                    const prevSprint = sprintHistory[index + 1];
                    const sprintDate = new Date(getSprintDate(sprint));
                    const totalPoints = getTotalPoints(sprint);
                    const strategicFit = getStrategicFit(sprint);
                    const capacityUtil = getCapacityUtilization(sprint);
                    const ticketCount = getTicketCount(sprint);
                    const velocity =
                      sprint.velocity || Math.round(totalPoints * 0.9);

                    return (
                      <motion.div
                        key={sprint.id}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          selectedSprint === sprint.id
                            ? "!bg-primary-50 !border-primary-200"
                            : "!bg-white !border-neutral-200 hover:!border-primary-200"
                        )}
                        onClick={() =>
                          setSelectedSprint(
                            selectedSprint === sprint.id ? null : sprint.id
                          )
                        }
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[50px]">
                              <p className="text-xs !text-neutral-500">
                                {sprintDate.toLocaleDateString("en-US", {
                                  month: "short",
                                })}
                              </p>
                              <p className="text-lg font-bold !text-neutral-900">
                                {sprintDate.getDate()}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium !text-neutral-900">
                                  {sprint.name || sprint.strategy || sprint.id}
                                </span>
                                <Badge className="!bg-primary-100 !text-primary-700 text-[10px]">
                                  {ticketCount} tickets
                                </Badge>
                              </div>
                              <p className="text-xs !text-neutral-500 mt-0.5">
                                {sprint.id}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-sm font-medium !text-neutral-900">
                                  {totalPoints} pts
                                </span>
                                {getTrendIcon(
                                  totalPoints,
                                  getTotalPoints(prevSprint)
                                )}
                              </div>
                              <p className="text-[10px] !text-neutral-500">
                                Planned
                              </p>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-sm font-medium !text-primary-600">
                                  {strategicFit}%
                                </span>
                                {getTrendIcon(
                                  strategicFit,
                                  getStrategicFit(prevSprint)
                                )}
                              </div>
                              <p className="text-[10px] !text-neutral-500">
                                Fit
                              </p>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-sm font-medium !text-emerald-600">
                                  {velocity}
                                </span>
                                {getTrendIcon(velocity, prevSprint?.velocity)}
                              </div>
                              <p className="text-[10px] !text-neutral-500">
                                Velocity
                              </p>
                            </div>

                            <div className="w-24">
                              <Progress value={capacityUtil} className="h-2" />
                              <p className="text-[10px] !text-neutral-500 text-right mt-0.5">
                                {capacityUtil}% capacity
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {selectedSprint === sprint.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="mt-4 pt-4 !border-neutral-200 border-t"
                          >
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="!text-neutral-500">AI Refined</p>
                                <p className="font-medium !text-neutral-900">
                                  {sprint.refinedCount ||
                                    sprint.refinedTickets ||
                                    0}{" "}
                                  tickets
                                </p>
                              </div>
                              <div>
                                <p className="!text-neutral-500">
                                  Completion Rate
                                </p>
                                <p className="font-medium !text-emerald-600">
                                  {Math.round((velocity / totalPoints) * 100)}%
                                </p>
                              </div>
                              <div>
                                <p className="!text-neutral-500">
                                  Points Delivered
                                </p>
                                <p className="font-medium !text-neutral-900">
                                  {velocity}/{totalPoints}
                                </p>
                              </div>
                              <div>
                                <p className="!text-neutral-500">Date</p>
                                <p className="font-medium !text-neutral-900">
                                  {sprintDate.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default SprintHistoryPage;
