import React from 'react';
import { useParams } from 'react-router-dom';

const PodcastPage: React.FC = () => {
  const { id } = useParams(); // Pega o ID da URL

  return (
    <div>
      <h1>Podcast {id}</h1>
      <p>Detalhes sobre o Podcast com ID: {id}</p>
    </div>
  );
};

export default PodcastPage;
