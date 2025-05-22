import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Login realizado com sucesso!');
      setLoginSuccess(true);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || 'Erro ao realizar login. Verifique suas credenciais.');
      } else {
        setErrorMessage('Erro ao realizar login. Tente novamente.');
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        username,
        email,
        password,
        role: 'listener',
      });
      alert('Conta criada com sucesso!');
      setIsLogin(true);
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || 'Erro ao criar conta. Verifique os dados e tente novamente.');
      } else {
        setErrorMessage('Erro ao criar a conta. Tente novamente.');
      }
    }
  };

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#121212';
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#fff';
  }, []);

  const handleRoleChoice = (role: 'admin' | 'ouvinte') => {
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎧 TechCast</h1>
      <p>{isLogin ? 'Entre na sua conta' : 'Crie uma nova conta'}</p>

      {!loginSuccess ? (
        <>
          <form onSubmit={isLogin ? handleLogin : handleRegister} style={styles.form}>
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirme a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
            )}
            <button type="submit" style={styles.submitButton}>
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage('');
            }}
            style={styles.switchButton}
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </>
      ) : (
        <>
          <p style={styles.successMessage}>Login realizado com sucesso!</p>
          <p style={{ marginTop: 10 }}>Escolha como deseja continuar:</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => handleRoleChoice('admin')} style={styles.submitButton}>
              Entrar como Admin
            </button>
            <button onClick={() => handleRoleChoice('ouvinte')} style={styles.submitButton}>
              Entrar como Ouvinte
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#121212',
    color: '#fff',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#1E90FF',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  input: {
    width: '96%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    fontSize: '1rem',
  },
  submitButton: {
    width: '96%',
    padding: '10px',
    backgroundColor: '#1E90FF',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '1rem',
    textAlign: 'center',
  },
  switchButton: {
    marginTop: '15px',
    background: 'none',
    border: 'none',
    color: '#1E90FF',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  errorMessage: {
    color: 'red',
    fontSize: '1rem',
    marginTop: '10px',
  },
  successMessage: {
    color: '#4BB543', // verde sucesso
    fontSize: '1.2rem',
    marginTop: '20px',
    fontWeight: 'bold',
    opacity: 0,
    animation: 'fadeIn 0.5s forwards',
  },
};

// Animations CSS (se estiver usando CSS global, adicione no seu CSS):
/*
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
*/

export default HomePage;
