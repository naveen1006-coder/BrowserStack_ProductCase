import { useMemo, useState, useEffect } from 'react';
import { ChevronRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    TEAM_ROSTER,
    getNetAvailability,
    getUtilization,
    getCapacityStatus,
    getStatusColor,
    getTeamTotals
} from '@/data/teamRoster';

/**
 * Circular progress ring component for avatar
 */
function AvatarRing({ member, size = 48 }) {
    const utilization = getUtilization(member);
    const status = getCapacityStatus(member);
    const colors = getStatusColor(status);

    const radius = (size - 6) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(utilization, 100);
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            {/* Background ring */}
            <svg
                className="absolute inset-0 -rotate-90"
                width={size}
                height={size}
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={colors.ring}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                />
            </svg>

            {/* Avatar */}
            <div
                className="absolute inset-1 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: member.color }}
                title={`${member.name} (${member.role}) - ${utilization}% utilized`}
            >
                {member.initials}
            </div>
        </div>
    );
}

/**
 * Team Overview Bar Component
 * Shows team avatars with capacity rings at the top of Strategy page
 */
export function TeamOverviewBar({
    roster = TEAM_ROSTER,
    onViewDetails,
    className = ""
}) {
    const [avatarSize, setAvatarSize] = useState(44);
    
    useEffect(() => {
        const updateSize = () => {
            setAvatarSize(window.innerWidth >= 640 ? 44 : 36);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const totals = useMemo(() => getTeamTotals(roster), [roster]);

    const statusCounts = useMemo(() => {
        const counts = { underutilized: 0, optimal: 0, overloaded: 0 };
        roster.forEach(member => {
            const status = getCapacityStatus(member);
            counts[status]++;
        });
        return counts;
    }, [roster]);

    return (
        <div className={cn(
            "bg-white rounded-xl border border-neutral-200 shadow-sm p-3 sm:p-4",
            className
        )}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                {/* Left: Title and avatars */}
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                        <span className="text-xs sm:text-sm font-semibold text-neutral-800">Team Intelligence</span>
                    </div>

                    {/* Avatar rings */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {roster.map((member) => (
                            <AvatarRing key={member.id} member={member} size={avatarSize} />
                        ))}
                    </div>
                </div>

                {/* Center: Quick stats */}
                <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                    <div className="text-center">
                        <p className="text-base sm:text-lg font-bold text-neutral-800">{totals.totalNet}</p>
                        <p className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-wide">Net Points</p>
                    </div>
                    <div className="text-center">
                        <p className="text-base sm:text-lg font-bold text-primary-600">{totals.availablePoints}</p>
                        <p className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-wide">Available</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {statusCounts.underutilized > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500" />
                                <span className="text-[10px] sm:text-xs text-neutral-600">{statusCounts.underutilized}</span>
                            </div>
                        )}
                        {statusCounts.optimal > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success-500" />
                                <span className="text-[10px] sm:text-xs text-neutral-600">{statusCounts.optimal}</span>
                            </div>
                        )}
                        {statusCounts.overloaded > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-danger-500" />
                                <span className="text-[10px] sm:text-xs text-neutral-600">{statusCounts.overloaded}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: View details button */}
                <button
                    onClick={onViewDetails}
                    className="flex items-center gap-1 text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors self-start sm:self-auto"
                    aria-label="View availability details"
                >
                    <span className="hidden sm:inline">View Availability Details</span>
                    <span className="sm:hidden">View Details</span>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-neutral-100 flex-wrap">
                <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-wide">Capacity Status:</span>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500" />
                    <span className="text-[9px] sm:text-[10px] text-neutral-500">Under-utilized (&lt;50%)</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success-500" />
                    <span className="text-[9px] sm:text-[10px] text-neutral-500">Optimal (50-85%)</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-danger-500" />
                    <span className="text-[9px] sm:text-[10px] text-neutral-500">Overloaded (&gt;90%)</span>
                </div>
            </div>
        </div>
    );
}

export default TeamOverviewBar;
