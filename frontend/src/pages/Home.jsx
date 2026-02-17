import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // --- LISTA MAESTRA DE JUEGOS ---
  const games = [
    // GEN 2
    { name: "Oro", gen: 2, slug: "gold" },
    { name: "Plata", gen: 2, slug: "silver" },
    { name: "Cristal", gen: 2, slug: "crystal" },
    // GEN 3
    { name: "Rubí", gen: 3, slug: "ruby" },
    { name: "Zafiro", gen: 3, slug: "sapphire" },
    { name: "Esmeralda", gen: 3, slug: "emerald" },
    { name: "Rojo Fuego", gen: 3, slug: "fire-red" },
    { name: "Verde Hoja", gen: 3, slug: "leaf-green" },
    // GEN 4
    { name: "Diamante", gen: 4, slug: "diamond" },
    { name: "Perla", gen: 4, slug: "pearl" },
    { name: "Platino", gen: 4, slug: "platinum" },
    { name: "HeartGold", gen: 4, slug: "heartgold" },
    { name: "SoulSilver", gen: 4, slug: "soulsilver" },
    // GEN 5
    { name: "Blanco", gen: 5, slug: "white" },
    { name: "Negro", gen: 5, slug: "black" },
    { name: "Blanco 2", gen: 5, slug: "white-2" },
    { name: "Negro 2", gen: 5, slug: "black-2" },
    // GEN 6
    { name: "X", gen: 6, slug: "x" },
    { name: "Y", gen: 6, slug: "y" },
    { name: "Rubí Omega", gen: 6, slug: "omega-ruby" },
    { name: "Zafiro Alfa", gen: 6, slug: "alpha-sapphire" },
    // GEN 7
    { name: "Sol", gen: 7, slug: "sun" },
    { name: "Luna", gen: 7, slug: "moon" },
    { name: "Ultra Sol", gen: 7, slug: "ultra-sun" },
    { name: "Ultra Luna", gen: 7, slug: "ultra-moon" },
    // GEN 8
    { name: "Espada", gen: 8, slug: "sword" },
    { name: "Escudo", gen: 8, slug: "shield" },
    { name: "Diamante Brillante", gen: 8, slug: "brilliant-diamond" },
    { name: "Perla Reluciente", gen: 8, slug: "shining-pearl" },
    // GEN 9
    { name: "Escarlata", gen: 9, slug: "scarlet" },
    { name: "Púrpura", gen: 9, slug: "violet" },
  ];

  useEffect(() => {
    const userString = localStorage.getItem('USUARIO_ACTIVO');
    if (!userString) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userString));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('USUARIO_ACTIVO');
    navigate('/login');
  };

  const handleGameSelect = (gameSlug, gameName) => {
    // Enviamos tanto el slug (para la URL) como el nombre bonito (para mostrar)
    navigate(`/hunt/${gameSlug}`, { state: { gameName } });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
      
      {/* CABECERA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Hola, <span style={{ color: '#FFD700' }}>{user?.Username}</span></h2>
        <button onClick={handleLogout} style={{ background: '#dc3545', padding: '8px 15px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      <h1>Selecciona tu Juego</h1>

      {/* GRILLA DE JUEGOS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', // Hace que los botones se adapten al tamaño
        gap: '15px',
        marginTop: '30px',
        maxWidth: '1000px',
        margin: '30px auto'
      }}>
        {games.map((game) => (
          <button 
            key={game.slug}
            onClick={() => handleGameSelect(game.slug, game.name)}
            style={{
              padding: '20px 10px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{game.name}</span>
            <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Gen {game.gen}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={() => navigate('/biblioteca')}
        style={{ 
          marginTop: '40px', 
          padding: '15px 30px', 
          background: '#FFD700', 
          color: 'black', 
          border: 'none', 
          borderRadius: '30px', 
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }}
      >
        🏆 Ver Biblioteca Shiny
      </button>
    </div>
  );
};

export default Home;