import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { NewsArticle, NewsState } from '../types/news.types'
import { fetchNewsByDate } from '../services/api'
import { formatDate, getPrevMonth } from '../utils/date'

const initialState: NewsState = {
    articles: [],
    groupedArticles: [],
    visibleArticles: [],
    loading: false,
    loadingMore: false,
    error: null,
    paginationError: null,
    displayLimit: 10,
    currentDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    }
};

const sortArticles = (articles: NewsArticle[]): NewsArticle[] => {
    // Sort by publication date descending
    return articles.sort((a, b) =>
        new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime()
    );
};

const groupArticles = (articles: NewsArticle[]): [string, NewsArticle[]][] => {
    const groups = articles.reduce((acc, article) => {
        const date = formatDate(article.pub_date);

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push(article);

        return acc;
    }, {} as Record<string, NewsArticle[]>);

    return Object.entries(groups).sort(([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime()
    );
};

export const fetchNews = createAsyncThunk(
    'news/fetchNews',
    async ({ year, month }: { year: number; month: number }) => {
        return await fetchNewsByDate(year, month);
    }
);

export const loadNextMonth = createAsyncThunk(
    'news/loadNextMonth',
    async (_, { getState }) => {
        const state = getState() as { news: NewsState };
        const { year, month } = state.news.currentDate;

        const { year: prevYear, month: prevMonth } = getPrevMonth(year, month);

        const result = await fetchNewsByDate(prevYear, prevMonth);
        return { result, prevYear, prevMonth };
    }
);

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        increaseDisplayLimit: (state) => {
            state.displayLimit += 10;
            state.visibleArticles = groupArticles(state.articles.slice(0, state.displayLimit));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNews.fulfilled, (state, action) => {
                state.loading = false;

                if (state.articles.length === 0 || action.meta.arg.month !== state.currentDate.month) {
                    state.articles = sortArticles(action.payload.response.docs);
                } else {
                    const existingIds = new Set(state.articles.map(article => article._id));
                    const newArticles = action.payload.response.docs.filter(
                        article => !existingIds.has(article._id)
                    );

                    if (newArticles.length > 0) {
                        const sortedArticles = sortArticles(newArticles);

                        state.articles = [...sortedArticles, ...state.articles,];
                    }
                }

                state.groupedArticles = groupArticles(state.articles);

                state.visibleArticles = groupArticles(state.articles.slice(0, state.displayLimit));
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch news';
            })
            .addCase(loadNextMonth.pending, (state) => {
                state.loadingMore = true;
                state.paginationError = null;
            })
            .addCase(loadNextMonth.fulfilled, (state, action) => {
                state.loadingMore = false;
                const sortedArticles = sortArticles(action.payload.result.response.docs);
                state.articles = [...state.articles, ...sortedArticles];
                state.groupedArticles = groupArticles(state.articles);
                state.visibleArticles = groupArticles(state.articles.slice(0, state.displayLimit));

                state.currentDate = {
                    year: action.payload.prevYear,
                    month: action.payload.prevMonth
                };
            })
            .addCase(loadNextMonth.rejected, (state, action) => {
                state.loadingMore = false;
                state.paginationError = action.error.message || 'Failed to load more news';
            });
    }
});

export const { increaseDisplayLimit } = newsSlice.actions;
export default newsSlice.reducer;
