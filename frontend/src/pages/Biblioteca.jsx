import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Biblioteca = () => {
  const [shinies, setShinies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. OBTENER USUARIO
    const userString = localStorage.getItem('USUARIO_ACTIVO');
    if (!userString) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userString);

    // 2. PEDIR DATOS AL SERVIDOR (BACKEND)
    const fetchShinies = async () => {
      try {
        // Usamos la ID del usuario para pedir SOLO sus shinies
        // Asegúrate de que user.id existe. Si en tu login guardaste "_id", usa user._id
        const userId = user.id || user._id; 
        
        const response = await fetch(`http://localhost:5000/api/shiny/collection/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setShinies(data);
        } else {
          console.error("Error al obtener la colección");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShinies();
  }, [navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <Link to="/" style={{ color: '#aaa', textDecoration: 'none' }}>← Volver a Inicio</Link>
        <h2 style={{ margin: 0 }}>Mi Colección Shiny ✨</h2>
        <div style={{ width: '80px' }}></div> {/* Espacio vacío para centrar el título */}
      </div>

      {loading ? (
        <p>Cargando colección...</p>
      ) : shinies.length === 0 ? (
        <div style={{ marginTop: '50px', color: '#aaa' }}>
          <h3>Aún no tienes capturas</h3>
          <p>¡Ve a cazar tu primer shiny!</p>
          <Link to="/">
            <button style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Ir a Cazar</button>
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '20px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {shinies.map((shiny) => (
            <div key={shiny._id} style={{ 
              background: '#2a2a2a', 
              borderRadius: '15px', 
              padding: '15px',
              border: '1px solid #444',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              {/* Fecha pequeña arriba */}
              <div style={{ fontSize: '0.7rem', color: '#888', position: 'absolute', top: '10px', right: '15px' }}>
                {new Date(shiny.date).toLocaleDateString()}
              </div>

              {/* Sprite (Intentamos usar la URL guardada, si no hay, ponemos un placeholder) */}
              <img 
                src={shiny.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png`} 
                alt={shiny.pokemonName}
                style={{ width: '100px', height: '100px', objectFit: 'contain' }} 
              />
              
              <h3 style={{ margin: '10px 0', textTransform: 'capitalize', color: '#FFD700' }}>
                {shiny.pokemonName}
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.9rem', color: '#ccc' }}>
                <span>🎮 {shiny.game}</span>
                <span>🎲 {shiny.attempts}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Biblioteca;