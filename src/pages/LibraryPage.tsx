import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBookOpen, faMicrophone } from '@fortawesome/free-solid-svg-icons';

const savedPodcasts = [
  {
    id: 1,
    title: 'Machine Learning Essencial',
    description: 'Introdução às técnicas de aprendizado de máquina.',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    title: 'História da Computação',
    description: 'Uma viagem pelas origens da computação.',
    image: 'https://via.placeholder.com/150',
  },
];

const LibraryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const goTo = (path: string) => {
    navigate(path, { state: { user } });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Sua Biblioteca</h1>
        <p style={styles.subtitle}>Podcasts que você salvou para ouvir depois:</p>
      </div>

      <div style={styles.podcastList}>
        {savedPodcasts.map((podcast) => (
          <div key={podcast.id} style={styles.card}>
            <img src={podcast.image} alt={podcast.title} style={styles.cardImage} />
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{podcast.title}</h3>
              <p style={styles.cardDescription}>{podcast.description}</p>
              <button style={styles.cardButton}>Ouvir</button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.navbar}>
        <div style={styles.navItem} onClick={() => goTo('/dashboard')}>
          <FontAwesomeIcon icon={faHome} style={{ ...styles.navIcon, color: isActive('/dashboard') ? '#1E90FF' : '#fff' }} />
          <span style={styles.navText}>Home</span>
        </div>
        <div style={styles.navItem} onClick={() => goTo('/search')}>
          <FontAwesomeIcon icon={faSearch} style={{ ...styles.navIcon, color: isActive('/search') ? '#1E90FF' : '#fff' }} />
          <span style={styles.navText}>Pesquisar</span>
        </div>
        <div style={styles.navItem} onClick={() => goTo('/library')}>
          <FontAwesomeIcon icon={faBookOpen} style={{ ...styles.navIcon, color: isActive('/library') ? '#1E90FF' : '#fff' }} />
          <span style={styles.navText}>Biblioteca</span>
        </div>
        <div style={styles.navItem} onClick={() => goTo('/create')}>
          <FontAwesomeIcon icon={faMicrophone} style={{ ...styles.navIcon, color: isActive('/create') ? '#1E90FF' : '#fff' }} />
          <span style={styles.navText}>Criar</span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#000',
    color: '#fff',
    paddingBottom: '80px',
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
  },
  cardTitle: {
    fontSize: '1.2rem',
    margin: '0 0 0.5rem 0',
    color: '#fff',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: '0.9rem',
    color: '#bbb',
  },
  cardButton: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    background: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  },
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: '#121212',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #333',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  navIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.2rem',
  },
  navText: {
    fontSize: '0.75rem',
  },
};

export default LibraryPage;
