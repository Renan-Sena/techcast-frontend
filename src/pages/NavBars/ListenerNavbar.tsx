import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';

interface DashboardNavbarProps {
  userName?: string;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ userName }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path, { state: { user: { name: userName } } });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={isActive('/dashboard') ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem} onClick={() => goTo('/dashboard')}>
        <FontAwesomeIcon icon={faHome} style={styles.navIcon} />
        <span style={styles.navText}>inicio</span>
      </div>

      <div style={isActive('/search') ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem} onClick={() => goTo('/search')}>
        <FontAwesomeIcon icon={faSearch} style={styles.navIcon} />
        <span style={styles.navText}>Pesquisar</span>
      </div>

      <div style={isActive('/profile') ? { ...styles.navItem, ...styles.activeNavItem } : styles.navItem} onClick={() => goTo('/profile')}>
        <FontAwesomeIcon icon={faUser} style={styles.navIcon} />
        <span style={styles.navText}>Perfil</span>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,             // aqui está o segredo: fixa à esquerda
    height: '100vh',
    width: '80px',
    backgroundColor: '#121212',
    borderRight: '1px solid #333',  // borda do lado direito da sidebar
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    gap: '30px',
    zIndex: 1000,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#aaa',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'color 0.3s',
    userSelect: 'none',
    padding: '5.0rem 0'
  },
  activeNavItem: {
    color: '#1E90FF',
  },
  navIcon: {
    fontSize: '1.8rem',
    marginBottom: '5px',
  },
  navText: {
    fontSize: '0.7rem',
    whiteSpace: 'nowrap',
  },
};

export default DashboardNavbar;
