// src/services/api.ts
import { API_BASE_URL } from '../config/api';

export async function fetchUsers(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return res.json();
}

export async function fetchEpisodes(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/episodes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao buscar episódios');
  return res.json();
}

export async function promoteUserToAdmin(token: string, userId: number) {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/promote`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao promover usuário');
  return res.json();
}

export async function deleteUser(token: string, userId: number) {
  const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erro ao excluir usuário');
  return res.json();
}

export async function addEpisode(
  token: string,
  title: string,
  description: string,
  image: File,
  audio: File
) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('image', image);
  formData.append('audio', audio);

  const res = await fetch(`${API_BASE_URL}/api/admin/episodes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // NÃO colocar Content-Type pois é FormData
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Erro ao adicionar episódio');
  }
  return res.json();
}

export async function deleteEpisode(token: string, episodeId: number) {
  const res = await fetch(`${API_BASE_URL}/api/episodes/${episodeId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Erro ao excluir episódio');
  }
  return res.json();
}
