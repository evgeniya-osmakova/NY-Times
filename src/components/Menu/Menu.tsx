import React from 'react';
import close from '../../assets/icons/close.svg';

import styles from './Menu.module.css';


interface MenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const categories = [
    { text: 'SCIENCE', href: '#' },
    { text: 'GENERAL', href: '#' },
    { text: 'ENTERTAINMENT', href: '#' },
    { text: 'TECHNOLOGY', href: '#' },
    { text: 'BUSINESS', href: '#' },
    { text: 'HEALTH', href: '#' },
    { text: 'SPORTS', href: '#' }
];

export const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.menu}>
            <button className={styles.closeButton} onClick={onClose}>
                <img src={close} alt="Close menu" />
            </button>

            <nav className={styles.navigation}>
                <ul className={styles.categoryList}>
                    {categories.map((category) => (
                        <li key={category.text}>
                            <a href={category.href} className={styles.category}>
                                {category.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};
