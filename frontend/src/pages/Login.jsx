import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  // Estados
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Para mostrar "Cargando..."

  // La dirección del servidor
  const API_URL = 'http://localhost:5000/api/auth';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Empieza la carga

    // Validar campos vacíos
    if (!username.trim() || !password.trim()) {
      setError('Por favor, rellena todos los campos.');
      setLoading(false);
      return;
    }

    // Decidimos si llamar a login o register
    const endpoint = isRegistering ? '/register' : '/login';

    try {
      // --- AQUÍ CONECTAMOS CON EL BACKEND ---
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Le decimos que enviamos JSON
        },
        body: JSON.stringify({ username, password }), // Enviamos los datos
      });

      const data = await response.json(); // Leemos la respuesta del servidor

      if (response.ok) {
        // --- SI TODO VA BIEN (Status 200) ---
        console.log('Éxito:', data);

        // Guardamos al usuario en el navegador para recordar que está logueado
        localStorage.setItem('USUARIO_ACTIVO', JSON.stringify(data.user || { username })); 
        
        // Redirigimos a la Pokédex
        navigate('/');
      } else {
        // --- SI HUBO ERROR (Status 400/500) ---
        // Mostramos el mensaje que nos mandó el servidor
        setError(data.message || 'Ocurrió un error inesperado.');
      }

    } catch (err) {
      setError('Error al conectar con el servidor. ¿Está encendido?');
      console.error(err);
    } finally {
      setLoading(false); // Terminamos la carga
    }
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', background: '#121212', color: 'white' 
    }}>
      <h1>{isRegistering ? 'Únete a la Aventura' : 'Centro Pokémon'}</h1>
      
      <div style={{ 
        background: '#2a2a2a', padding: '40px', borderRadius: '20px', 
        border: '1px solid #444', textAlign: 'center', width: '300px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        
        <h3 style={{ marginBottom: '20px', color: '#FFD700' }}>
          {isRegistering ? 'Crear Entrenador' : 'Iniciar Sesión'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Usuario" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            style={{ padding: '12px', borderRadius: '5px', border: 'none', background: '#444', color: 'white' }}
          />
          
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{ padding: '12px', borderRadius: '5px', border: 'none', background: '#444', color: 'white' }}
          />

          {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: '0' }}>{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '12px', 
              background: loading ? '#666' : (isRegistering ? '#4CAF50' : '#2196F3'), 
              color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', 
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' 
            }}
          >
            {loading ? 'Conectando...' : (isRegistering ? 'Registrarse' : 'Entrar')}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#aaa' }}>
          {isRegistering ? '¿Ya tienes cuenta?' : '¿Eres nuevo?'} <br/>
          <span 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setUsername('');
              setPassword('');
            }}
            style={{ color: '#FFD700', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {isRegistering ? 'Inicia Sesión' : 'Regístrate Gratis'}
          </span>
        </div>

      </div>
    </div>
  );
};

export default Login;