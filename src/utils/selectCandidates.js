import { createSeededRandom, stringToSeed } from './seededRandom';

/**
 * SELECT_CANDIDATES_PROMPT Heuristic:
 * 1. Score each ticket based on strategy keyword matches
 * 2. Apply priority weighting (high=3, medium=2, low=1)
 * 3. Consider business impact and technical complexity
 * 4. Allocate tech debt based on debtPercent
 * 5. Fill capacity respecting dependencies
 * 6. Reserve backups for rejection handling
 */

/**
 * Select sprint candidates based on strategy and constraints
 * @param {string} strategy - Sprint strategy/goals text
 * @param {Array} backlog - Available tickets
 * @param {number|string} seed - Seed for deterministic selection
 * @param {number} capacityPoints - Total story points capacity
 * @param {string} capacityMode - 'conservative' or 'aggressive'
 * @param {number} debtPercent - Percentage of capacity for tech debt (0-30)
 * @returns {object} { selected, backups, summary, strategicFit }
 */
export function selectCandidates(strategy, backlog, seed, capacityPoints, capacityMode = 'conservative', debtPercent = 10) {
    const numericSeed = typeof seed === 'string' ? stringToSeed(seed) : seed;
    const random = createSeededRandom(numericSeed);

    // Extract keywords from strategy
    const strategyLower = strategy.toLowerCase();
    const keywords = extractKeywords(strategyLower);

    // Calculate effective capacity
    const capacityMultiplier = capacityMode === 'aggressive' ? 1.1 : 0.9;
    const effectiveCapacity = Math.floor(capacityPoints * capacityMultiplier);
    const techDebtCapacity = Math.floor(effectiveCapacity * (debtPercent / 100));
    const featureCapacity = effectiveCapacity - techDebtCapacity;

    // Score and sort tickets
    const scoredTickets = backlog.map(ticket => ({
        ...ticket,
        score: calculateTicketScore(ticket, keywords, random),
        confidence: 0.6 + random() * 0.35,
    }));

    scoredTickets.sort((a, b) => b.score - a.score);

    // Separate tech debt and feature tickets
    const techDebtTickets = scoredTickets.filter(t => t.techDebt);
    const featureTickets = scoredTickets.filter(t => !t.techDebt);

    // Select tickets within capacity
    const selected = [];
    const backups = [];
    let usedFeaturePoints = 0;
    let usedDebtPoints = 0;

    // Fill tech debt allocation
    for (const ticket of techDebtTickets) {
        if (usedDebtPoints + ticket.storyPoints <= techDebtCapacity) {
            selected.push({ ...ticket, selectionReason: 'Tech debt allocation' });
            usedDebtPoints += ticket.storyPoints;
        } else if (backups.length < 5) {
            backups.push({ ...ticket, selectionReason: 'Backup - tech debt' });
        }
    }

    // Fill feature allocation
    for (const ticket of featureTickets) {
        // Check dependencies
        const hasUnmetDependency = ticket.dependencies.some(
            dep => !selected.find(s => s.id === dep)
        );

        if (hasUnmetDependency) {
            if (backups.length < 5) {
                backups.push({ ...ticket, selectionReason: 'Backup - unmet dependencies' });
            }
            continue;
        }

        if (usedFeaturePoints + ticket.storyPoints <= featureCapacity) {
            selected.push({
                ...ticket,
                selectionReason: getSelectionReason(ticket, keywords),
            });
            usedFeaturePoints += ticket.storyPoints;
        } else if (backups.length < 5) {
            backups.push({ ...ticket, selectionReason: 'Backup - capacity overflow' });
        }
    }

    // Calculate strategic fit percentage
    const totalScore = selected.reduce((sum, t) => sum + t.score, 0);
    const maxPossibleScore = selected.length * 15; // Max score per ticket
    const strategicFit = Math.min(95, Math.round((totalScore / maxPossibleScore) * 100));

    // Generate summary
    const summary = {
        totalPoints: usedFeaturePoints + usedDebtPoints,
        featurePoints: usedFeaturePoints,
        techDebtPoints: usedDebtPoints,
        ticketCount: selected.length,
        backupCount: backups.length,
        strategicFit,
        capacityUtilization: Math.round(((usedFeaturePoints + usedDebtPoints) / effectiveCapacity) * 100),
        warnings: generateWarnings(selected, effectiveCapacity, usedFeaturePoints + usedDebtPoints),
    };

    return { selected, backups, summary };
}

function extractKeywords(strategy) {
    const commonKeywords = [
        'retention', 'performance', 'security', 'bug', 'feature',
        'auth', 'ux', 'reliability', 'optimization', 'integration',
        'q3', 'quick', 'critical', 'urgent', 'debt'
    ];

    return commonKeywords.filter(kw => strategy.includes(kw));
}

function calculateTicketScore(ticket, keywords, random) {
    let score = 0;

    // Priority weighting
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    score += priorityWeights[ticket.priority] || 1;

    // Keyword matching
    const ticketText = `${ticket.title} ${ticket.description} ${ticket.labels.join(' ')}`.toLowerCase();
    for (const keyword of keywords) {
        if (ticketText.includes(keyword)) {
            score += 2;
        }
    }

    // Business impact factor
    score += (ticket.businessImpact || 5) * 0.5;

    // Slight randomization for tie-breaking (but deterministic)
    score += random() * 0.5;

    return score;
}

function getSelectionReason(ticket, keywords) {
    const matchedKeywords = keywords.filter(kw =>
        `${ticket.title} ${ticket.description} ${ticket.labels.join(' ')}`.toLowerCase().includes(kw)
    );

    if (matchedKeywords.length > 0) {
        return `Aligns with strategy: ${matchedKeywords.join(', ')}`;
    }

    if (ticket.priority === 'high') {
        return 'High priority item';
    }

    return 'Fits capacity and dependencies';
}

function generateWarnings(selected, capacity, used) {
    const warnings = [];

    if (used / capacity > 0.95) {
        warnings.push({
            type: 'capacity',
            message: 'Sprint is at near-full capacity. Consider buffer for unexpected work.',
        });
    }

    const highPriorityCount = selected.filter(t => t.priority === 'high').length;
    if (highPriorityCount > selected.length * 0.7) {
        warnings.push({
            type: 'risk',
            message: 'Many high-priority items. Execution risk if blockers arise.',
        });
    }

    return warnings;
}

export default selectCandidates;
