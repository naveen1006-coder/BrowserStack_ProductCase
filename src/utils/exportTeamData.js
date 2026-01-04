import { TEAM_ROSTER, getNetAvailability, getTeamTotals, getCapacityByRole } from '@/data/teamRoster';

/**
 * Export team capacity data to CSV
 */
export function exportTeamCapacity(roster = TEAM_ROSTER) {
    const totals = getTeamTotals(roster);
    const byRole = getCapacityByRole(roster);

    // Build CSV content
    let csv = 'Team Capacity Report\n';
    csv += `Generated,${new Date().toISOString()}\n\n`;

    // Summary section
    csv += 'SUMMARY\n';
    csv += 'Metric,Value\n';
    csv += `Total Base Capacity,${totals.totalBase}\n`;
    csv += `Total Deductions,${totals.totalDeductions}\n`;
    csv += `Net Available,${totals.totalNet}\n`;
    csv += `Currently Assigned,${totals.totalAssigned}\n`;
    csv += `Unassigned Points,${totals.availablePoints}\n`;
    csv += `Overall Utilization,${totals.overallUtilization}%\n\n`;

    // By role section
    csv += 'CAPACITY BY ROLE\n';
    csv += 'Role,Net Capacity,Assigned,Available,Members\n';
    Object.entries(byRole).forEach(([role, data]) => {
        csv += `${role},${data.net},${data.assigned},${data.available},"${data.members.join(', ')}"\n`;
    });
    csv += '\n';

    // Individual breakdown
    csv += 'INDIVIDUAL BREAKDOWN\n';
    csv += 'Name,Role,Base Points,Total Deductions,Net Available,Assigned,Utilization %\n';
    roster.forEach(member => {
        const netAvailable = getNetAvailability(member);
        const totalDeductions = member.deductions.reduce((sum, d) => sum + d.value, 0);
        const utilization = netAvailable > 0 ? Math.round((member.assignedPoints / netAvailable) * 100) : 0;
        csv += `${member.name},${member.role},${member.basePoints},${totalDeductions},${netAvailable},${member.assignedPoints},${utilization}%\n`;
    });
    csv += '\n';

    // Deductions detail
    csv += 'DEDUCTIONS DETAIL\n';
    csv += 'Name,Deduction Type,Points,Reason\n';
    roster.forEach(member => {
        member.deductions.forEach(d => {
            csv += `${member.name},${d.type},${d.value},"${d.reason}"\n`;
        });
    });

    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `team-capacity-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Export sprint history to CSV
 */
export function exportSprintHistory(sprints) {
    if (!sprints || sprints.length === 0) {
        alert('No sprint history to export');
        return;
    }

    let csv = 'Sprint History Report\n';
    csv += `Generated,${new Date().toISOString()}\n\n`;

    csv += 'Sprint ID,Date,Total Points,Tickets Count,Strategic Fit %,Capacity Utilization %,AI Refined Count\n';
    sprints.forEach(sprint => {
        csv += `${sprint.id},${sprint.date},${sprint.totalPoints},${sprint.ticketCount},${sprint.strategicFit}%,${sprint.capacityUtilization}%,${sprint.refinedCount}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sprint-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export default { exportTeamCapacity, exportSprintHistory };
