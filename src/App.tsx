import React, { useState } from 'react'
import { Header } from './components/Header/Header';
import { NewsList } from './components/NewsList/NewsList';
import { Footer } from './components/Footer/Footer';
import { Menu } from './components/Menu/Menu';
import { useAppSelector } from './hooks/redux';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { useNewsPolling } from './hooks/useNewsPolling'
import { Error } from './components/Error/Error.tsx'

import styles from './App.module.css';

export const App: React.FC = () => {
    const { refresh } = useNewsPolling();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {
        articles,
        loading,
        error
    } = useAppSelector(state => state.news);

    const showLoading = loading && articles.length === 0;

    return (
        <div className={styles.app}>
            <Header onMenuClick={() => setIsMenuOpen(true)} />

            <div className={styles.appContent}>
                <main className={styles.main}>

                    {showLoading && (
                        <LoadingSpinner />
                    )}

                    {error && (
                        <Error
                            message={error}
                            onClick={refresh}
                        />
                    )}

                    {!showLoading && !error && (
                        <NewsList />
                    )}
                </main>

                <Footer />
            </div>

            {isMenuOpen && (
                <Menu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                />
            )}
        </div>
    );
};
