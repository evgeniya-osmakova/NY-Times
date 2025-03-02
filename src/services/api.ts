import { NewsResponse } from '../types/news.types';

const API_KEY = import.meta.env.VITE_NYT_API_KEY;
if (!API_KEY) {
    throw new Error('NYT API key is not set. Please add VITE_NYT_API_KEY to your .env file');
}

const BASE_URL = '/api/svc/archive/v1';

export const fetchNewsByDate = async (year: number, month: number): Promise<NewsResponse> => {
    try {
        const url = `${BASE_URL}/${year}/${month}.json?api-key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            const errorMessage = responseData.fault?.faultstring ||
                               responseData.message ||
                               `HTTP Error ${response.status}: ${response.statusText}`;

            throw new Error(errorMessage);
        }

        if (!responseData.response?.docs) {
            throw new Error('Invalid API response format: missing docs array');
        }

        return responseData;
    } catch (error) {
        console.error('Error in fetchNewsByDate:', error);

        throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
};
