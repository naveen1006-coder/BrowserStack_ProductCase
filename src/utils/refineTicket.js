import { createSeededRandom, stringToSeed } from './seededRandom';

/**
 * REFINE_TICKET_PROMPT Heuristic:
 * 1. Analyze ticket title for clarity and action verbs
 * 2. Check description for completeness (what, why, how)
 * 3. Suggest acceptance criteria if missing
 * 4. Recommend story point adjustments based on complexity
 * 5. Flag potential risks or dependencies
 * 6. Provide confidence score for each suggestion
 */

/**
 * Refine a ticket with AI-suggested improvements
 * @param {object} ticket - Original ticket
 * @param {object} context - Context from generateContext
 * @returns {object} Refined ticket with suggestions and confidence scores
 */
export function refineTicket(ticket, context) {
    const seed = context?.seed || stringToSeed(ticket.id);
    const random = createSeededRandom(seed);

    const improvements = [];
    const refinedTicket = { ...ticket };

    // Analyze and improve title
    const titleAnalysis = analyzeTitle(ticket.title, random);
    if (titleAnalysis.suggestion) {
        improvements.push({
            field: 'title',
            type: 'clarity',
            before: ticket.title,
            after: titleAnalysis.improved,
            confidence: titleAnalysis.confidence,
            reason: titleAnalysis.reason,
        });
        refinedTicket.title = titleAnalysis.improved;
    }

    // Analyze and improve description
    const descAnalysis = analyzeDescription(ticket.description, ticket, random);
    if (descAnalysis.suggestion) {
        improvements.push({
            field: 'description',
            type: 'completeness',
            before: ticket.description,
            after: descAnalysis.improved,
            confidence: descAnalysis.confidence,
            reason: descAnalysis.reason,
        });
        refinedTicket.description = descAnalysis.improved;
    }

    // Generate acceptance criteria
    const acAnalysis = generateAcceptanceCriteria(ticket, random);
    improvements.push({
        field: 'acceptanceCriteria',
        type: 'addition',
        before: ticket.acceptanceCriteria || null,
        after: acAnalysis.criteria,
        confidence: acAnalysis.confidence,
        reason: 'Added structured acceptance criteria for clarity',
    });
    refinedTicket.acceptanceCriteria = acAnalysis.criteria;

    // Analyze story points
    const pointsAnalysis = analyzeStoryPoints(ticket, random);
    if (pointsAnalysis.suggestion) {
        improvements.push({
            field: 'storyPoints',
            type: 'adjustment',
            before: ticket.storyPoints,
            after: pointsAnalysis.recommended,
            confidence: pointsAnalysis.confidence,
            reason: pointsAnalysis.reason,
        });
        refinedTicket.suggestedPoints = pointsAnalysis.recommended;
    }

    // Identify risks
    const risks = identifyRisks(ticket, random);
    if (risks.length > 0) {
        improvements.push({
            field: 'risks',
            type: 'warning',
            before: null,
            after: risks,
            confidence: 0.75 + random() * 0.2,
            reason: 'Potential risks identified that may affect implementation',
        });
        refinedTicket.risks = risks;
    }

    // Calculate overall refinement score
    const avgConfidence = improvements.reduce((sum, i) => sum + i.confidence, 0) / improvements.length;

    return {
        original: ticket,
        refined: refinedTicket,
        improvements,
        overallConfidence: Math.round(avgConfidence * 100) / 100,
        aiWarnings: improvements.filter(i => i.confidence < 0.7).map(i => ({
            field: i.field,
            message: `Low confidence (${Math.round(i.confidence * 100)}%) - review recommended`,
        })),
    };
}

function analyzeTitle(title, random) {
    const actionVerbs = ['Implement', 'Fix', 'Add', 'Optimize', 'Refactor', 'Update', 'Create', 'Remove'];
    const hasActionVerb = actionVerbs.some(verb => title.startsWith(verb));

    if (!hasActionVerb && random() > 0.3) {
        // Determine appropriate verb based on title content
        let verb = 'Implement';
        if (title.toLowerCase().includes('bug') || title.toLowerCase().includes('fix')) {
            verb = 'Fix';
        } else if (title.toLowerCase().includes('optim') || title.toLowerCase().includes('performance')) {
            verb = 'Optimize';
        } else if (title.toLowerCase().includes('refactor')) {
            verb = 'Refactor';
        } else if (title.toLowerCase().includes('add') || title.toLowerCase().includes('support')) {
            verb = 'Add';
        }

        return {
            suggestion: true,
            improved: `${verb}: ${title.charAt(0).toLowerCase() + title.slice(1)}`,
            confidence: 0.8 + random() * 0.15,
            reason: 'Added action verb for clarity',
        };
    }

    // Check for vague words
    const vagueWords = ['stuff', 'things', 'misc', 'various'];
    const hasVague = vagueWords.some(w => title.toLowerCase().includes(w));

    if (hasVague) {
        return {
            suggestion: true,
            improved: title.replace(/stuff|things|misc|various/gi, 'functionality'),
            confidence: 0.7 + random() * 0.2,
            reason: 'Replaced vague terminology with specific language',
        };
    }

    return { suggestion: false };
}

