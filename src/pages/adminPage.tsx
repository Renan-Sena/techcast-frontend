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
  import { API_BASE_URL } from '@/config/api';
  
  // const navigate = useNavigate();


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
    formData.append('image', newEpisodeImage);  // ✅ agora correto
    formData.append('audio', newEpisodeAudio);  // ✅ agora correto
    
    const res = await fetch('${API_BASE_URL}/api/admin/episodes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // ✅ Não colocar 'Content-Type'
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
    const res = await fetch(`http://localhost:3000/api/episodes/${episodeId}`, {
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

    // function handleDeleteEpisode(id: number): void {
    //   throw new Error('Function not implemented.');
    // }

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
                  placeholder="Título"
                  value={newEpisodeTitle}
                  onChange={(e) => setNewEpisodeTitle(e.target.value)}
                  style={styles.input}
                  required
                />

                <textarea
                  placeholder="Descrição"
                  value={newEpisodeDescription}
                  onChange={(e) => setNewEpisodeDescription(e.target.value)}
                  style={styles.input}
                />

                <label>
                  Áudio (formatos aceitos: mp3, wav):
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setNewEpisodeAudio(e.target.files ? e.target.files[0] : null)}
                    style={styles.input}
                    required
                  />
                </label>

                <label>
                  Imagem (formatos aceitos: jpg, png):
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewEpisodeImage(e.target.files ? e.target.files[0] : null)}
                    style={styles.input}
                    required
                  />
                </label>
                <button style={{ ...styles.actionButton, background: '#1DB954' }} onClick={addEpisode}>
                  <FontAwesomeIcon icon={faPlus} /> Adicionar</button>
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Episódios Existentes</h2>

              <input
                type="text"
                placeholder="Pesquisar por ID ou Título"
                value={episodeSearch}
                onChange={(e) => setEpisodeSearch(e.target.value)}
                style={{ ...styles.searchInput, marginBottom: '1rem' }}
              />

              <div style={styles.cardList}>
                {filteredEpisodes.length === 0 ? (
                  <p>Nenhum episódio cadastrado.</p>
                ) : (
                  filteredEpisodes.map((ep) => (
                    <div key={ep.id} style={styles.card}>
                      <div style={styles.cardContent}>
                        <h3 style={styles.cardTitle}>{ep.title}</h3>
                        <p style={styles.cardDescription}>{ep.description}</p>
                        <button
                          style={{ ...styles.actionButton, background: '#e53e3e', marginTop: '0.5rem' }}
                          onClick={() => handleDeleteEpisode(ep.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Excluir
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'profile' && profile && (
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

              <div style={{ ...styles.optionItem, background: '#e53e3e' }} onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} style={styles.optionIcon} />
                <span>Sair</span>
              </div>
            </div>
          </section>
        )}

        <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    );
  };

  const styles: { [key: string]: React.CSSProperties } = {
    page: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh',
      paddingBottom: '4rem',
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
    profileInfo: {
      marginTop: '1rem',
      fontSize: '0.9rem',
      color: '#bbb',
    },
    section: {
      padding: '2rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: '#1E90FF',
    },
    searchInput: {
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid #333',
      fontSize: '1rem',
      backgroundColor: '#1F1F1F',
      color: '#fff',
      width: '100%',
      maxWidth: '400px',
      marginBottom: '1rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#1A1A1A',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    th: {
      textAlign: 'left',
      padding: '0.75rem 1rem',
      backgroundColor: '#222',
      color: '#1E90FF',
      fontWeight: 'bold',
      borderBottom: '1px solid #333',
    },
    tr: {
      borderBottom: '1px solid #333',
    },
    td: {
      padding: '0.75rem 1rem',
      color: '#bbb',
      verticalAlign: 'middle',
    },
    actionButton: {
      padding: '0.3rem 0.6rem',
      background: '#1E90FF',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      transition: 'background-color 0.3s',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '600px',
    },
    input: {
      padding: '0.6rem 1rem',
      borderRadius: '8px',
      border: '1px solid #333',
      fontSize: '1rem',
      backgroundColor: '#1F1F1F',
      color: '#fff',
    },
    cardList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    card: {
      backgroundColor: '#222',
      borderRadius: '12px',
      padding: '1rem',
      flex: '1 1 250px',
      boxShadow: '0 0 5px #1E90FF',
    },
    cardContent: {
      color: '#bbb',
    },
    cardTitle: {
      color: '#1E90FF',
      marginBottom: '0.5rem',
    },
    cardDescription: {
      fontSize: '0.9rem',
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
  };

  export default AdminPage;
function setNewEpisodeAudio(arg0: null) {
  throw new Error('Function not implemented.');
}

