import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCopy, 
  faCog,
  faBell,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

import SidebarNavbar from './NavBars/ListenerNavbar'; 
import { API_BASE_URL } from '../config/api';

interface User {
  id: number;
  username: string;
  email: string;
}

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar perfil');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const copyToClipboard = () => {
    if (user?.id) {
      navigator.clipboard.writeText(String(user.id));
      setCopySuccess('ID copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const goTo = (path: string) => {
    navigate(path, { state: { user } });
  };

  const isActive = (path: string) => location.pathname === path;

  const handleSettings = () => alert('Configurações clicado');
  const handleNotifications = () => alert('Notificações clicado');
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <p style={{ color: '#fff', padding: '2rem' }}>Carregando...</p>;
  if (error) return <p style={{ color: '#f00', padding: '2rem' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <SidebarNavbar userName={user?.username} />

      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.infoRow}>
            <strong>ID:</strong>
            <span style={styles.infoText}>{user?.id}</span>
            <button onClick={copyToClipboard} style={styles.copyButton} title="Copiar ID">
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>

          {copySuccess && <span style={styles.copySuccess}>{copySuccess}</span>}

          <div style={styles.infoRow}>
            <strong>Username:</strong>
            <span style={styles.infoText}>{user?.username}</span>
          </div>

          <div style={styles.infoRow}>
            <strong>Email:</strong>
            <span style={styles.infoText}>{user?.email}</span>
          </div>
        </div>

        <section style={styles.section}>
          <div style={styles.optionsContainer}>
            <div style={styles.optionItem} onClick={handleSettings}>
              <FontAwesomeIcon icon={faCog} style={styles.optionIcon} />
              <span>Configurações</span>
            </div>

            <div style={styles.optionItem} onClick={handleNotifications}>
              <FontAwesomeIcon icon={faBell} style={styles.optionIcon} />
              <span>Notificações</span>
            </div>

            <div style={styles.optionItem} onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} style={styles.optionIcon} />
              <span>Sair</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
  },
  page: {
    flex: 1,
    paddingLeft: '80px',
    paddingBottom: '80px',
  },
  header: {
    padding: '2rem',
    backgroundColor: '#1F1F1F',
    borderBottom: '1px solid #333',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
  },
  infoText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: '#1E90FF',
    border: 'none',
    borderRadius: '5px',
    padding: '0.3rem 0.5rem',
    cursor: 'pointer',
    color: '#fff',
  },
  copySuccess: {
    color: '#4CAF50',
    fontSize: '0.9rem',
    marginTop: '-0.5rem',
    marginBottom: '0.75rem',
    display: 'inline-block',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px',
  },
  optionItem: {
    backgroundColor: '#1F1F1F',
    padding: '1rem',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#fff',
    transition: 'background-color 0.3s',
  },
  optionIcon: {
    color: '#1E90FF',
  },
  section: {
    padding: '2rem',
  },
};

export default ProfilePage;
