import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCopy, 
  faHome, 
  faSearch, 
  faMicrophone,
  faCog,
  faUserShield,
  faBell,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';

// Importar sua Navbar lateral aqui
import SidebarNavbar from './NavBars/ListenerNavbar'; // ou o nome correto

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
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/profile', {
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

    fetchProfile();
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

  // Handlers para as opções extras
  const handleSettings = () => alert('Configurações clicado');
  const handlePrivacy = () => alert('Privacidade clicado');
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
  // container: {
  //   display: 'flex',
  //   minHeight: '100vh',
  //   backgroundColor: '#000',
  //   color: '#fff',
  // },
  page: {
    flex: 1,
    paddingLeft: '80px', // largura do sidebar (ajuste conforme seu navbar)
    paddingBottom: '80px', // espaço para navbar inferior
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
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
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
    marginBottom: 4,
  },
  navText: {
    fontSize: '0.75rem',
  },
  section: {
      padding: '2rem',
    },
};

export default ProfilePage;
