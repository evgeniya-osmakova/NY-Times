import React from 'react';
import menu from '../../assets/icons/hamburger.svg';

import styles from './Header.module.css';


interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className={styles.header}>
            <button className={styles.menuButton} onClick={onMenuClick}>
                <img src={menu} alt="Menu" className={styles.menuIcon} />
            </button>

            <h1 className={styles.title}>BESIDER</h1>
        </header>
    );
};
