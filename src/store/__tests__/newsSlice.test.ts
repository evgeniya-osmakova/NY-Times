import { describe, it, expect } from 'vitest';
import reducer, { increaseDisplayLimit, fetchNews, loadNextMonth } from '../newsSlice';
import { NewsArticle } from '../../types/news.types';

describe('news reducer', () => {
    const mockArticle: NewsArticle = {
        _id: '1',
        web_url: 'https://example.com',
        abstract: 'Test Article',
        multimedia: [],
        pub_date: '2024-03-15T10:30:00Z',
        source: 'The New York Times'
    };

    const initialState = {
        articles: [],
        groupedArticles: [],
        visibleArticles: [],
        loading: false,
        loadingMore: false,
        error: null,
        paginationError: null,
        displayLimit: 10,
        currentDate: {
            year: 2024,
            month: 3
        }
    };

    describe('increaseDisplayLimit', () => {
        it('should increase display limit by 10', () => {
            const nextState = reducer(initialState, increaseDisplayLimit());
            expect(nextState.displayLimit).toBe(20);
        });

        it('should update visibleArticles when increasing limit', () => {
            const stateWithArticles = {
                ...initialState,
                articles: Array(15)
                    .fill(mockArticle)
                    .map((article, index) => ({
                        ...article,
                        _id: String(index),
                        pub_date: `2024-03-15T10:${30 + index}:00Z`
                    }))
            };

            const nextState = reducer(stateWithArticles, increaseDisplayLimit());
            expect(nextState.displayLimit).toBe(20);
            expect(nextState.visibleArticles.length).toBeGreaterThan(0);
        });
    });

    describe('fetchNews', () => {
        it('should set loading true when pending', () => {
            const nextState = reducer(initialState, fetchNews.pending('', { year: 2024, month: 3 }));
            expect(nextState.loading).toBe(true);
            expect(nextState.error).toBe(null);
        });

        it('should handle fulfilled state with new articles when state is empty', () => {
            const mockResponse = {
                status: 'OK',
                copyright: '2024 The New York Times',
                response: {
                    docs: [mockArticle],
                    meta: {
                        hits: 1,
                        offset: 0,
                        time: 50
                    }
                }
            };

            const nextState = reducer(
                initialState,
                fetchNews.fulfilled(mockResponse, '', { year: 2024, month: 3 })
            );

            expect(nextState.loading).toBe(false);
            expect(nextState.articles.length).toBe(1);
            expect(nextState.articles[0]._id).toBe(mockArticle._id);
        });

        it('should replace articles if month is different', () => {
            const stateWithArticles = {
                ...initialState,
                articles: [mockArticle],
                currentDate: { year: 2024, month: 3 }
            };

            const newArticle: NewsArticle = {
                _id: '2',
                web_url: 'https://example2.com',
                abstract: 'Another Article',
                multimedia: [],
                pub_date: '2024-04-01T12:00:00Z',
                source: 'The New York Times'
            };

            const mockResponse = {
                status: 'OK',
                copyright: '2024 The New York Times',
                response: {
                    docs: [newArticle],
                    meta: {
                        hits: 1,
                        offset: 0,
                        time: 50
                    }
                }
            };

            const nextState = reducer(
                stateWithArticles,
                fetchNews.fulfilled(mockResponse, '', { year: 2024, month: 4 })
            );

            expect(nextState.articles.length).toBe(1);
            expect(nextState.articles[0]._id).toBe('2');
        });

        it('should merge new articles when month is the same and filter duplicates', () => {
            const stateWithArticles = {
                ...initialState,
                articles: [mockArticle],
                currentDate: { year: 2024, month: 3 }
            };

            const duplicateArticle: NewsArticle = { ...mockArticle };
            const newArticle: NewsArticle = {
                _id: '2',
                web_url: 'https://example2.com',
                abstract: 'New Unique Article',
                multimedia: [],
                pub_date: '2024-03-16T10:30:00Z',
                source: 'The New York Times'
            };

            const mockResponse = {
                status: 'OK',
                copyright: '2024 The New York Times',
                response: {
                    docs: [duplicateArticle, newArticle],
                    meta: {
                        hits: 2,
                        offset: 0,
                        time: 50
                    }
                }
            };

            const nextState = reducer(
                stateWithArticles,
                fetchNews.fulfilled(mockResponse, '', { year: 2024, month: 3 })
            );

            expect(nextState.articles.length).toBe(2);
            expect(nextState.articles[0]._id).toBe('2');
            expect(nextState.articles[1]._id).toBe('1');
        });

        it('should handle rejected state', () => {
            const error = 'Failed to fetch';
            const nextState = reducer(
                initialState,
                fetchNews.rejected(new Error(error), '', { year: 2024, month: 3 })
            );

            expect(nextState.loading).toBe(false);
            expect(nextState.error).toBe(error);
        });

        it('should group articles by publication date', () => {
            const article1: NewsArticle = { ...mockArticle, _id: '1', pub_date: '2024-03-15T10:30:00Z' };
            const article2: NewsArticle = { ...mockArticle, _id: '2', pub_date: '2024-03-15T12:30:00Z' };
            const article3: NewsArticle = { ...mockArticle, _id: '3', pub_date: '2024-03-16T09:00:00Z' };

            const mockResponse = {
                status: 'OK',
                copyright: '2024 The New York Times',
                response: {
                    docs: [article1, article2, article3],
                    meta: {
                        hits: 3,
                        offset: 0,
                        time: 50
                    }
                }
            };

            const nextState = reducer(
                initialState,
                fetchNews.fulfilled(mockResponse, '', { year: 2024, month: 3 })
            );

            expect(nextState.groupedArticles.length).toBe(2);
        });
    });

    describe('loadNextMonth', () => {
        it('should set loadingMore true when pending', () => {
            const nextState = reducer(initialState, loadNextMonth.pending('', undefined));
            expect(nextState.loadingMore).toBe(true);
            expect(nextState.paginationError).toBe(null);
        });

        it('should handle fulfilled state with additional articles', () => {
            const newArticle: NewsArticle = {
                _id: '2',
                web_url: 'https://example2.com',
                abstract: 'Additional Article',
                multimedia: [],
                pub_date: '2024-03-14T10:30:00Z',
                source: 'The New York Times'
            };

            const mockPayload = {
                result: {
                    status: 'OK',
                    copyright: '2024 The New York Times',
                    response: {
                        docs: [newArticle],
                        meta: {
                            hits: 1,
                            offset: 0,
                            time: 50
                        }
                    }
                },
                prevYear: 2024,
                prevMonth: 2
            };

            const stateWithArticles = {
                ...initialState,
                articles: [mockArticle]
            };

            const nextState = reducer(stateWithArticles, loadNextMonth.fulfilled(mockPayload, ''));
            expect(nextState.loadingMore).toBe(false);
            expect(nextState.articles.length).toBe(2);
            expect(nextState.currentDate).toEqual({ year: 2024, month: 2 });
        });

        it('should handle rejected state', () => {
            const error = 'Failed to load more';
            const nextState = reducer(
                initialState,
                loadNextMonth.rejected(new Error(error), '')
            );

            expect(nextState.loadingMore).toBe(false);
            expect(nextState.paginationError).toBe(error);
        });
    });
});
