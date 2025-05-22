import React, { useState, useEffect } from 'react';
import { fetchEpisodes } from '../services/api';
import PodcastCard from './PodcastCard';
import '../styles/PodcastList.css';

const PodcastList: React.FC = () => {
  const [podcasts, setPodcasts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const data = await fetchEpisodes(token);
        setPodcasts(data);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      }
    };
    fetchPodcasts();
  }, []);

  return (
    <div className="podcast-list">
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
};

export default PodcastList;
