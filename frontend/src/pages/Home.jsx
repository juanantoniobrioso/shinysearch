import { useEffect, useState } from 'react';
// IMPORTANTE: Aquí faltaba 'useNavigate' en tu código anterior
import { Link, useNavigate } from 'react-router-dom'; 

const games = [
  { id: 'fire-red', name: 'Rojo Fuego', gen: 3, baseOdds: 8192 },
  { id: 'heart-gold', name: 'HeartGold', gen: 4, baseOdds: 8192 },
  { id: 'black', name: 'Negro', gen: 5, baseOdds: 8192 },
  { id: 'xy', name: 'X / Y', gen: 6, baseOdds: 4096 },
  { id: 'sword', name: 'Espada', gen: 8, baseOdds: 4096 },
  { id: 'scarlet', name: 'Escarlata', gen: 9, baseOdds: 4096 },
];

const Home = () => {
  const navigate = useNavigate(); // Esto fallaba porque no estaba importado arriba
  const [user, setUser] = useState(() => {
    const stringGuardado = localStorage.getItem('USUARIO_ACTIVO');
    // Si existe, lo convertimos de texto a Objeto real. Si no, devolvemos null.
    if (stringGuardado) {
      return JSON.parse(stringGuardado);
    }
    return null;
  });

  useEffect(() => {
    // Solo comprobamos si NO hay usuario para echarlo fuera.
    // Si SÍ hay usuario, el useState de arriba ya se encargó de cargarlo.
    const stringGuardado = localStorage.getItem('USUARIO_ACTIVO');
    
    if (!stringGuardado) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('USUARIO_ACTIVO');
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '20px' }}>
        <h2>Hola, <span style={{color: '#FFD700', textTransform: 'capitalize'}}>
        {user ? user.username : 'Entrenador'}
        </span></h2>
        <button onClick={handleLogout} style={{background: '#d32f2f', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer'}}>Cerrar Sesión</button>
      </div>
      
      <h1>Selecciona tu Juego</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {games.map(game => (
          <Link key={game.id} to={`/hunt/${game.id}`} state={{ gameData: game }} style={{ textDecoration: 'none' }}>
            <div style={{ 
              border: '1px solid #444', padding: '20px', borderRadius: '10px', 
              background: '#2a2a2a', color: 'white', cursor: 'pointer' 
            }}>
              <h3>{game.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Gen {game.gen}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '50px' }}>
        {/* OJO: Aquí he cambiado /library por /biblioteca */}
        <Link to="/biblioteca">
          <button style={{ padding: '15px 30px', background: '#FFD700', color: 'black', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            🏆 Ver Biblioteca Shiny
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;