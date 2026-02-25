import { useState, useEffect, useCallback } from 'react';
import { MOCK_EVENTS, POOL_SPLITS } from '../lib/mockData';

// In production: fetch from contract via getEvent() + getEventNonce()
// For now: uses mock data with simulated pool splits
export function useEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Simulate async fetch
            await new Promise(r => setTimeout(r, 600));
            // Enrich events with per-option pools
            const enriched = MOCK_EVENTS.map(e => ({
                ...e,
                pools: POOL_SPLITS[e.id] || {},
            }));
            setEvents(enriched);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    return { events, loading, error, refresh: fetchEvents };
}
