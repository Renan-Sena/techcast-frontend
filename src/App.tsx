import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PodcastPage from './pages/PodcastPage';
import CreatePodcastPage from './pages/CreatePodcastPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import ProfilePage from './pages/profilePage';
import AdminPage from './pages/adminPage';

import { PlayerProvider } from './pages/NavBars/PlayerContext';  // ✅ ajuste o caminho conforme onde salvar
import PlayerBar from './pages/NavBars/PlayBAr';               // ✅ ajuste o caminho conforme onde salvar

function NotFound() {
  return <h1>Página não encontrada</h1>;
}

const App: React.FC = () => {
  return (
    <Router>
      <PlayerProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/podcast/:id" element={<PodcastPage />} />
          <Route path="/create" element={<CreatePodcastPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <PlayerBar />  {/* ✅ Sempre renderizado */}
      </PlayerProvider>
    </Router>
  );
};

export default App;
