import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Download,
  RotateCcw,
  TrendingUp,
  Zap,
  Target,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Users,
  Activity,
  Home,
  ArrowLeft,
  History,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SkipToContent } from "@/components/SkipToContent";
import { ActivityConsole } from "@/components/ActivityConsole";
import { BurndownChart } from "@/components/BurndownChart";
import { SprintDataGrid } from "@/components/SprintDataGrid";
import { TicketModal } from "@/components/TicketModal";
import { useSprint } from "@/context/SprintContext";
import { exportSprintCandidates } from "@/utils/exportCsv";
import { createSeededRandom } from "@/utils/seededRandom";

// Mock team members for assignees
const TEAM_MEMBERS = [
  { id: 1, name: "Sarah", role: "FE", initials: "SK", color: "#6366f1" },
  { id: 2, name: "Marcus", role: "BE", initials: "MJ", color: "#22c55e" },
  { id: 3, name: "Priya", role: "QA", initials: "PR", color: "#f59e0b" },
  { id: 4, name: "Alex", role: "FE", initials: "AK", color: "#ec4899" },
  { id: 5, name: "Jordan", role: "BE", initials: "JT", color: "#14b8a6" },
];

// Generate initial activity logs
const generateInitialLogs = (tickets) => {
  const now = new Date();
  const logs = [
    {
      id: 1,
      timestamp: formatTime(new Date(now - 180000)),
      actor: "SYSTEM",
      action: "SPRINT_INIT",
      details: `Sprint initialized with ${tickets.length} tickets.`,
      type: "info",
    },
    {
      id: 2,
      timestamp: formatTime(new Date(now - 120000)),
      actor: "SYSTEM",
      action: "SCAN_COMPLETE",
      details: "Indexing 452 backlog items completed.",
      type: "success",
    },
    {
      id: 3,
      timestamp: formatTime(new Date(now - 90000)),
      actor: "AI_AGENT",
      action: "ANALYSIS_START",
      details: "Beginning strategic alignment analysis...",
      type: "info",
    },
    {
      id: 4,
      timestamp: formatTime(new Date(now - 60000)),
      actor: "AI_AGENT",
      action: "CANDIDATE_SELECT",
      details: `Selected ${tickets.length} candidates based on strategy match.`,
      type: "success",
    },
  ];

  // Add refinement logs for refined tickets
  tickets.forEach((ticket, index) => {
    if (ticket.isRefined) {
      logs.push({
        id: 10 + index,
        timestamp: formatTime(new Date(now - 45000 + index * 5000)),
        actor: "AI_AGENT",
        action: "TICKET_UPDATE",
        details: `Refined ${ticket.id} description (+${
          15 + Math.floor(Math.random() * 40)
        } words).`,
        type: "info",
      });
    }
  });

  logs.push({
    id: 100,
    timestamp: formatTime(new Date(now - 10000)),
    actor: "USER_MJ",
    action: "APPROVAL",
    details: `Sprint scope finalized at ${tickets.reduce(
      (sum, t) => sum + t.storyPoints,
      0
    )} Points.`,
    type: "success",
  });

  logs.push({
    id: 101,
    timestamp: formatTime(now),
    actor: "SYSTEM",
    action: "SPRINT_ACTIVE",
    details: "Sprint launched successfully. Tracker activated.",
    type: "success",
  });

  return logs;
};

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Enhance tickets with status, assignee, etc.
function enhanceTickets(tickets, refinedTickets) {
  const random = createSeededRandom(42);
  const statuses = ["todo", "todo", "todo", "in_progress", "review"];

  return tickets.map((ticket, index) => {
    const assignee = TEAM_MEMBERS[Math.floor(random() * TEAM_MEMBERS.length)];
    const status =
      index < 2
        ? "in_progress"
        : statuses[Math.floor(random() * statuses.length)];

    // Generate linked issues
    const linkedIssues = [];
    if (random() > 0.7 && ticket.dependencies?.length > 0) {
      linkedIssues.push({ type: "blocked", id: ticket.dependencies[0] });
    }
    if (random() > 0.8) {
      linkedIssues.push({
        type: "depends",
        id: `ALIGN-${100 + Math.floor(random() * 50)}`,
      });
    }

    return {
      ...ticket,
      status,
      assignee,
      confidence: Math.round((ticket.confidence || 0.75) * 100),
      linkedIssues,
      isRefined: !!refinedTickets[ticket.id],
      updatedAt: new Date().toISOString(),
    };
  });
}

