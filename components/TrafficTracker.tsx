'use client'

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { logPageView, updateDwellTime } from '@/lib/actions/analytics.actions';

const generateSessionId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

function TrackerContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const hitIdRef = useRef<string | null>(null);
    const entryTimeRef = useRef<number>(Date.now());

    // Initialize/Retreive Session ID
    useEffect(() => {
        let id = localStorage.getItem('wp_session_id');
        if (!id) {
            id = generateSessionId();
            localStorage.setItem('wp_session_id', id);
        }
        setSessionId(id);
    }, []);

    const sendDwellTime = useCallback(async () => {
        if (hitIdRef.current) {
            const duration = Date.now() - entryTimeRef.current;
            // Fire and forget dwell time update
            updateDwellTime(hitIdRef.current, duration);
        }
    }, []);

    // Track Page Changes
    useEffect(() => {
        if (!sessionId) return;

        const handlePageVisit = async () => {
            // First, update dwell time for the PREVIOUS page if it exists
            await sendDwellTime();

            // Then, log the NEW page visit
            const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            entryTimeRef.current = Date.now();
            
            const result = await logPageView({
                path: fullPath,
                referrer: document.referrer,
                sessionId: sessionId,
                userAgent: navigator.userAgent
            });

            if (result.success && result.hitId) {
                hitIdRef.current = result.hitId;
            }
        };

        handlePageVisit();

        // Cleanup: Send final dwell time when component unmounts or path changes
        return () => {
             // In Next.js, pathname change triggers effect re-run, so we handle PREVIOUS update at the start of the effect
        };
    }, [pathname, searchParams, sessionId, sendDwellTime]);

    // Track Tab Close / Visibility Change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                sendDwellTime();
            } else if (document.visibilityState === 'visible') {
                // User came back, start a new "sub-hit" or just reset entry time?
                // For simplicity, we just reset entry time to measure the new active period
                entryTimeRef.current = Date.now();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', sendDwellTime);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', sendDwellTime);
        };
    }, [sendDwellTime]);

    return null;
}

export default function TrafficTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerContent />
        </Suspense>
    );
}