function analyzeDescription(description, ticket, random) {
    const sections = {
        what: description.length > 50,
        why: description.includes('because') || description.includes('need') || description.includes('should'),
        how: description.includes('implement') || description.includes('approach') || description.length > 150,
    };

    const missingSections = Object.entries(sections).filter(([, has]) => !has).map(([name]) => name);

    if (missingSections.length > 0 && random() > 0.2) {
        let improved = description;

        if (!sections.why) {
            improved += '\n\n**Business Context:**\nThis improvement supports our sprint objectives and addresses user feedback.';
        }

        if (!sections.how && ticket.storyPoints >= 5) {
            improved += '\n\n**Suggested Approach:**\n1. Analyze current implementation\n2. Design solution\n3. Implement with tests\n4. Review and deploy';
        }

        return {
            suggestion: true,
            improved,
            confidence: 0.65 + random() * 0.25,
            reason: `Added missing sections: ${missingSections.join(', ')}`,
        };
    }

    return { suggestion: false };
}

function generateAcceptanceCriteria(ticket, random) {
    const criteria = [];

    // Base criteria
    criteria.push('- [ ] Implementation matches requirements in description');
    criteria.push('- [ ] Code review completed with no blocking feedback');

    // Type-specific criteria
    if (ticket.labels.includes('bug')) {
        criteria.push('- [ ] Bug is no longer reproducible');
        criteria.push('- [ ] Regression test added to prevent recurrence');
    }

    if (ticket.labels.includes('feature')) {
        criteria.push('- [ ] Feature works as specified across supported browsers');
        criteria.push('- [ ] Documentation updated if needed');
    }

    if (ticket.labels.includes('performance')) {
        criteria.push('- [ ] Performance metrics meet defined thresholds');
        criteria.push('- [ ] No degradation in other system areas');
    }

    if (ticket.storyPoints >= 8) {
        criteria.push('- [ ] Integration tests pass');
    }

    // Always include
    criteria.push('- [ ] Unit tests cover new/modified code');

    return {
        criteria: criteria.join('\n'),
        confidence: 0.8 + random() * 0.15,
    };
}

function analyzeStoryPoints(ticket, random) {
    const complexityIndicators = {
        high: ['refactor', 'migrate', 'integrate', 'security', 'auth'],
        medium: ['implement', 'add', 'create', 'optimize'],
        low: ['fix', 'update', 'change'],
    };

    const text = `${ticket.title} ${ticket.description}`.toLowerCase();

    let estimatedComplexity = 'medium';
    for (const [level, indicators] of Object.entries(complexityIndicators)) {
        if (indicators.some(i => text.includes(i))) {
            estimatedComplexity = level;
            break;
        }
    }

    const pointRanges = {
        high: [8, 13],
        medium: [5, 8],
        low: [2, 3],
    };

    const [min, max] = pointRanges[estimatedComplexity];

    if (ticket.storyPoints < min) {
        return {
            suggestion: true,
            recommended: min,
            confidence: 0.6 + random() * 0.25,
            reason: `Complexity indicators suggest ${min}-${max} points may be more accurate`,
        };
    }

    if (ticket.storyPoints > max + 2) {
        return {
            suggestion: true,
            recommended: max,
            confidence: 0.55 + random() * 0.25,
            reason: `Consider breaking down into smaller tickets (suggested: ${max} points)`,
        };
    }

    return { suggestion: false };
}

function identifyRisks(ticket, random) {
    const risks = [];

    // Dependency risks
    if (ticket.dependencies && ticket.dependencies.length > 0) {
        risks.push({
            type: 'dependency',
            severity: 'medium',
            message: `Depends on ${ticket.dependencies.length} other ticket(s)`,
        });
    }

    // Large scope risks
    if (ticket.storyPoints >= 13) {
        risks.push({
            type: 'scope',
            severity: 'high',
            message: 'Large ticket - consider breaking into smaller deliverables',
        });
    }

    // Tech debt risks
    if (ticket.techDebt) {
        risks.push({
            type: 'technical',
            severity: 'low',
            message: 'Tech debt item may uncover additional cleanup needs',
        });
    }

    // Random additional risk for demonstration
    if (random() > 0.7) {
        risks.push({
            type: 'estimate',
            severity: 'low',
            message: 'Story point estimate has moderate uncertainty',
        });
    }

    return risks;
}

export default refineTicket;
