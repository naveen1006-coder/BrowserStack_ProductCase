import { useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
    ArrowUp,
    ArrowRight,
    ArrowDown,
    Link2,
    Lock,
    MoreHorizontal,
    GripVertical,
    UserPlus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TEAM_ROSTER, getNetAvailability } from '@/data/teamRoster';

const STATUS_CONFIG = {
    'todo': { label: 'To Do', color: '!bg-neutral-200 !text-neutral-700' },
    'in_progress': { label: 'In Progress', color: '!bg-primary-100 !text-primary-700' },
    'review': { label: 'Review', color: '!bg-purple-100 !text-purple-700' },
    'done': { label: 'Done', color: '!bg-success-50 !text-success-600' },
    'blocked': { label: 'Blocked', color: '!bg-danger-50 !text-danger-600' },
};

const PRIORITY_CONFIG = {
    'high': { icon: ArrowUp, color: '!text-danger-500', bg: '!bg-danger-50' },
    'medium': { icon: ArrowRight, color: '!text-warning-500', bg: '!bg-warning-50' },
    'low': { icon: ArrowDown, color: '!text-neutral-400', bg: '!bg-neutral-100' },
};

/**
 * Sprint Data Grid Component
 * A complex, dense table view for active sprint tracking with drag-drop and assignment
 */
