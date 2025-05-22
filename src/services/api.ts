import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getPodcasts = async () => {
  try {
    const response = await axios.get(`${API_URL}/podcasts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error;
  }
};

export const getPodcastById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/podcasts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching podcast details:', error);
    throw error;
  }
};
