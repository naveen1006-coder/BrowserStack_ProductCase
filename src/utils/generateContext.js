import { createSeededRandom, stringToSeed } from './seededRandom';

/**
 * Generate deterministic context data for AI mock responses
 * @param {number|string} seed - Seed for deterministic output
 * @returns {object} Context object with mock AI configuration
 */
export function generateContext(seed) {
    const numericSeed = typeof seed === 'string' ? stringToSeed(seed) : seed;
    const random = createSeededRandom(numericSeed);

    // Generate deterministic confidence levels
    const confidenceLevels = [0.72, 0.85, 0.91, 0.78, 0.88, 0.95, 0.67, 0.82];
    const selectedConfidence = confidenceLevels[Math.floor(random() * confidenceLevels.length)];

    // Generate mock AI reasoning
    const reasoningTemplates = [
        'Based on strategic alignment with sprint goals',
        'Prioritizing based on business impact score',
        'Considering technical dependencies and complexity',
        'Aligning with Q3 retention objectives',
        'Factoring in team velocity and capacity',
    ];

    return {
        seed: numericSeed,
        confidence: selectedConfidence,
        reasoning: reasoningTemplates[Math.floor(random() * reasoningTemplates.length)],
        timestamp: new Date().toISOString(),
        mockMode: import.meta.env.VITE_MOCK_MODE !== 'false',
    };
}

/**
 * Generate improvement suggestions with deterministic confidence scores
 */
export function generateImprovementSuggestions(ticket, seed) {
    const numericSeed = typeof seed === 'string' ? stringToSeed(seed + ticket.id) : seed + ticket.id.charCodeAt(0);
    const random = createSeededRandom(numericSeed);

    const suggestions = [];

    // Title improvements
    if (random() > 0.3) {
        suggestions.push({
            field: 'title',
            type: 'clarity',
            confidence: 0.7 + random() * 0.25,
            original: ticket.title,
            suggested: improveTitle(ticket.title, random),
        });
    }

    // Description improvements
    if (random() > 0.2) {
        suggestions.push({
            field: 'description',
            type: 'detail',
            confidence: 0.65 + random() * 0.3,
            original: ticket.description,
            suggested: improveDescription(ticket.description, random),
        });
    }

    // Acceptance criteria suggestion
    if (random() > 0.4) {
        suggestions.push({
            field: 'acceptanceCriteria',
            type: 'addition',
            confidence: 0.6 + random() * 0.3,
            original: null,
            suggested: generateAcceptanceCriteria(ticket, random),
        });
    }

    return suggestions;
}

function improveTitle(title, random) {
    const prefixes = ['[IMPROVED] ', '[REFINED] ', ''];
    const prefix = prefixes[Math.floor(random() * prefixes.length)];

    // Add action verb if missing
    const actionVerbs = ['Implement', 'Fix', 'Optimize', 'Add', 'Refactor'];
    const hasActionVerb = actionVerbs.some(verb => title.startsWith(verb));

    if (!hasActionVerb && random() > 0.5) {
        const verb = actionVerbs[Math.floor(random() * actionVerbs.length)];
        return `${prefix}${verb}: ${title}`;
    }

    return `${prefix}${title}`;
}

function improveDescription(description, random) {
    const enhancements = [
        '\n\n**Expected Behavior:**\nSystem should handle this use case gracefully.',
        '\n\n**Technical Notes:**\nConsider edge cases and error handling.',
        '\n\n**Dependencies:**\nNo blocking dependencies identified.',
    ];

    const enhancement = enhancements[Math.floor(random() * enhancements.length)];
    return description + enhancement;
}

function generateAcceptanceCriteria(ticket, random) {
    const criteria = [
        `- [ ] Feature works as specified in description`,
        `- [ ] Unit tests cover main functionality`,
        `- [ ] No regression in existing functionality`,
    ];

    if (ticket.labels.includes('bug')) {
        criteria.push(`- [ ] Bug no longer reproducible`);
    }

    if (ticket.labels.includes('performance')) {
        criteria.push(`- [ ] Performance metrics meet target thresholds`);
    }

    // Shuffle and pick 3-4 criteria
    const count = 3 + Math.floor(random() * 2);
    return criteria.slice(0, count).join('\n');
}

export default { generateContext, generateImprovementSuggestions };
