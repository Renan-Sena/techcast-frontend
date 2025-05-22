import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faUserShield,
  faPlus,
  faUser,
  faPodcast,
  faCog,
  faSignOutAlt,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import AdminNavbar from './NavBars/AdminNavbar';
import { Navigate, useNavigate } from 'react-router';
import { API_BASE_URL } from '../config/api';


interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface Episode {
  id: number;
  title: string;
  description: string;
}

interface Profile {
  id: number;
  username: string;
  email: string;
}

 // <== Substitua pela sua URL do Onrender!

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newEpisodeTitle, setNewEpisodeTitle] = useState('');
  const [newEpisodeDescription, setNewEpisodeDescription] = useState('');
  const [newEpisodeAudio, setNewEpisodeAudio] = useState<File | null>(null);
  const [newEpisodeImage, setNewEpisodeImage] = useState<File | null>(null);

  const [activeTab, setActiveTab] = useState<'users' | 'episodes' | 'profile'>('users');

  const [profile, setProfile] = useState<Profile | null>(null);

  // Novo estado para filtro de usuários
  const [userSearch, setUserSearch] = useState('');

  const [episodeSearch, setEpisodeSearch] = useState('');

  useEffect(() => {
    fetchAdminData();
    fetchUserProfile();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const [resUsers, resEpisodes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/admin/episodes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!resUsers.ok || !resEpisodes.ok) throw new Error('Erro ao buscar dados');

      const usersData = await resUsers.json();
      const episodesData = await resEpisodes.json();

      setUsers(usersData);
      setEpisodes(episodesData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = () => {
    const storedId = Number(localStorage.getItem('id')) || 0;
    const storedUsername = localStorage.getItem('username') || 'AdminUser';
    const storedEmail = localStorage.getItem('email') || 'admin@example.com';

    setProfile({ id: storedId, username: storedUsername, email: storedEmail });
  };

  const promoteToAdmin = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/promote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao promover usuário');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Erro inesperado');
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao excluir usuário');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Erro inesperado');
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewEpisodeImage(e.target.files[0]);
    }
  };

  const addEpisode = async () => {
    if (!newEpisodeTitle.trim()) {
      alert('Título do episódio é obrigatório');
      return;
    }
    if (!newEpisodeImage || !newEpisodeAudio) {
      alert('Imagem e áudio são obrigatórios');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('title', newEpisodeTitle);
      formData.append('description', newEpisodeDescription);
      formData.append('image', newEpisodeImage); // ✅ correto
      formData.append('audio', newEpisodeAudio); // ✅ correto

      const res = await fetch(`${API_BASE_URL}/api/admin/episodes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // ✅ Não colocar 'Content-Type' quando usar FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao adicionar episódio');
      }

      alert('Episódio adicionado com sucesso!');
      setNewEpisodeTitle('');
      setNewEpisodeDescription('');
      setNewEpisodeImage(null);
      setNewEpisodeAudio(null);

      fetchAdminData(); // Atualiza a lista
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Ações de exemplo para alertas
  const handleSettings = () => alert('Abrir configurações');
  const handlePrivacy = () => alert('Abrir privacidade');
  const handleNotifications = () => alert('Abrir notificações');

  // Filtra usuários pela busca (id, username ou email)
  const filteredUsers = users.filter((user) => {
    const searchLower = userSearch.toLowerCase();
    return (
      user.id.toString().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const filteredEpisodes = episodes.filter(
    (ep) =>
      ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) ||
      ep.id.toString() === episodeSearch
  );

  if (loading)
    return (
      <div style={styles.page}>
        <p>Carregando dados administrativos...</p>
      </div>
    );
  if (error)
    return (
      <div style={{ ...styles.page, color: 'red' }}>
        <p>Erro: {error}</p>
      </div>
    );

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleDeleteEpisode = async (episodeId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este episódio?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/episodes/${episodeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao excluir episódio');
      }

      alert('Episódio excluído com sucesso!');
      fetchAdminData(); // atualiza a lista de episódios
    } catch (err: any) {
      alert(err.message || 'Erro inesperado ao excluir episódio');
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Painel Administrativo</h1>
        <p style={styles.subtitle}>Gerencie usuários, episódios e seu perfil</p>
        {activeTab === 'profile' && profile && (
          <div style={styles.profileInfo}>
            <p>
              <strong>ID:</strong> {profile.id}
            </p>
            <p>
              <strong>Usuário:</strong> {profile.username}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
          </div>
        )}
      </header>

      {activeTab === 'users' && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Usuários Cadastrados</h2>

          <input
            type="text"
            placeholder="Pesquisar por ID, usuário ou email"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            style={styles.searchInput}
          />

          {filteredUsers.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Usuário</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>{user.id}</td>
                    <td style={styles.td}>{user.username}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.isAdmin ? 'Admin' : 'Usuário'}</td>
                    <td style={styles.td}>
                      {!user.isAdmin && (
                        <button style={styles.actionButton} onClick={() => promoteToAdmin(user.id)}>
                          <FontAwesomeIcon icon={faUserShield} /> Tornar Admin
                        </button>
                      )}
                      <button
                        style={{ ...styles.actionButton, background: '#e53e3e', marginLeft: 8 }}
                        onClick={() => deleteUser(user.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {activeTab === 'episodes' && (
        <>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Adicionar Episódio</h2>
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Título do episódio"
                value={newEpisodeTitle}
                onChange={(e) => setNewEpisodeTitle(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <textarea
                placeholder="Descrição do episódio"
                value={newEpisodeDescription}
                onChange={(e) => setNewEpisodeDescription(e.target.value)}
                style={{ ...styles.input, height: 80 }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label>
                Imagem do episódio:
                <input type="file" accept="image/*" onChange={onImageChange} />
              </label>
            </div>
            <div style={styles.inputGroup}>
              <label>
                Áudio do episódio:
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setNewEpisodeAudio(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            <button style={styles.addButton} onClick={addEpisode}>
              <FontAwesomeIcon icon={faPlus} /> Adicionar Episódio
            </button>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Episódios Cadastrados</h2>

            <input
              type="text"
              placeholder="Pesquisar episódios por título ou ID"
              value={episodeSearch}
              onChange={(e) => setEpisodeSearch(e.target.value)}
              style={styles.searchInput}
            />

            {filteredEpisodes.length === 0 ? (
              <p>Nenhum episódio encontrado.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Título</th>
                    <th style={styles.th}>Descrição</th>
                    <th style={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEpisodes.map((ep) => (
                    <tr key={ep.id} style={styles.tr}>
                      <td style={styles.td}>{ep.id}</td>
                      <td style={styles.td}>{ep.title}</td>
                      <td style={styles.td}>{ep.description}</td>
                      <td style={styles.td}>
                        <button
                          style={{ ...styles.actionButton, background: '#e53e3e' }}
                          onClick={() => handleDeleteEpisode(ep.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}

      {activeTab === 'profile' && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Configurações do Perfil</h2>
          <p>Aqui você pode alterar configurações pessoais e preferências.</p>

          <div style={styles.settingsButtons}>
            <button style={styles.actionButton} onClick={handleSettings}>
              <FontAwesomeIcon icon={faCog} /> Configurações
            </button>
            <button style={styles.actionButton} onClick={handlePrivacy}>
              <FontAwesomeIcon icon={faUser} /> Privacidade
            </button>
            <button style={styles.actionButton} onClick={handleNotifications}>
              <FontAwesomeIcon icon={faBell} /> Notificações
            </button>
          </div>
        </section>
      )}

      <footer style={styles.footer}>
        <nav style={styles.nav}>
          <button
            style={{ ...styles.navButton, ...(activeTab === 'users' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('users')}
          >
            <FontAwesomeIcon icon={faUser} /> Usuários
          </button>
          <button
            style={{ ...styles.navButton, ...(activeTab === 'episodes' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('episodes')}
          >
            <FontAwesomeIcon icon={faPodcast} /> Episódios
          </button>
          <button
            style={{ ...styles.navButton, ...(activeTab === 'profile' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('profile')}
          >
            <FontAwesomeIcon icon={faUser} /> Perfil
          </button>
          <button style={styles.navButton} onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Sair
          </button>
        </nav>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    maxWidth: 900,
    margin: '40px auto',
    padding: '0 15px',
    fontFamily: 'Arial, sans-serif',
    color: '#222',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  profileInfo: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 12,
  },
  searchInput: {
    width: '100%',
    padding: 8,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #ccc',
    padding: 8,
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: 8,
  },
  actionButton: {
    padding: '6px 10px',
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#3182ce',
    color: 'white',
    cursor: 'pointer',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  input: {
    width: '100%',
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  addButton: {
    backgroundColor: '#38a169',
    padding: '10px 16px',
    borderRadius: 4,
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
  },
  footer: {
    borderTop: '1px solid #ccc',
    paddingTop: 20,
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  navButton: {
    border: 'none',
    background: 'none',
    color: '#555',
    fontSize: 14,
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#3182ce',
    color: 'white',
  },
  settingsButtons: {
    display: 'flex',
    gap: 10,
  },
};

export default AdminPage;
