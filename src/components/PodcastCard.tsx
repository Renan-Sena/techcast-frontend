import React from 'react';
import '../styles/PodcastCard.css';

interface Podcast {
  id: number;
  title: string;
  description: string;
}

const PodcastCard: React.FC<{ podcast: Podcast }> = ({ podcast }) => {
  return (
    <div className="podcast-card">
      <h3>{podcast.title}</h3>
      <p>{podcast.description}</p>
    </div>
  );
};

export default PodcastCard;
