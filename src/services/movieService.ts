import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

if (!API_TOKEN) {
  console.error('VITE_TMDB_TOKEN is not defined in environment variables');
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

interface FetchMoviesParams {
  endpoint: 'trending' | 'search';
  query?: string;
  page?: number;
}

export const fetchMovies = async ({
  endpoint,
  query,
  page = 1,
}: FetchMoviesParams): Promise<MoviesResponse> => {
  try {
    let url: string;
    const params: Record<string, string | number | boolean> = {
      page,
      language: 'en-US',
    };

    if (endpoint === 'trending') {
      url = '/trending/movie/week';
    } else if (endpoint === 'search') {
      if (!query) {
        throw new Error('Search query is required for search endpoint');
      }
      url = '/search/movie';
      params.query = query;
      params.include_adult = false;
    } else {
      throw new Error(`Unknown endpoint: ${endpoint}`);
    }

    const { data } = await axiosInstance.get<MoviesResponse>(url, { params });
    return data;
  } catch (error) {
    console.error(`Error fetching movies from ${endpoint}:`, error);
    throw error;
  }
};