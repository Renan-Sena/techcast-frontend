import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPodcast, faIdBadge, faCog, faShieldAlt, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface AdminNavbarProps {
  activeTab: 'users' | 'episodes' | 'profile';
  setActiveTab: (tab: 'users' | 'episodes' | 'profile') => void;
  onSettings?: () => void;
  onPrivacy?: () => void;
  onNotifications?: () => void;
  onLogout?: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  activeTab,
  setActiveTab,
  onSettings,
  onPrivacy,
  onNotifications,
  onLogout,
}) => {
  return (
    <nav style={styles.navbar}>
      {/* Abas principais */}
      <button
        onClick={() => setActiveTab('users')}
        style={{ ...styles.navButton, ...(activeTab === 'users' ? styles.navButtonActive : {}) }}
      >
        <FontAwesomeIcon icon={faUser} size="lg" />
        <span style={styles.navLabel}>Usuários</span>
      </button>

      <button
        onClick={() => setActiveTab('episodes')}
        style={{ ...styles.navButton, ...(activeTab === 'episodes' ? styles.navButtonActive : {}) }}
      >
        <FontAwesomeIcon icon={faPodcast} size="lg" />
        <span style={styles.navLabel}>Episódios</span>
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        style={{ ...styles.navButton, ...(activeTab === 'profile' ? styles.navButtonActive : {}) }}
      >
        <FontAwesomeIcon icon={faIdBadge} size="lg" />
        <span style={styles.navLabel}>Perfil</span>
      </button>

      {/* Botões de ações */}
      {onSettings && (
        <button onClick={onSettings} style={styles.actionButton} title="Configurações">
          <FontAwesomeIcon icon={faCog} size="lg" />
        </button>
      )}
      {onPrivacy && (
        <button onClick={onPrivacy} style={styles.actionButton} title="Privacidade">
          <FontAwesomeIcon icon={faShieldAlt} size="lg" />
        </button>
      )}
      {onNotifications && (
        <button onClick={onNotifications} style={styles.actionButton} title="Notificações">
          <FontAwesomeIcon icon={faBell} size="lg" />
        </button>
      )}
      {onLogout && (
        <button onClick={onLogout} style={styles.actionButton} title="Sair">
          <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </button>
      )}
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1F1F1F',
    borderTop: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0.5rem 0',
    zIndex: 1000,
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#bbb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    minWidth: 60,
  },
  navButtonActive: {
    color: '#1E90FF',
  },
  navLabel: {
    fontSize: '0.75rem',
    marginTop: '0.2rem',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    color: '#bbb',
    cursor: 'pointer',
    padding: '0 10px',
    transition: 'color 0.3s ease',
    fontSize: '1.25rem',
  },
};

export default AdminNavbar;
