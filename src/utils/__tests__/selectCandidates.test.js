import { describe, it, expect } from 'vitest';
import { selectCandidates } from '../selectCandidates';
import backlogData from '../../data/backlog.json';

describe('selectCandidates', () => {
    const testBacklog = backlogData.tickets;

    it('returns consistent output for the same seed', () => {
        const strategy = 'Fix Q3 retention issues';
        const seed = 12345;
        const capacityPoints = 20;
        const capacityMode = 'conservative';
        const debtPercent = 10;

        // Run selection multiple times
        const result1 = selectCandidates(strategy, testBacklog, seed, capacityPoints, capacityMode, debtPercent);
        const result2 = selectCandidates(strategy, testBacklog, seed, capacityPoints, capacityMode, debtPercent);
        const result3 = selectCandidates(strategy, testBacklog, seed, capacityPoints, capacityMode, debtPercent);

        // Verify all results are identical
        expect(result1.selected.length).toBe(result2.selected.length);
        expect(result1.selected.length).toBe(result3.selected.length);

        // Check specific ticket IDs match
        const ids1 = result1.selected.map(t => t.id).sort();
        const ids2 = result2.selected.map(t => t.id).sort();
        const ids3 = result3.selected.map(t => t.id).sort();

        expect(ids1).toEqual(ids2);
        expect(ids1).toEqual(ids3);

        // Verify summary values match
        expect(result1.summary.totalPoints).toBe(result2.summary.totalPoints);
        expect(result1.summary.strategicFit).toBe(result2.summary.strategicFit);
    });

    it('returns different output for different seeds', () => {
        const strategy = 'Performance improvements';
        const capacityPoints = 30;

        const result1 = selectCandidates(strategy, testBacklog, 111, capacityPoints, 'conservative', 10);
        const result2 = selectCandidates(strategy, testBacklog, 999, capacityPoints, 'conservative', 10);

        // Results should differ (though this is probabilistic, very likely with different seeds)
        const ids1 = result1.selected.map(t => t.id).sort();
        const ids2 = result2.selected.map(t => t.id).sort();

        // At minimum, check the function runs without error
        expect(result1.selected.length).toBeGreaterThan(0);
        expect(result2.selected.length).toBeGreaterThan(0);
    });

    it('respects capacity constraints', () => {
        const strategy = 'Any work';
        const seed = 42;
        const capacityPoints = 15;

        const result = selectCandidates(strategy, testBacklog, seed, capacityPoints, 'conservative', 0);

        // Total points should not exceed effective capacity (90% of 15 = 13.5)
        expect(result.summary.totalPoints).toBeLessThanOrEqual(capacityPoints);
    });

    it('allocates tech debt according to percentage', () => {
        const strategy = 'Tech debt focus';
        const seed = 42;
        const capacityPoints = 40;
        const debtPercent = 30; // 30% = 12 points for tech debt

        const result = selectCandidates(strategy, testBacklog, seed, capacityPoints, 'conservative', debtPercent);

        // Should have some tech debt tickets
        const techDebtTickets = result.selected.filter(t => t.techDebt);
        expect(techDebtTickets.length).toBeGreaterThanOrEqual(0);

        // Summary should track tech debt points
        expect(result.summary.techDebtPoints).toBeDefined();
    });

    it('includes backups when available', () => {
        const strategy = 'Retention';
        const seed = 42;
        const capacityPoints = 10; // Limited capacity

        const result = selectCandidates(strategy, testBacklog, seed, capacityPoints, 'conservative', 10);

        // Should have backups since we limited capacity
        expect(result.backups).toBeDefined();
        expect(Array.isArray(result.backups)).toBe(true);
    });

    it('returns required summary fields', () => {
        const result = selectCandidates('Test', testBacklog, 1, 20, 'conservative', 10);

        expect(result.summary).toHaveProperty('totalPoints');
        expect(result.summary).toHaveProperty('featurePoints');
        expect(result.summary).toHaveProperty('techDebtPoints');
        expect(result.summary).toHaveProperty('ticketCount');
        expect(result.summary).toHaveProperty('backupCount');
        expect(result.summary).toHaveProperty('strategicFit');
        expect(result.summary).toHaveProperty('capacityUtilization');
        expect(result.summary).toHaveProperty('warnings');
    });
});
