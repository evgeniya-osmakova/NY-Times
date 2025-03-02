import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from './redux';
import { fetchNews } from '../store/newsSlice';

const POLLING_INTERVAL = 30 * 1000; // 30 seconds
const THROTTLE_INTERVAL = 10 * 1000; // 10 seconds safety throttle

type Timeout = ReturnType<typeof setTimeout>;

export const useNewsPolling = () => {
    const dispatch = useAppDispatch();
    const pollingInterval = useRef<Timeout | undefined>(undefined);
    const lastFetchTime = useRef<number>(0);

    const fetchLatestNews = useCallback(async () => {
        const now = Date.now();

        if (now - lastFetchTime.current < THROTTLE_INTERVAL) {
            return;
        }

        try {
            await dispatch(fetchNews({
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
            })).unwrap();

            lastFetchTime.current = now;
        } catch (error) {
            console.error('Failed to fetch news:', error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchLatestNews();
        pollingInterval.current = setInterval(fetchLatestNews, POLLING_INTERVAL);

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [fetchLatestNews]);

    return {
        refresh: fetchLatestNews
    };
};
