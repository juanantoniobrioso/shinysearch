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

    // 2. PEDIR DATOS
    const fetchShinies = async () => {
      try {
        const userId = user.Id || user.id || user._id; // Nos aseguramos de pillar la ID
        const response = await fetch(`http://localhost:5000/api/shiny/collection/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setShinies(data);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShinies();
  }, [navigate]);

  // --- NUEVA FUNCIÓN PARA BORRAR ---
  const handleDelete = async (id) => {
    // Preguntamos primero para no borrar por error
    if (!window.confirm("¿Seguro que quieres liberar (borrar) este Shiny?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/shiny/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Truco visual: Filtramos la lista localmente para que desaparezca al instante
        // sin tener que recargar la página
        setShinies(shinies.filter((shiny) => shiny._id !== id));
      } else {
        alert("Error al borrar");
      }
    } catch (error) {
      console.error("Error al borrar:", error);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <Link to="/" style={{ color: '#aaa', textDecoration: 'none' }}>← Volver a Inicio</Link>
        <h2 style={{ margin: 0 }}>Mi Colección Shiny ✨</h2>
        <div style={{ width: '80px' }}></div>
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
              position: 'relative' // Necesario para colocar el botón de borrar
            }}>
              
              {/* --- BOTÓN DE BORRAR (X) --- */}
              <button 
                onClick={() => handleDelete(shiny._id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Borrar Shiny"
              >
                ×
              </button>

              <div style={{ fontSize: '0.7rem', color: '#888', position: 'absolute', top: '10px', left: '15px' }}>
                {new Date(shiny.date).toLocaleDateString()}
              </div>

              <img 
                src={shiny.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png`} 
                alt={shiny.pokemonName}
                style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '10px' }} 
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