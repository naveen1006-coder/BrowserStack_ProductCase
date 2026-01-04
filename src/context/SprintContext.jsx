import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
    saveCurrentSprint,
    getCurrentSprint,
    saveDraftStrategy,
    getDraftStrategy,
    saveRefinedTicket as persistRefinedTicket,
    getRefinedTickets,
    addToSprintHistory,
} from '@/utils/storage';

const SprintContext = createContext(null);

export function SprintProvider({ children }) {
    // Strategy state
    const [strategy, setStrategyState] = useState('');
    const [capacityPoints, setCapacityPoints] = useState(20);
    const [capacityMode, setCapacityMode] = useState('conservative');
    const [debtPercent, setDebtPercent] = useState(10);

    // Sprint candidates state
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [backupCandidates, setBackupCandidates] = useState([]);
    const [summary, setSummary] = useState(null);

    // Refined tickets state
    const [refinedTickets, setRefinedTickets] = useState({});

    // UI state
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Load saved state on mount
    useEffect(() => {
        const savedSprint = getCurrentSprint();
        if (savedSprint) {
            setStrategyState(savedSprint.strategy || '');
            setCapacityPoints(savedSprint.capacityPoints || 20);
            setCapacityMode(savedSprint.capacityMode || 'conservative');
            setDebtPercent(savedSprint.debtPercent || 10);
            setSelectedCandidates(savedSprint.selectedCandidates || []);
            setBackupCandidates(savedSprint.backupCandidates || []);
            setSummary(savedSprint.summary || null);
        }

        const savedDraft = getDraftStrategy();
        if (savedDraft && !savedSprint?.strategy) {
            setStrategyState(savedDraft.strategy || '');
        }

        const savedRefined = getRefinedTickets();
        setRefinedTickets(savedRefined);
    }, []);

    // Persist sprint state changes
    useEffect(() => {
        if (selectedCandidates.length > 0 || summary) {
            saveCurrentSprint({
                strategy,
                capacityPoints,
                capacityMode,
                debtPercent,
                selectedCandidates,
                backupCandidates,
                summary,
            });
        }
    }, [strategy, capacityPoints, capacityMode, debtPercent, selectedCandidates, backupCandidates, summary]);

    // Set strategy with auto-save draft
    const setStrategy = useCallback((value) => {
        setStrategyState(value);
        saveDraftStrategy(value);
    }, []);

    // Update candidates after generation
    const setCandidates = useCallback((selected, backups, sprintSummary) => {
        setSelectedCandidates(selected);
        setBackupCandidates(backups);
        setSummary(sprintSummary);
    }, []);

    // Reject a candidate and replace with backup
    const rejectCandidate = useCallback((ticketId) => {
        setSelectedCandidates(prev => {
            const filtered = prev.filter(t => t.id !== ticketId);

            // Get the next backup if available
            if (backupCandidates.length > 0) {
                const [replacement, ...remainingBackups] = backupCandidates;
                setBackupCandidates(remainingBackups);
                return [...filtered, replacement];
            }

            return filtered;
        });
    }, [backupCandidates]);

    // Save refined ticket
    const saveRefinedTicket = useCallback((ticketId, refinedData) => {
        persistRefinedTicket(ticketId, refinedData);
        setRefinedTickets(prev => ({
            ...prev,
            [ticketId]: refinedData,
        }));

        // Update the ticket in selected candidates
        setSelectedCandidates(prev =>
            prev.map(t =>
                t.id === ticketId
                    ? { ...t, ...refinedData.refined, isRefined: true }
                    : t
            )
        );
    }, []);

    // Clear all refined tickets
    const clearRefinedTickets = useCallback(() => {
        setRefinedTickets({});
        localStorage.removeItem('align_refined_tickets');
    }, []);

    // Launch sprint
    const launchSprint = useCallback(() => {
        const sprintData = {
            strategy,
            capacityPoints,
            capacityMode,
            debtPercent,
            selectedCandidates,
            summary,
            refinedTickets: Object.keys(refinedTickets).length,
        };

        addToSprintHistory(sprintData);
        return sprintData;
    }, [strategy, capacityPoints, capacityMode, debtPercent, selectedCandidates, summary, refinedTickets]);

    // Reset sprint state
    const resetSprint = useCallback(() => {
        setStrategyState('');
        setCapacityPoints(20);
        setCapacityMode('conservative');
        setDebtPercent(10);
        setSelectedCandidates([]);
        setBackupCandidates([]);
        setSummary(null);
        setRefinedTickets({});
        setIsGenerating(false);
        setCurrentStep(0);
        localStorage.removeItem('align_current_sprint');
        localStorage.removeItem('align_refined_tickets');
    }, []);

    const value = {
        // Strategy
        strategy,
        setStrategy,
        capacityPoints,
        setCapacityPoints,
        capacityMode,
        setCapacityMode,
        debtPercent,
        setDebtPercent,

        // Candidates
        selectedCandidates,
        backupCandidates,
        summary,
        setCandidates,
        rejectCandidate,

        // Refined tickets
        refinedTickets,
        saveRefinedTicket,
        clearRefinedTickets,

        // Generation state
        isGenerating,
        setIsGenerating,
        currentStep,
        setCurrentStep,

        // Actions
        launchSprint,
        resetSprint,
    };

    return (
        <SprintContext.Provider value={value}>
            {children}
        </SprintContext.Provider>
    );
}

export function useSprint() {
    const context = useContext(SprintContext);
    if (!context) {
        throw new Error('useSprint must be used within a SprintProvider');
    }
    return context;
}

export default SprintContext;
