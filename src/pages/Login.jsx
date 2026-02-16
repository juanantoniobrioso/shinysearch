import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Evita que se recargue la página
    if (!username.trim()) return;

    // Guardamos quién es el usuario activo
    localStorage.setItem('USUARIO_ACTIVO', username.trim().toLowerCase());
    navigate('/'); // Lo mandamos al Home
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', background: '#121212', color: 'white' 
    }}>
      <h1>¡Bienvenido Entrenador!</h1>
      <div style={{ 
        background: '#2a2a2a', padding: '40px', borderRadius: '20px', 
        border: '1px solid #444', textAlign: 'center' 
      }}>
        <p>¿Quién eres?</p>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Tu nombre (ej: Ash)" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              padding: '15px', fontSize: '18px', borderRadius: '5px', 
              border: 'none', marginBottom: '20px', width: '200px', textAlign: 'center' 
            }}
          />
          <br />
          <button 
            type="submit" 
            style={{ 
              padding: '10px 30px', background: '#FFD700', color: 'black', 
              fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' 
            }}
          >
            Comenzar Aventura
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;