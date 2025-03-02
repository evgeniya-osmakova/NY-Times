import React from 'react';
import loader from '../../assets/icons/loader.svg';

import styles from './LoadingSpinner.module.css';


export const LoadingSpinner: React.FC = () => {
    return (
        <div className={styles.container}>
            <img src={loader} alt="Loading..." className={styles.spinner} />
        </div>
    );
};
