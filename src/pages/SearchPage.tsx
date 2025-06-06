import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardNavbar from './NavBars/ListenerNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { usePlayer } from './NavBars/PlayerContext';
import { Podcast } from '../types/Podcast';
import { API_BASE_URL } from '../config/api';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [externalResults, setExternalResults] = useState<Podcast[]>([]);

  const { currentPodcast, setCurrentPodcast, isPlaying, setIsPlaying } = usePlayer();

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredPodcasts([]);
      setFilteredUsers([]);
      setExternalResults([]);
    } else {
      // Busca podcasts locais
      axios
        .get(`${API_BASE_URL}/api/episodes`, { params: { searchTerm: searchQuery } })
        .then((res) => setFilteredPodcasts(res.data))
        .catch((err) => console.error('Erro ao buscar locais:', err));

      // Busca podcasts externos
      axios
        .get(`${API_BASE_URL}/api/external-podcasts`, { params: { q: searchQuery } })
        .then((res) => {
          const formatted = res.data.episodes.map((ep: any) => ({
            id: ep.id,
            title: ep.title,
            description: ep.description,
            audioUrl: ep.audio,
            imageUrl: ep.image,
          }));
          setExternalResults(formatted);
        })
        .catch((err) => console.error('Erro ao buscar externos:', err));
    }
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const togglePlay = (podcast: Podcast) => {
    if (currentPodcast?.id === podcast.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPodcast(podcast);
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <DashboardNavbar userName={user?.name} />

      <div style={{ flex: 1, marginLeft: '80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', backgroundColor: '#1F1F1F' }}>
          <input
            type="text"
            placeholder="Pesquise por podcasts ou criadores..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: '80%',
              padding: '1rem',
              borderRadius: '50px',
              border: '1px solid #333',
              backgroundColor: '#1A1A1A',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>

        {searchQuery === '' ? (
          <div style={{ padding: '2rem' }}>
            {/* Conteúdo quando não tem busca */}
          </div>
        ) : (
          <div style={styles.podcastList}>
            {filteredPodcasts.length + externalResults.length > 0 ? (
              <>
                {/* Podcasts locais */}
                {filteredPodcasts.map((podcast) => {
                  const isCurrentPlaying = currentPodcast?.id === podcast.id && isPlaying;
                  return (
                    <div key={`local-${podcast.id}`} style={styles.card}>
                      <img
                        src={`${API_BASE_URL}${podcast.imageUrl}`}
                        alt={podcast.title}
                        style={styles.cardImage}
                        onError={(e) => (e.currentTarget.src = '/default.jpg')}
                      />
                      <div style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>{podcast.title}</h3>
                        <p style={styles.cardDescription}>{podcast.description}</p>
                        <button
                          onClick={() => togglePlay(podcast)}
                          style={{
                            ...styles.playButton,
                            boxShadow: isCurrentPlaying ? '0 0 10px rgba(30, 144, 255, 0.7)' : 'none',
                          }}
                          aria-label={isCurrentPlaying ? 'Pausar podcast' : 'Reproduzir podcast'}
                        >
                          <FontAwesomeIcon icon={isCurrentPlaying ? faPause : faPlay} color="#fff" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Podcasts externos */}
                {externalResults.map((podcast) => {
                  const isCurrentPlaying = currentPodcast?.id === podcast.id && isPlaying;
                  return (
                    <div key={`externo-${podcast.id}`} style={styles.card}>
                      <img
                        src={podcast.imageUrl}
                        alt={podcast.title}
                        style={styles.cardImage}
                        onError={(e) => (e.currentTarget.src = '/default.jpg')}
                      />
                      <div style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>{podcast.title}</h3>
                        <p style={styles.cardDescription}>{podcast.description}</p>
                        <button
                          onClick={() => togglePlay(podcast)}
                          style={{
                            ...styles.playButton,
                            boxShadow: isCurrentPlaying ? '0 0 10px rgba(30, 144, 255, 0.7)' : 'none',
                          }}
                          aria-label={isCurrentPlaying ? 'Pausar podcast' : 'Reproduzir podcast'}
                        >
                          <FontAwesomeIcon icon={isCurrentPlaying ? faPause : faPlay} color="#fff" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <p style={{ color: '#bbb', textAlign: 'center', width: '100%' }}>
                Nenhum podcast encontrado para sua pesquisa.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  podcastList: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    padding: '2rem',
  },
  card: {
    position: 'relative',
    width: '250px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#1A1A1A',
    border: '1px solid #333',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderBottom: '1px solid #333',
  },
  cardContent: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    margin: 0,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: '0.9rem',
    color: '#bbb',
  },
  playButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E90FF',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
};

export default SearchPage;