export function SuccessPage() {
  const navigate = useNavigate();
  const { selectedCandidates, summary, refinedTickets, resetSprint } =
    useSprint();

  const [tickets, setTickets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Sprint metrics
  const [sprintData, setSprintData] = useState({
    daysRemaining: 12,
    completed: 0,
    total: 0,
    velocity: 0,
  });

  // Burndown data (mock)
  const [burndownData, setBurndownData] = useState({
    ideal: [40, 36, 32, 28, 24, 20, 16, 12, 8, 4, 0],
    actual: [40, 38, 35, 32, 30],
  });

  // Initialize enhanced tickets and logs
  useEffect(() => {
    if (selectedCandidates && selectedCandidates.length > 0) {
      const enhanced = enhanceTickets(selectedCandidates, refinedTickets);
      setTickets(enhanced);
      setLogs(generateInitialLogs(enhanced));

      const completed = enhanced.filter((t) => t.status === "done").length;
      setSprintData({
        daysRemaining: 12,
        completed,
        total: enhanced.length,
        velocity: summary?.totalPoints || 0,
      });
    } else {
      navigate("/strategy");
    }
  }, [selectedCandidates, refinedTickets, summary, navigate]);

  // Add log entry
  const addLog = useCallback((logEntry) => {
    setLogs((prev) => [
      ...prev,
      {
        ...logEntry,
        id: Date.now(),
        timestamp: formatTime(new Date()),
      },
    ]);
  }, []);

  // Handle status change
  const handleStatusChange = useCallback(
    (ticketId, newStatus) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );

      // Update completed count
      setSprintData((prev) => {
        const updated = tickets.map((t) =>
          t.id === ticketId ? { ...t, status: newStatus } : t
        );
        const completed = updated.filter((t) => t.status === "done").length;
        return { ...prev, completed };
      });
    },
    [tickets]
  );

  const handleExportCsv = () => {
    if (tickets && summary) {
      exportSprintCandidates(tickets, summary);
      addLog({
        actor: "USER_MJ",
        action: "EXPORT",
        details: "Sprint data exported to CSV.",
        type: "info",
      });
    }
  };

  const handleStartNew = () => {
    resetSprint();
    navigate("/strategy");
  };

  const handleGoHome = () => {
    navigate("/strategy");
  };

  const handleClearLogs = useCallback(() => {
    setLogs([]);
    // Add a single log entry indicating logs were cleared
    setLogs([
      {
        id: Date.now(),
        timestamp: formatTime(new Date()),
        actor: "USER_MJ",
        action: "LOGS_CLEARED",
        details: "Activity logs cleared by user.",
        type: "info",
      },
    ]);
  }, []);

  // Handle assignee change
  const handleAssigneeChange = useCallback((ticketId, newAssignee) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assignee: newAssignee } : t))
    );
  }, []);

  // Handle reorder
  const handleReorder = useCallback((newOrder) => {
    setTickets(newOrder);
  }, []);

  // Navigate to history
  const handleViewHistory = () => {
    navigate("/history");
  };

  // Calculate improvement
  const predictedImprovement = summary
    ? Math.min(
        95,
        Math.round(
          summary.strategicFit * 0.5 +
            Object.keys(refinedTickets).length * 2 +
            5
        )
      )
    : 0;

  const completionPercent =
    sprintData.total > 0
      ? Math.round((sprintData.completed / sprintData.total) * 100)
      : 0;

  if (!summary) return null;

  return (
    <div className="min-h-screen !bg-neutral-50 pb-[220px]">
      <SkipToContent />

      {/* Header */}
      <header className="!bg-white !border-neutral-200 border-b shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleGoHome}
              aria-label="Go to home page"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Logo size="md" className="rounded-lg" />
            <span className="font-semibold !text-neutral-900">Align</span>
            <span className="!text-neutral-300">|</span>
            <span className="!text-neutral-500 text-sm">
              Active Sprint Board
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewHistory}
              aria-label="View sprint history"
            >
              <History className="w-4 h-4 mr-1" />
              History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoHome}
              aria-label="Go to home page"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            {/* <Button size="sm" onClick={handleStartNew}>
              <RotateCcw className="w-4 h-4 mr-1" />
              New Sprint
            </Button> */}
          </div>
        </div>
      </header>

      {/* Sprint Progress Bar - The Tracker */}
      <div className="!bg-white !border-neutral-200 border-b">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Sprint info */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 !text-primary-500" />
                <span className="text-xs font-medium !text-neutral-700">
                  Sprint Progress
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 !text-neutral-400" />
                  <span className="text-xs !text-neutral-500">
                    <span className="!text-neutral-800 font-medium">
                      {sprintData.daysRemaining}
                    </span>{" "}
                    Days Left
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 !text-success-500" />
                  <span className="text-xs !text-neutral-500">
                    <span className="!text-neutral-800 font-medium">
                      {sprintData.completed}/{sprintData.total}
                    </span>{" "}
                    Issues
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3 h-3 !text-neutral-400" />
                  <span className="text-xs !text-neutral-500">
                    <span className="!text-neutral-800 font-medium">
                      {sprintData.velocity}
                    </span>{" "}
                    Points
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Progress bar */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-2">
                <Progress
                  value={completionPercent}
                  className="h-2 !bg-neutral-200 flex-1"
                />
                <span className="text-xs font-mono !text-neutral-600 w-10">
                  {completionPercent}%
                </span>
              </div>
            </div>

            {/* Right: Burndown mini-chart */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] !text-neutral-400 uppercase tracking-wide">
                  Burndown
                </p>
              </div>
              <BurndownChart
                idealData={burndownData.ideal}
                actualData={burndownData.actual}
                width={100}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main id="main-content" className="max-w-[1600px] mx-auto px-4 py-4">
        {/* Top stats row - Dense */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <Card className="!bg-white !border-neutral-200 shadow-sm !text-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] !text-neutral-400 uppercase tracking-wider">
                    Improvement
                  </p>
                  <p className="text-xl font-bold !text-success-600">
                    +{predictedImprovement}%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full !bg-success-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 !text-success-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="!bg-white !border-neutral-200 shadow-sm !text-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] !text-neutral-400 uppercase tracking-wider">
                    Strategic Fit
                  </p>
                  <p className="text-xl font-bold !text-primary-600">
                    {summary.strategicFit}%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full !bg-primary-50 flex items-center justify-center">
                  <Target className="w-5 h-5 !text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="!bg-white !border-neutral-200 shadow-sm !text-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] !text-neutral-400 uppercase tracking-wider">
                    AI Refined
                  </p>
                  <p className="text-xl font-bold !text-purple-600">
                    {Object.keys(refinedTickets).length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full !bg-purple-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 !text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="!bg-white !border-neutral-200 shadow-sm !text-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] !text-neutral-400 uppercase tracking-wider">
                    Capacity
                  </p>
                  <p className="text-xl font-bold !text-neutral-800">
                    {summary.capacityUtilization}%
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full !bg-neutral-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 !text-neutral-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="!bg-white !border-neutral-200 shadow-sm !text-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] !text-neutral-400 uppercase tracking-wider">
                    Team
                  </p>
                  <div className="flex -space-x-2 mt-1">
                    {TEAM_MEMBERS.slice(0, 4).map((member) => (
                      <div
                        key={member.id}
                        className="w-6 h-6 rounded-full border-2 !border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: member.color }}
                        title={`${member.name} (${member.role})`}
                      >
                        {member.initials}
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 !border-white !bg-neutral-200 flex items-center justify-center text-[9px] !text-neutral-500 shadow-sm">
                      +1
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full !bg-neutral-100 flex items-center justify-center">
                  <Users className="w-5 h-5 !text-neutral-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold !text-neutral-800">
              Sprint Backlog
            </h2>
            <div className="flex items-center gap-2">
              <Badge className="!bg-neutral-100 !text-neutral-600 text-[10px]">
                {tickets.filter((t) => t.status === "todo").length} To Do
              </Badge>
              <Badge className="!bg-primary-50 !text-primary-600 text-[10px]">
                {tickets.filter((t) => t.status === "in_progress").length} In
                Progress
              </Badge>
              <Badge className="!bg-purple-50 !text-purple-600 text-[10px]">
                {tickets.filter((t) => t.status === "review").length} Review
              </Badge>
              <Badge className="!bg-success-50 !text-success-600 text-[10px]">
                {tickets.filter((t) => t.status === "done").length} Done
              </Badge>
            </div>
          </div>

          <SprintDataGrid
            tickets={tickets}
            onTicketClick={setSelectedTicket}
            onStatusChange={handleStatusChange}
            onAssigneeChange={handleAssigneeChange}
            onReorder={handleReorder}
            onLog={addLog}
          />
        </div>

        {/* Warnings panel */}
        {summary.warnings && summary.warnings.length > 0 && (
          <Card className="!bg-warning-50 !border-warning-200 mb-4 !text-neutral-900">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 !text-warning-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium !text-warning-700">
                    Active Warnings
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {summary.warnings.map((warning, idx) => (
                      <li key={idx} className="text-xs !text-warning-600">
                        • {warning.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Activity Console - Fixed at bottom */}
      <ActivityConsole logs={logs} onClearLogs={handleClearLogs} />

      {/* Ticket Modal */}
      <TicketModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}

export default SuccessPage;
