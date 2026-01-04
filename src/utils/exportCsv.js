/**
 * Export sprint candidates to CSV format
 * @param {Array} candidates - Selected sprint candidates
 * @param {object} summary - Sprint summary data
 * @returns {string} CSV content
 */
export function generateCsv(candidates, summary) {
    const headers = [
        'ID',
        'Title',
        'Priority',
        'Story Points',
        'Labels',
        'Tech Debt',
        'Selection Reason',
        'AI Confidence',
    ];

    const rows = candidates.map(ticket => [
        ticket.id,
        `"${ticket.title.replace(/"/g, '""')}"`,
        ticket.priority,
        ticket.storyPoints,
        `"${ticket.labels.join(', ')}"`,
        ticket.techDebt ? 'Yes' : 'No',
        `"${ticket.selectionReason || ''}"`,
        ticket.confidence ? `${Math.round(ticket.confidence * 100)}%` : 'N/A',
    ]);

    // Add summary row
    rows.push([]);
    rows.push(['Sprint Summary']);
    rows.push(['Total Points', summary.totalPoints]);
    rows.push(['Feature Points', summary.featurePoints]);
    rows.push(['Tech Debt Points', summary.techDebtPoints]);
    rows.push(['Strategic Fit', `${summary.strategicFit}%`]);
    rows.push(['Capacity Utilization', `${summary.capacityUtilization}%`]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
    ].join('\n');

    return csv;
}

/**
 * Download CSV file
 * @param {string} content - CSV content
 * @param {string} filename - File name without extension
 */
export function downloadCsv(content, filename = 'sprint-candidates') {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, `${filename}.csv`);
    } else {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `${filename}.csv`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

/**
 * Export and download sprint candidates
 * @param {Array} candidates - Selected sprint candidates
 * @param {object} summary - Sprint summary data
 */
export function exportSprintCandidates(candidates, summary) {
    const csv = generateCsv(candidates, summary);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCsv(csv, `sprint-candidates-${timestamp}`);
}

export default { generateCsv, downloadCsv, exportSprintCandidates };
