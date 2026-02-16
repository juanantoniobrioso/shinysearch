import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Biblioteca = () => {
  const [shinies, setShinies] = useState([]);
  const navigate = useNavigate(); // Necesitas importar useNavigate

  useEffect(() => {
    // 1. Verificamos usuario
    const activeUser = localStorage.getItem('USUARIO_ACTIVO');
    
    if (!activeUser) {
      navigate('/login'); // Si no hay usuario, fuera
      return;
    }

    // 2. Cargamos SU colección específica
    const userKey = `COLECCION_${activeUser.toUpperCase()}`;
    const storedData = localStorage.getItem(userKey);

    if (storedData) {
      setShinies(JSON.parse(storedData).reverse());
    }
  }, [navigate]);

  // Recuerda actualizar también la función deleteShiny para usar userKey
  const deleteShiny = (id) => {
    const activeUser = localStorage.getItem('USUARIO_ACTIVO');
    const userKey = `COLECCION_${activeUser.toUpperCase()}`;
    
    const updated = shinies.filter(s => s.id !== id);
    setShinies(updated);
    localStorage.setItem(userKey, JSON.stringify(updated));
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh' }}>
      <h1>🏆 Mi Colección Shiny 🏆</h1>
      <Link to="/"><button style={{ padding: '10px 20px', cursor: 'pointer' }}>🏠 Volver al Inicio</button></Link>

      {shinies.length === 0 ? (
        <div style={{ marginTop: '50px', color: '#aaa' }}>
          <h3>Tu biblioteca está vacía...</h3>
          <p>¡Ve a cazar tu primer shiny!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px', 
          marginTop: '30px' 
        }}>
          {shinies.map((shiny) => (
            <div key={shiny.id} style={{ 
              border: '1px solid #444', 
              padding: '20px', 
              borderRadius: '15px', 
              background: '#1e1e1e',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.8rem', color: '#666' }}>
                {shiny.date}
              </div>
              
              <img src={shiny.sprite} alt={shiny.pokemonName} width={120} />
              
              <h3 style={{ margin: '10px 0', textTransform: 'capitalize' }}>{shiny.pokemonName}</h3>
              
              <div style={{ textAlign: 'left', padding: '0 20px', color: '#ccc', fontSize: '0.9rem' }}>
                <p>🎮 Juego: <strong>{shiny.game}</strong></p>
                <p>🔄 Intentos: <strong style={{ color: '#FFD700', fontSize: '1.2rem' }}>{shiny.attempts}</strong></p>
              </div>

              <button 
                onClick={() => deleteShiny(shiny.id)}
                style={{ 
                  marginTop: '15px', 
                  background: '#d32f2f', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Biblioteca;