export function SprintDataGrid({
    tickets = [],
    onTicketClick,
    onStatusChange,
    onAssigneeChange,
    onReorder,
    onLog,
    className = ""
}) {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(null);

    const handleStatusChange = useCallback((ticket, newStatus) => {
        onStatusChange?.(ticket.id, newStatus);
        onLog?.({
            actor: 'USER_MJ',
            action: 'STATUS_CHANGE',
            details: `${ticket.id} moved to ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
            type: 'info',
        });
    }, [onStatusChange, onLog]);

    const handleAssigneeChange = useCallback((ticket, newAssignee) => {
        onAssigneeChange?.(ticket.id, newAssignee);
        setShowAssigneeDropdown(null);
        onLog?.({
            actor: 'USER_MJ',
            action: 'ASSIGNMENT',
            details: `${ticket.id} assigned to ${newAssignee?.name || 'Unassigned'}`,
            type: 'info',
        });
    }, [onAssigneeChange, onLog]);

    const handleReorder = useCallback((newOrder) => {
        onReorder?.(newOrder);
        onLog?.({
            actor: 'USER_MJ',
            action: 'REORDER',
            details: `Sprint backlog order updated`,
            type: 'info',
        });
    }, [onReorder, onLog]);

    return (
        <div className={cn("!bg-white rounded-xl !border-neutral-200 border shadow-sm overflow-hidden", className)}>
            {/* Table header */}
            <div className="grid grid-cols-[30px_80px_minmax(180px,1fr)_110px_90px_150px_100px_80px_50px] gap-0 !bg-neutral-50 !border-neutral-200 border-b text-[10px] uppercase tracking-wider font-semibold !text-neutral-500">
                <div className="px-2 py-2.5"></div>
                <div className="px-3 py-2.5 !border-neutral-100 border-r">ID</div>
                <div className="px-3 py-2.5 !border-neutral-100 border-r">Title</div>
                <div className="px-3 py-2.5 !border-neutral-100 border-r">Status</div>
                <div className="px-3 py-2.5 !border-neutral-100 border-r">Priority</div>
                <div className="px-3 py-2.5 !border-neutral-100 border-r">Assignee</div>
                <div className="px-3 py-2.5 !border-neutral-100 border-r">AI Conf.</div>
                <div className="px-3 py-2.5 !border-neutral-100 border-r">Links</div>
                <div className="px-3 py-2.5"></div>
            </div>

            {/* Table body with drag-drop */}
            <Reorder.Group
                axis="y"
                values={tickets}
                onReorder={handleReorder}
                className="!divide-neutral-100 divide-y max-h-[400px] overflow-y-auto"
            >
                {tickets.map((ticket, index) => {
                    const status = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.todo;
                    const priority = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium;
                    const PriorityIcon = priority.icon;

                    return (
                        <Reorder.Item
                            key={ticket.id}
                            value={ticket}
                            className={cn(
                                "grid grid-cols-[30px_80px_minmax(180px,1fr)_110px_90px_150px_100px_80px_50px] gap-0 text-xs",
                                hoveredRow === ticket.id ? "!bg-primary-50/50" : "!bg-white",
                                "hover:!bg-primary-50/50 transition-colors cursor-grab active:cursor-grabbing"
                            )}
                            onMouseEnter={() => setHoveredRow(ticket.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                        >
                            {/* Drag handle */}
                            <div className="px-2 py-2.5 flex items-center justify-center !text-neutral-400">
                                <GripVertical className="w-4 h-4" />
                            </div>

                            {/* ID */}
                            <div
                                className="px-3 py-2.5 !border-neutral-100 border-r font-mono !text-primary-600 hover:!text-primary-700 flex items-center font-medium cursor-pointer"
                                onClick={() => onTicketClick?.(ticket)}
                            >
                                {ticket.id}
                            </div>

                            {/* Title */}
                            <div className="px-3 py-2.5 !border-neutral-100 border-r !text-neutral-800 truncate flex items-center">
                                {ticket.isRefined && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-success-500 mr-2 shrink-0" title="AI Refined" />
                                )}
                                <span className="truncate">{ticket.title}</span>
                            </div>

                            {/* Status */}
                            <div className="px-3 py-2.5 !border-neutral-100 border-r flex items-center">
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket, e.target.value)}
                                    className={cn(
                                        "text-[10px] px-2 py-1 rounded font-medium border-0 cursor-pointer",
                                        status.color
                                    )}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`Status for ${ticket.id}`}
                                >
                                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                        <option key={key} value={key}>
                                            {config.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div className="px-3 py-2.5 !border-neutral-100 border-r flex items-center">
                                <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded", priority.bg)}>
                                    <PriorityIcon className={cn("w-3 h-3", priority.color)} />
                                    <span className={cn("text-[10px] capitalize", priority.color)}>{ticket.priority}</span>
                                </div>
                            </div>

                            {/* Assignee with dropdown */}
                            <div className="px-3 py-2.5 !border-neutral-100 border-r flex items-center gap-2 relative">
                                {ticket.assignee ? (
                                    <div
                                        className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAssigneeDropdown(showAssigneeDropdown === ticket.id ? null : ticket.id);
                                        }}
                                    >
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                            style={{ backgroundColor: ticket.assignee.color || '#6366f1' }}
                                        >
                                            {ticket.assignee.initials || ticket.assignee.name?.charAt(0) || '?'}
                                        </div>
                                        <span className="!text-neutral-700 truncate text-[11px]">
                                            {ticket.assignee.name}
                                            {ticket.assignee.role && (
                                                <span className="!text-neutral-400"> ({ticket.assignee.role})</span>
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        className="flex items-center gap-1 !text-neutral-400 hover:!text-primary-500 text-[11px]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAssigneeDropdown(showAssigneeDropdown === ticket.id ? null : ticket.id);
                                        }}
                                    >
                                        <UserPlus className="w-3 h-3" />
                                        Assign
                                    </button>
                                )}

                                {/* Assignee dropdown */}
                                {showAssigneeDropdown === ticket.id && (
                                    <div
                                        className="absolute top-full left-0 mt-1 z-50 !bg-white !border-neutral-200 border rounded-lg shadow-lg py-1 min-w-[180px]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className="w-full px-3 py-2 text-left text-xs !text-neutral-500 hover:!bg-neutral-50"
                                            onClick={() => handleAssigneeChange(ticket, null)}
                                        >
                                            Unassign
                                        </button>
                                        <div className="!border-neutral-100 border-t my-1" />
                                        {TEAM_ROSTER.map((member) => {
                                            const netAvailable = getNetAvailability(member);
                                            return (
                                                <button
                                                    key={member.id}
                                                    className="w-full px-3 py-2 text-left text-xs hover:!bg-neutral-50 flex items-center gap-2"
                                                    onClick={() => handleAssigneeChange(ticket, member)}
                                                >
                                                    <div
                                                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                                                        style={{ backgroundColor: member.color }}
                                                    >
                                                        {member.initials}
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="!text-neutral-800">{member.name}</span>
                                                        <span className="!text-neutral-400"> • {member.role}</span>
                                                    </div>
                                                    <span className="text-[10px] !text-neutral-400">
                                                        {netAvailable - member.assignedPoints}pts
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* AI Confidence */}
                            <div className="px-3 py-2.5 !border-neutral-100 border-r flex items-center gap-2">
                                <Progress
                                    value={ticket.confidence || 0}
                                    className="h-1.5 w-12 !bg-neutral-200"
                                />
                                <span className={cn(
                                    "text-[10px] font-mono font-medium",
                                    (ticket.confidence || 0) >= 80 ? "!text-success-600" :
                                        (ticket.confidence || 0) >= 60 ? "!text-warning-600" :
                                            "!text-danger-500"
                                )}>
                                    {ticket.confidence || 0}%
                                </span>
                            </div>

                            {/* Linked Issues */}
                            <div className="px-3 py-2.5 !border-neutral-100 border-r flex items-center gap-1">
                                {ticket.linkedIssues && ticket.linkedIssues.length > 0 ? (
                                    <>
                                        {ticket.linkedIssues.some(l => l.type === 'blocked') && (
                                            <span className="flex items-center gap-0.5 !text-danger-500" title="Blocked">
                                                <Lock className="w-3 h-3" />
                                            </span>
                                        )}
                                        {ticket.linkedIssues.some(l => l.type === 'depends') && (
                                            <span className="flex items-center gap-0.5 !text-warning-500" title="Has dependencies">
                                                <Link2 className="w-3 h-3" />
                                            </span>
                                        )}
                                        <span className="text-[10px] !text-neutral-400">
                                            {ticket.linkedIssues.length}
                                        </span>
                                    </>
                                ) : (
                                    <span className="!text-neutral-300">—</span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="px-2 py-2.5 flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6 !text-neutral-400 hover:!text-primary-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTicketClick?.(ticket);
                                    }}
                                    aria-label={`More actions for ${ticket.id}`}
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </Reorder.Item>
                    );
                })}
            </Reorder.Group>

            {tickets.length === 0 && (
                <div className="py-8 text-center !text-neutral-400 text-sm">
                    No tickets in this sprint
                </div>
            )}
        </div>
    );
}

export default SprintDataGrid;
