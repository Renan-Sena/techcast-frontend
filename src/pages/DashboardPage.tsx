import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardNavbar from './NavBars/ListenerNavbar';
import axios from 'axios';
import { Podcast } from '../types/Podcast';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { usePlayer } from './NavBars/PlayerContext';
import { API_BASE_URL } from '../config/api';

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user;

  const { currentPodcast, setCurrentPodcast, isPlaying, setIsPlaying } = usePlayer();

  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [externalResults, setExternalResults] = useState<Podcast[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInternalAndExternal = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [internalRes, externalRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/episodes`),
          axios.get(`${API_BASE_URL}/api/external-podcasts`)
        ]);

        setPodcasts(internalRes.data);
        setExternalResults(externalRes.data);

      } catch (err) {
        setError('Erro ao carregar podcasts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternalAndExternal();
  }, []);

  const togglePlay = (podcast: Podcast) => {
    if (currentPodcast?.id === podcast.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPodcast(podcast);
      setIsPlaying(true);
    }
  };

  return (
    <div style={styles.page}>
      <DashboardNavbar userName={user?.name} />

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Bem-vindo(a), {user?.username || 'Usuário'}!</h1>
          <p style={styles.subtitle}>Confira os podcasts disponíveis:</p>
        </div>

        {loading && <p>Carregando podcasts...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={styles.podcastList}>
          {podcasts.map((podcast) => {
            const isCurrentPlaying = currentPodcast?.id === podcast.id && isPlaying;
            return (
              <div key={podcast.id} style={styles.card}>
                <img
                  src={`${API_BASE_URL}${podcast.imageUrl}`}
                  alt={podcast.title}
                  style={styles.cardImage}
                  onError={(e) => (e.currentTarget.src = '/default.jpg')}
                />
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{podcast.title}</h3>
                  {/* <p style={styles.cardDescription}>{podcast.description}</p> */}

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

          {externalResults.map((podcast) => {
            const isCurrentPlaying = currentPodcast?.id === podcast.id && isPlaying;
            return (
              <div key={podcast.id} style={styles.card}>
                <img
                  src={podcast.imageUrl}
                  alt={podcast.title}
                  style={styles.cardImage}
                  onError={(e) => (e.currentTarget.src = '/default.jpg')}
                />
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{podcast.title}</h3>
                  {/* <p style={styles.cardDescription}>{podcast.description}</p> */}

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
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    paddingLeft: '80px',
    paddingTop: '20px',
  },
  header: {
    padding: '2rem',
    backgroundColor: '#1F1F1F',
    borderBottom: '1px solid #333',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#1E90FF',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#bbb',
  },
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

export default DashboardPage;
