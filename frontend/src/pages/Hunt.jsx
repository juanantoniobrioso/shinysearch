import { useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import PokemonSearch from '../components/PokemonSearch'; 

const Hunt = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Datos del juego
  const gameData = location.state?.gameData || { name: 'Juego', gen: 9, baseOdds: 4096 };

  const [targetPokemon, setTargetPokemon] = useState(null);
  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false); // Nuevo estado para evitar doble clic

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

  // --- AQUÍ ESTÁ EL CAMBIO IMPORTANTE ---
  const handleFinish = async () => {
    if (!targetPokemon) return;

    // 1. Obtener usuario (ahora parseamos el JSON correctamente)
    const userString = localStorage.getItem('USUARIO_ACTIVO');
    if (!userString) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userString); // Convertimos texto a Objeto para sacar la ID

    setSaving(true); // Bloqueamos el botón para que no le den 2 veces

    try {
      // 2. ENVIAR A TU SERVIDOR (BACKEND)
      console.log("Enviando datos...", { user }); // Esto nos ayudará a ver qué pasa en la consola (F12)

      const response = await fetch('http://localhost:5000/api/shiny/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pokemonName: targetPokemon.name,
          game: gameData.name,
          attempts: count,
          sprite: targetPokemon.sprite, // Asegúrate de enviar el sprite también
          // --- AQUÍ ESTÁ EL CAMBIO ---
          userId: user.Id || user.id || user._id // Probamos todas las opciones para no fallar
          // ---------------------------
        })
      });

      if (response.ok) {
        console.log("¡Guardado en la nube!");
        navigate('/biblioteca'); 
      } else {
        // Vamos a pedirle al servidor que nos diga EXACTAMENTE qué falló
        const errorData = await response.json();
        alert(`El servidor dice: ${errorData.message}`); // <--- Esto te dirá el error real
        setSaving(false);
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con el servidor.");
      setSaving(false);
    }
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
                disabled={saving} // Se desactiva mientras guarda
                style={{ 
                  padding: '15px', 
                  background: saving ? '#666' : '#2196F3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  cursor: saving ? 'wait' : 'pointer',
                  fontSize: '18px'
                }}
              >
                {saving ? 'Guardando...' : '💾 Guardar en Biblioteca'}
              </button>

              <button 
                onClick={() => setTargetPokemon(null)}
                disabled={saving}
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