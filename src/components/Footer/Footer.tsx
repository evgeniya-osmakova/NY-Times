import React from 'react';
import logo from '../../assets/icons/logo.svg';

import styles from './Footer.module.css';


const footerLinks = [
    { text: 'Log In', href: '#' },
    { text: 'About Us', href: '#' },
    { text: 'Publishers', href: '#' },
    { text: 'Sitemap', href: '#' }
];

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <nav className={styles.nav}>
                {footerLinks.map(link => (
                    <a
                        key={link.text}
                        href={link.href}
                        className={styles.link}
                    >
                        {link.text}
                    </a>
                ))}
            </nav>
            <div className={styles.poweredBy}>
                Powered by <img src={logo} alt="Logo" className={styles.logo} />
            </div>
            <div className={styles.copyright}>
                © {currentYear} Besider. Inspired by Insider
            </div>
        </footer>
    );
};
