import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bem-vindo ao TechCast!</h1>
      <p>Escolha uma das opções abaixo para navegar:</p>
      
      <div>
        <Link to="/podcast/1" style={{ display: 'block', margin: '10px', fontSize: '18px' }}>
          Ver Podcast 1
        </Link>
        <Link to="/create" style={{ display: 'block', margin: '10px', fontSize: '18px' }}>
          Criar Novo Podcast
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
