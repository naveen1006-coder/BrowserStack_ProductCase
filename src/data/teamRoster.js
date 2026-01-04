/**
 * Team Roster Mock Data
 * Contains team member information with capacity, deductions, and specializations
 */

export const TEAM_ROSTER = [
    {
        id: 1,
        name: 'Sarah',
        initials: 'SK',
        role: 'Frontend',
        roleShort: 'FE',
        avatar: null,
        color: '#6366f1',
        basePoints: 10,
        deductions: [
            { type: 'Leave', value: 2, reason: 'Vacation on Friday' },
        ],
        assignedPoints: 5,
    },
    {
        id: 2,
        name: 'Marcus',
        initials: 'MJ',
        role: 'Backend',
        roleShort: 'BE',
        avatar: null,
        color: '#22c55e',
        basePoints: 10,
        deductions: [
            { type: 'Shadow Project', value: 5, reason: 'Helping Marketing Team' },
        ],
        assignedPoints: 3,
    },
    {
        id: 3,
        name: 'Priya',
        initials: 'PR',
        role: 'QA',
        roleShort: 'QA',
        avatar: null,
        color: '#f59e0b',
        basePoints: 8,
        deductions: [
            { type: 'Meeting Overload', value: 1, reason: 'Recruitment Interviews' },
        ],
        assignedPoints: 4,
    },
    {
        id: 4,
        name: 'Alex',
        initials: 'AK',
        role: 'Frontend',
        roleShort: 'FE',
        avatar: null,
        color: '#ec4899',
        basePoints: 10,
        deductions: [],
        assignedPoints: 6,
    },
    {
        id: 5,
        name: 'Jordan',
        initials: 'JT',
        role: 'Backend',
        roleShort: 'BE',
        avatar: null,
        color: '#14b8a6',
        basePoints: 10,
        deductions: [
            { type: 'Leave', value: 3, reason: 'Conference attendance' },
            { type: 'Shadow Project', value: 2, reason: 'DevOps migration support' },
        ],
        assignedPoints: 2,
    },
];

/**
 * Calculate net availability for a team member
 */
export function getNetAvailability(member) {
    const totalDeductions = member.deductions.reduce((sum, d) => sum + d.value, 0);
    return Math.max(0, member.basePoints - totalDeductions);
}

/**
 * Calculate utilization percentage
 */
export function getUtilization(member) {
    const netAvailable = getNetAvailability(member);
    if (netAvailable === 0) return 100;
    return Math.round((member.assignedPoints / netAvailable) * 100);
}

/**
 * Get status based on utilization
 * @returns 'underutilized' | 'optimal' | 'overloaded'
 */
export function getCapacityStatus(member) {
    const utilization = getUtilization(member);
    if (utilization < 50) return 'underutilized';
    if (utilization <= 85) return 'optimal';
    return 'overloaded';
}

/**
 * Get status color based on capacity status
 */
export function getStatusColor(status) {
    switch (status) {
        case 'underutilized':
            return { ring: '#2B3990', bg: 'bg-primary-50', text: 'text-primary-600' };
        case 'optimal':
            return { ring: '#22c55e', bg: 'bg-success-50', text: 'text-success-600' };
        case 'overloaded':
            return { ring: '#ef4444', bg: 'bg-danger-50', text: 'text-danger-600' };
        default:
            return { ring: '#94a3b8', bg: 'bg-neutral-50', text: 'text-neutral-600' };
    }
}

/**
 * Calculate team totals
 */
export function getTeamTotals(roster) {
    const totalBase = roster.reduce((sum, m) => sum + m.basePoints, 0);
    const totalDeductions = roster.reduce((sum, m) =>
        sum + m.deductions.reduce((s, d) => s + d.value, 0), 0
    );
    const totalNet = roster.reduce((sum, m) => sum + getNetAvailability(m), 0);
    const totalAssigned = roster.reduce((sum, m) => sum + m.assignedPoints, 0);

    return {
        totalBase,
        totalDeductions,
        totalNet,
        totalAssigned,
        availablePoints: totalNet - totalAssigned,
        overallUtilization: totalNet > 0 ? Math.round((totalAssigned / totalNet) * 100) : 0,
    };
}

/**
 * Get capacity by role
 */
export function getCapacityByRole(roster) {
    const byRole = {};

    roster.forEach(member => {
        if (!byRole[member.role]) {
            byRole[member.role] = {
                net: 0,
                assigned: 0,
                available: 0,
                members: []
            };
        }
        const net = getNetAvailability(member);
        byRole[member.role].net += net;
        byRole[member.role].assigned += member.assignedPoints;
        byRole[member.role].available += (net - member.assignedPoints);
        byRole[member.role].members.push(member.name);
    });

    return byRole;
}

/**
 * Detect bottlenecks based on ticket requirements vs capacity
 */
export function detectBottlenecks(roster, requiredByRole) {
    const capacity = getCapacityByRole(roster);
    const alerts = [];

    Object.entries(requiredByRole).forEach(([role, required]) => {
        const roleCapacity = capacity[role];
        if (!roleCapacity) {
            alerts.push({
                type: 'missing_role',
                severity: 'error',
                message: `No ${role} engineers available. ${required} points unassignable.`,
                role,
                deficit: required,
            });
        } else if (required > roleCapacity.available) {
            const deficit = required - roleCapacity.available;
            alerts.push({
                type: 'capacity_mismatch',
                severity: 'warning',
                message: `Resource Mismatch: ${deficit} ${role} points are unassigned due to capacity constraints.`,
                role,
                deficit,
                available: roleCapacity.available,
                required,
            });
        }
    });

    return alerts;
}

export default TEAM_ROSTER;
