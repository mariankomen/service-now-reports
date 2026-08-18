const RECENT_KEY = 'connecto_recent_reports';
const MAX_RECENT = 10;

export type RecentReport = {
    id: string;
    name: string;
    salesforceObject?: string;
    serviceNowObject?: string;
    openedAt: string;
};

export const addToRecent = (report: RecentReport) => {
    const existing = getRecent();
    // Remove if already exists
    const filtered = existing.filter(r => r.id !== report.id);
    // Add to front
    const updated = [{ ...report, openedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
};

export const getRecent = (): RecentReport[] => {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch {
        return [];
    }
};