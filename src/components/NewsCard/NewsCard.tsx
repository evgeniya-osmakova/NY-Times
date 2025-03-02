import React from 'react';
import { NewsArticle } from '../../types/news.types';
import { formatArticleDate } from '../../utils/date';
import { IMAGE_BASE_URL } from '../../constants/urls';

import styles from './NewsCard.module.css';

interface NewsCardProps {
    article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
    const media = article.multimedia?.find(media => media.type === 'image');

    const imageUrl = media?.url ? `${IMAGE_BASE_URL}${media.url}` : undefined;

    const handleClick = () => {
        window.open(article.web_url, '_blank');
    };

    return (
        <div className={styles.card} onClick={handleClick}>
            {imageUrl && (
                <div className={styles.image}>
                    <img src={imageUrl} alt={article.abstract} />
                </div>
            )}

            <div className={styles.content}>
                <div className={styles.source}>{article.source}</div>

                <h2 className={styles.title}>{article.abstract}</h2>

                <div className={styles.date}>{formatArticleDate(article.pub_date)}</div>
            </div>
        </div>
    );
};
