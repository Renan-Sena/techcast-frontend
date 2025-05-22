import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBookOpen, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_BASE_URL } from '../config/api'; // ajuste o caminho conforme seu projeto

const CreatePodcastPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [isContentPage, setIsContentPage] = useState(false);
  const [views, setViews] = useState(125);
  const [followers, setFollowers] = useState(800);
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const goTo = (path: string) => {
    navigate(path, { state: { user } });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleStart = () => {
    setIsContentPage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audio) {
      alert('Por favor, escolha o áudio do podcast.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('audio', audio);

    try {
      await axios.post(`${API_BASE_URL}/api/episodes/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Podcast criado com sucesso!');
      setIsContentPage(false);
    } catch (error) {
      console.error('Erro ao criar podcast:', error);
      alert('Erro ao criar o podcast.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard de Criação de Podcast</h1>
          <p style={styles.subtitle}>Gerencie seu conteúdo e veja suas estatísticas.</p>
          <button onClick={handleStart} style={styles.startButton}>Iniciar Criação</button>
        </div>

        {isContentPage && (
          <div style={styles.content}>
            <div style={styles.statsContainer}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Visualizações</p>
                <p style={styles.statValue}>{views}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Seguidores</p>
                <p style={styles.statValue}>{followers}</p>
              </div>
            </div>

            <div style={styles.actionsContainer}>
              <button style={styles.actionButton}>Criar Novo Podcast</button>
              <button style={styles.actionButton}>Criar Playlist</button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Título do podcast"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <textarea
                  placeholder="Descrição do podcast"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  style={styles.textarea}
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="audio" style={styles.fileLabel}>Escolher arquivo de áudio</label>
                <input
                  type="file"
                  id="audio"
                  accept="audio/*"
                  onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
                  required
                  style={styles.fileInput}
                />
              </div>

              <button type="submit" style={styles.submitButton}>Publicar Podcast</button>
            </form>
          </div>
        )}
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
    background: 'linear-gradient(to bottom, #1A1A1A, #333)',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    padding: '2rem',
    flex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#bbb',
    marginBottom: '1rem',
  },
  startButton: {
    backgroundColor: '#1DB954',
    color: '#fff',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
  },
  content: {
    backgroundColor: '#222',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#333',
    padding: '1.5rem',
    borderRadius: '10px',
    textAlign: 'center',
    width: '30%',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#bbb',
  },
  statValue: {
    fontSize: '1.5rem',
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  actionButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
    maxWidth: '600px',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#1A1A1A',
    color: '#fff',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    height: '120px',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#1A1A1A',
    color: '#fff',
    fontSize: '1rem',
  },
  fileLabel: {
    display: 'inline-block',
    marginBottom: '0.5rem',
    color: '#bbb',
  },
  fileInput: {
    display: 'none',
  },
  submitButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    padding: '1rem 0',
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  navIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  navText: {
    fontSize: '0.85rem',
    color: '#bbb',
  },
};

export default CreatePodcastPage;
