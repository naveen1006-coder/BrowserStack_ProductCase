const STORAGE_KEYS = {
    DRAFT_STRATEGY: 'align_draft_strategy',
    REFINED_TICKETS: 'align_refined_tickets',
    SPRINT_HISTORY: 'align_sprint_history',
    CURRENT_SPRINT: 'align_current_sprint',
    USER_PREFERENCES: 'align_user_preferences',
};

/**
 * Save strategy draft to localStorage
 */
export function saveDraftStrategy(strategy) {
    try {
        const draft = {
            strategy,
            savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.DRAFT_STRATEGY, JSON.stringify(draft));
        return true;
    } catch (error) {
        console.error('Failed to save draft strategy:', error);
        return false;
    }
}

/**
 * Get saved strategy draft
 */
export function getDraftStrategy() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.DRAFT_STRATEGY);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Failed to get draft strategy:', error);
        return null;
    }
}

/**
 * Save refined ticket to localStorage
 */
export function saveRefinedTicket(ticketId, refinedData) {
    try {
        const existing = getRefinedTickets();
        existing[ticketId] = {
            ...refinedData,
            refinedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.REFINED_TICKETS, JSON.stringify(existing));
        return true;
    } catch (error) {
        console.error('Failed to save refined ticket:', error);
        return false;
    }
}

/**
 * Get all refined tickets
 */
export function getRefinedTickets() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.REFINED_TICKETS);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Failed to get refined tickets:', error);
        return {};
    }
}

/**
 * Get a specific refined ticket
 */
export function getRefinedTicket(ticketId) {
    const tickets = getRefinedTickets();
    return tickets[ticketId] || null;
}

/**
 * Save current sprint data
 */
export function saveCurrentSprint(sprintData) {
    try {
        const data = {
            ...sprintData,
            savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.CURRENT_SPRINT, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save current sprint:', error);
        return false;
    }
}

/**
 * Get current sprint data
 */
export function getCurrentSprint() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_SPRINT);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Failed to get current sprint:', error);
        return null;
    }
}

/**
 * Add sprint to history
 */
export function addToSprintHistory(sprintData) {
    try {
        const history = getSprintHistory();
        history.unshift({
            ...sprintData,
            launchedAt: new Date().toISOString(),
            id: `sprint-${Date.now()}`,
        });
        // Keep only last 10 sprints
        const trimmed = history.slice(0, 10);
        localStorage.setItem(STORAGE_KEYS.SPRINT_HISTORY, JSON.stringify(trimmed));
        return true;
    } catch (error) {
        console.error('Failed to add to sprint history:', error);
        return false;
    }
}

/**
 * Get sprint history
 */
export function getSprintHistory() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.SPRINT_HISTORY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to get sprint history:', error);
        return [];
    }
}

/**
 * Clear sprint history
 */
export function clearSprintHistory() {
    try {
        localStorage.removeItem(STORAGE_KEYS.SPRINT_HISTORY);
        return true;
    } catch (error) {
        console.error('Failed to clear sprint history:', error);
        return false;
    }
}

/**
 * Save user preferences
 */
export function saveUserPreferences(preferences) {
    try {
        const existing = getUserPreferences();
        const updated = { ...existing, ...preferences };
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Failed to save user preferences:', error);
        return false;
    }
}

/**
 * Get user preferences
 */
export function getUserPreferences() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        return saved ? JSON.parse(saved) : {
            defaultCapacity: 20,
            defaultCapacityMode: 'conservative',
            defaultDebtPercent: 10,
        };
    } catch (error) {
        console.error('Failed to get user preferences:', error);
        return {
            defaultCapacity: 20,
            defaultCapacityMode: 'conservative',
            defaultDebtPercent: 10,
        };
    }
}

/**
 * Clear all Align data from localStorage
 */
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

export default {
    saveDraftStrategy,
    getDraftStrategy,
    saveRefinedTicket,
    getRefinedTickets,
    getRefinedTicket,
    saveCurrentSprint,
    getCurrentSprint,
    addToSprintHistory,
    getSprintHistory,
    clearSprintHistory,
    saveUserPreferences,
    getUserPreferences,
    clearAllData,
};
