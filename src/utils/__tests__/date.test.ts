import { describe, it, expect } from 'vitest';
import { formatDate, formatArticleDate, getPrevMonth } from '../date';

describe('date utils', () => {
    describe('formatDate', () => {
        it('should format date string to DD.MM.YYYY format', () => {
            const testCases = [
                { input: '2024-03-05T10:30:00Z', expected: '05.03.2024' }, // single-digit day
                { input: '2024-03-15T10:30:00Z', expected: '15.03.2024' }, // double-digit day
                { input: '2024-01-05T15:45:00Z', expected: '05.01.2024' }, // single-digit month
                { input: '2024-12-01T00:00:00Z', expected: '01.12.2024' }, // double-digit month
            ];

            testCases.forEach(({ input, expected }) => {
                expect(formatDate(input)).toBe(expected);
            });
        });
    });

    describe('formatArticleDate', () => {
        it('should format date string to "MMM DD, YYYY, HH:MM AM/PM"', () => {
            const date = new Date('2024-03-15T10:30:00Z');
            const result = formatArticleDate(date.toISOString());

            expect(result).toMatch(/Mar 15, 2024, \d{1,2}:\d{2} [AP]M/);
        });

        it('should handle different times of day', () => {
            const morning = new Date('2024-03-15T09:30:00Z');
            const afternoon = new Date('2024-03-15T14:30:00Z');

            const morningResult = formatArticleDate(morning.toISOString());
            const afternoonResult = formatArticleDate(afternoon.toISOString());

            expect(morningResult).toMatch(/Mar 15, 2024, \d{1,2}:\d{2} AM/);
            expect(afternoonResult).toMatch(/Mar 15, 2024, \d{1,2}:\d{2} PM/);
        });
    });

    describe('getPrevMonth', () => {
        it('should return previous month in the same year', () => {
            expect(getPrevMonth(2024, 3)).toEqual({ year: 2024, month: 2 });
            expect(getPrevMonth(2024, 12)).toEqual({ year: 2024, month: 11 });
        });

        it('should return December of previous year when current month is January', () => {
            expect(getPrevMonth(2024, 1)).toEqual({ year: 2023, month: 12 });
        });
    });
});
