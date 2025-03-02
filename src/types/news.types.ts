export interface NewsArticle {
    abstract: string;
    web_url: string;
    multimedia: Array<{
        url: string;
        type: string;
        height: number;
        width: number;
    }>;
    pub_date: string;
    source: string;
    _id: string;
}

export interface NewsResponse {
    response: {
        docs: NewsArticle[];
        meta: {
            hits: number;
            offset: number;
            time: number;
        };
    };
    status: string;
    copyright: string;
}

export interface NewsState {
    articles: NewsArticle[];
    groupedArticles: [string, NewsArticle[]][];
    visibleArticles: [string, NewsArticle[]][];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    paginationError: string | null;
    displayLimit: number;
    currentDate: {
        year: number;
        month: number;
    };
}
