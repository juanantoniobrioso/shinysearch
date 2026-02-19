import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // LISTA DE JUEGOS CON EL ID DEL LEGENDARIO DE PORTADA
  const games = [
    // GEN 2 (Ho-Oh, Lugia, Suicune)
    { name: "Oro", gen: 2, slug: "gold", id: 250 },
    { name: "Plata", gen: 2, slug: "silver", id: 249 },
    { name: "Cristal", gen: 2, slug: "crystal", id: 245 },
    
    // GEN 3 (Groudon, Kyogre, Rayquaza, Charizard, Venusaur)
    { name: "Rubí", gen: 3, slug: "ruby", id: 383 },
    { name: "Zafiro", gen: 3, slug: "sapphire", id: 382 },
    { name: "Esmeralda", gen: 3, slug: "emerald", id: 384 },
    { name: "Rojo Fuego", gen: 3, slug: "fire-red", id: 6 },
    { name: "Verde Hoja", gen: 3, slug: "leaf-green", id: 3 },
    
    // GEN 4 (Dialga, Palkia, Giratina, Ho-Oh, Lugia)
    { name: "Diamante", gen: 4, slug: "diamond", id: 483 },
    { name: "Perla", gen: 4, slug: "pearl", id: 484 },
    { name: "Platino", gen: 4, slug: "platinum", id: 487 },
    { name: "HeartGold", gen: 4, slug: "heartgold", id: 250 },
    { name: "SoulSilver", gen: 4, slug: "soulsilver", id: 249 },
    
    // GEN 5 (Reshiram, Zekrom, Kyurem Blanco, Kyurem Negro)
    { name: "Blanco", gen: 5, slug: "white", id: 644 },
    { name: "Negro", gen: 5, slug: "black", id: 643 },
    { name: "Blanco 2", gen: 5, slug: "white-2", id: 10023 }, // Kyurem Blanco
    { name: "Negro 2", gen: 5, slug: "black-2", id: 10022 }, // Kyurem Negro
    
    // GEN 6 (Xerneas, Yveltal, Groudon Primigenio, Kyogre Primigenio)
    { name: "X", gen: 6, slug: "x", id: 716 },
    { name: "Y", gen: 6, slug: "y", id: 717 },
    { name: "Rubí Omega", gen: 6, slug: "omega-ruby", id: 10078 }, // Primal Groudon
    { name: "Zafiro Alfa", gen: 6, slug: "alpha-sapphire", id: 10077 }, // Primal Kyogre
    
    // GEN 7 (Solgaleo, Lunala, Necrozma Melena, Necrozma Alas)
    { name: "Sol", gen: 7, slug: "sun", id: 791 },
    { name: "Luna", gen: 7, slug: "moon", id: 792 },
    { name: "Ultra Sol", gen: 7, slug: "ultra-sun", id: 10155 }, // Dusk Mane
    { name: "Ultra Luna", gen: 7, slug: "ultra-moon", id: 10156 }, // Dawn Wings
    
    // GEN 8 (Zacian, Zamazenta, Dialga, Palkia)
    { name: "Espada", gen: 8, slug: "sword", id: 888 },
    { name: "Escudo", gen: 8, slug: "shield", id: 889 },
    { name: "Diamante Brillante", gen: 8, slug: "brilliant-diamond", id: 483 },
    { name: "Perla Reluciente", gen: 8, slug: "shining-pearl", id: 484 },
    
    // GEN 9 (Koraidon, Miraidon)
    { name: "Escarlata", gen: 9, slug: "scarlet", id: 1007 },
    { name: "Púrpura", gen: 9, slug: "violet", id: 1008 },
  ];

  const generaciones = [...new Set(games.map(game => game.gen))];

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

  return (
    <div style={{
  minHeight: '100vh',
  background: 'radial-gradient(circle at top, #464a20 0%, #34204a 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
    }}>
    <div className="app-container">
      {/* HEADER */}
      <header className="header-bar">
        {/* AQUÍ ESTÁ EL ARREGLO DEL NOMBRE (username en minúscula) */}
        <h3>Entrenador <span className="username-highlight">{user?.username || user?.Username}</span></h3>
        <button onClick={handleLogout} className="btn-custom btn-poke-red">
          Cerrar Sesión
        </button>
      </header>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => navigate('/biblioteca')} className="btn-custom btn-poke-blue">
          Biblioteca 
        </button>
      </div>

      <h1 className="title-main">Selecciona juego</h1>
      <p className="subtitle">Elige tu aventura para comenzar la caza</p>

      <div style={{ paddingBottom: '50px' }}>
        {generaciones.map((gen) => (
          <div key={gen} className="gen-section">
            <h2 className="gen-title">Generación {gen}</h2>
            <div className="games-grid">
              {games
                .filter(game => game.gen === gen)
                .map((game) => (
                  <button 
                    key={game.slug}
                    className="game-card"
                    onClick={() => navigate(`/hunt/${game.slug}`, { state: { gameName: game.name, gen: game.gen } })}
                  >
                    {/* IMAGEN DEL LEGENDARIO */}
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${game.id}.png`}
                      alt={game.name}
                      className="game-cover-sprite"
                    />
                    <span className="game-name">{game.name}</span>
                  </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      
    </div>
    </div>
  );
};

export default Home;