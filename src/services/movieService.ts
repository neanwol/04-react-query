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

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<MoviesResponse> => {
  try {
    const { data } = await axiosInstance.get<MoviesResponse>('/search/movie', {
      params: {
        query,
        page,
        language: 'en-US',
        include_adult: false,
      },
    });
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const fetchTrendingMovies = async (
  page: number = 1
): Promise<MoviesResponse> => {
  try {
    const { data } = await axiosInstance.get<MoviesResponse>('/trending/movie/week', {
      params: {
        page,
        language: 'en-US',
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};