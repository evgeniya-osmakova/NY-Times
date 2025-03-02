import React from 'react'

import styles from './Error.module.css'

interface ErrorProps {
    onClick: () => void;
    message: string;
}

export const Error: React.FC<ErrorProps> = ({ onClick, message }) => {
    return (
        <div className={styles.error}>
            <h3 className={styles.errorTitle}>Error loading news</h3>
            <p className={styles.errorMessage}>{message}</p>

            <button
                onClick={onClick}
                className={styles.retryButton}
            >
                Try Again
            </button>
        </div>
    )
}
