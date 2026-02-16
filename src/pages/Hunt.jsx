import { useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import PokemonSearch from '../components/PokemonSearch'; 

const Hunt = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Datos del juego (con valores por defecto por seguridad)
  const gameData = location.state?.gameData || { name: 'Juego', gen: 9, baseOdds: 4096 };

  const [targetPokemon, setTargetPokemon] = useState(null);
  const [count, setCount] = useState(0);

  // Seleccionar Pokémon del buscador
  const handleSelectPokemon = async (p) => {
    try {
      const res = await fetch(p.url);
      const data = await res.json();
      
      setTargetPokemon({
        name: data.name,
        id: data.id,
        sprite: data.sprites.front_shiny
      });
      setCount(0);
    } catch (error) {
      console.error("Error cargando pokémon:", error);
    }
  };

  // Guardar y Terminar
  const handleFinish = () => {
    if (!targetPokemon) return;

    // 1. OBTENEMOS EL USUARIO
  const activeUser = localStorage.getItem('USUARIO_ACTIVO');
  if (!activeUser) {
    navigate('/login');
    return;
  }

  // 2. CREAMOS UNA LLAVE ÚNICA PARA ESTE USUARIO
  const userKey = `COLECCION_${activeUser.toUpperCase()}`; // Ejemplo: COLECCION_ASH

  const newShiny = {
    // ... (esto sigue igual: id, pokemonName, attempts, etc.) ...
     id: Date.now(), 
     pokemonName: targetPokemon.name,
     sprite: targetPokemon.sprite,
     attempts: count,
     game: gameData.name,
     date: new Date().toLocaleDateString()
  };

  // 3. USAMOS ESA LLAVE PERSONALIZADA
  const storedData = localStorage.getItem(userKey);
  const existingBiblioteca = storedData ? JSON.parse(storedData) : [];
  
  existingBiblioteca.push(newShiny);
  
  localStorage.setItem(userKey, JSON.stringify(existingBiblioteca));

    navigate('/biblioteca');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
      <Link to="/" style={{ float: 'left', color: '#aaa', textDecoration: 'none' }}>← Volver</Link>
      
      {/* MODO BUSCADOR */}
      {!targetPokemon && (
        <div style={{ marginTop: '50px' }}>
          <h2>Cazando en {gameData.name}</h2>
          <PokemonSearch gameGen={gameData.gen} onPokemonSelect={handleSelectPokemon} />
        </div>
      )}

      {/* MODO CAZA (CONTADOR) */}
      {targetPokemon && (
        <div style={{ marginTop: '20px', animation: 'fadeIn 0.5s' }}>
          <h3>Cazando a <span style={{color: '#FFD700'}}>{targetPokemon.name.toUpperCase()}</span></h3>
          
          <div style={{ 
            background: '#333', 
            padding: '30px', 
            borderRadius: '20px', 
            display: 'inline-block', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid #555'
          }}>
            {/* IMAGEN */}
            <img 
              src={targetPokemon.sprite} 
              alt="Shiny" 
              width={200}
              style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))' }}
            />
            
            {/* CONTADOR GIGANTE */}
            <div style={{ 
              fontSize: '80px', 
              fontWeight: 'bold', 
              fontFamily: 'monospace', 
              color: '#fff',
              margin: '10px 0',
              textShadow: '0 0 10px rgba(255,255,255,0.3)'
            }}>
              {count}
            </div>

            <p style={{ color: '#aaa' }}>Intentos totales</p>

            {/* BOTONES DE ACCIÓN */}
            <div style={{ display: 'grid', gap: '10px' }}>
              <button 
                onClick={() => setCount(count + 1)} 
                style={{ 
                  padding: '20px', 
                  fontSize: '24px', 
                  background: '#4CAF50', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                +1 Encuentro
              </button>

              <button 
                onClick={handleFinish}
                style={{ 
                  padding: '15px', 
                  background: '#2196F3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                💾 Guardar en Biblioteca
              </button>

              <button 
                onClick={() => setTargetPokemon(null)}
                style={{ 
                  padding: '10px', 
                  background: 'transparent', 
                  color: '#f44336', 
                  border: '1px solid #f44336', 
                  borderRadius: '10px', 
                  cursor: 'pointer' 
                }}
              >
                Cancelar Caza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hunt;