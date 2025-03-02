import React, { useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { NewsCard } from '../NewsCard/NewsCard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { loadNextMonth, increaseDisplayLimit } from '../../store/newsSlice';
import { Error } from '../Error/Error.tsx'

import styles from './NewsList.module.css';

export const NewsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        articles,
        displayLimit,
        visibleArticles,
        loadingMore,
        paginationError
    } = useAppSelector(state => state.news);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const handleIntersection = useCallback(async (entries: IntersectionObserverEntry[]) => {
        const loadMoreTrigger = entries[0];

        if (loadMoreTrigger.isIntersecting && !loadingMore && !paginationError) {
            if (displayLimit >= articles.length) {
                await dispatch(loadNextMonth());
            } else {
                dispatch(increaseDisplayLimit());
            }
        }
    }, [articles.length, displayLimit, dispatch, loadingMore, paginationError]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [handleIntersection]);

    return (
        <div className={styles.newsList}>
            {visibleArticles.map(([date, articles]) => (
                <div key={date} className={styles.cardGroup}>
                    <h2 className={styles.groupHeader}>News for {date}</h2>

                    <div className={styles.cardList}>
                        {articles.map(article => (
                            <NewsCard key={article._id} article={article} />
                        ))}
                    </div>
                </div>
            ))}

            <div ref={loadMoreRef} className={styles.loadMore}>
                {loadingMore && <LoadingSpinner />}

                {paginationError && (
                    <Error
                        message={paginationError}
                        onClick={() => dispatch(loadNextMonth())}
                    />
                )}
            </div>
        </div>
    );
};
