import { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

const Hunt = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recuperamos datos
  const gameName = location.state?.gameName || slug;
  const gameGen = location.state?.gen || 9;

  // --- CONFIGURACIÓN DE COLORES Y LÍMITES POR GENERACIÓN --- //
  
  // 1. Diccionario de Fondos (Tus colores)
  const genGradients = {
    2: 'linear-gradient(135deg, #BD932F, #B7B7B7)', // Oro -> Plata
    3: 'linear-gradient(135deg, #0044C3, #AA2447)', // Zafiro -> Rubí
    4: 'linear-gradient(135deg, #6FB4C3, #895389)', // Diamante -> Perla
    5: 'linear-gradient(135deg, #000000, #FFFFFF)', // Negro -> Blanco
    6: 'linear-gradient(135deg, #C94242, #45A2D6)', // Y (Rojo) -> X (Azul)
    7: 'linear-gradient(135deg, #E8914D, #3B7BF5)', // Sol -> Luna
    8: 'linear-gradient(135deg, #33DDF5, #E84682)', // Espada -> Escudo
    9: 'linear-gradient(135deg, #FF0000, #AE00FF)', // Escarlata -> Púrpura
  };

  // 2. Diccionario de Límite de Pokédex
  const maxDexIds = {
    1: 151, 2: 251, 3: 386, 4: 493, 
    5: 649, 6: 721, 7: 809, 8: 905, 9: 1025
  };

  // Seleccionamos el fondo actual (o uno oscuro por defecto si falla)
  const currentBackground = genGradients[gameGen] || 'var(--bg-main)';

  // --- ESTADOS Y LÓGICA --- //
  const [pokemonName, setPokemonName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [encounters, setEncounters] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const searchPokemon = async (query) => {
    setPokemonName(query);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1025`);
      const data = await response.json();
      const limitId = maxDexIds[gameGen] || 1025;

      const filtered = data.results
        .filter(p => {
          const urlParts = p.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 2]);
          return p.name.includes(query.toLowerCase()) && id <= limitId;
        })
        .slice(0, 5); 
        
      setSuggestions(filtered);
    } catch (error) {
      console.error("Error buscando pokemon", error);
    }
  };

  const selectPokemon = (poke) => {
    const id = poke.url.split('/')[6];
    setSelectedPokemon({
      name: poke.name,
      id: id,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
    });
    setSuggestions([]);
    setPokemonName('');
  };

  const handleIncrement = () => setEncounters(prev => prev + 1);
  
  const handleSave = async () => {
    if (!selectedPokemon) return;
    
    // 1. Recuperar usuario con seguridad
    const userString = localStorage.getItem('USUARIO_ACTIVO');
    if (!userString) {
      alert("Error: No hay sesión activa. Vuelve a hacer login.");
      return;
    }
    const user = JSON.parse(userString);
    
    // 2. OBTENER ID (CORRECCIÓN IMPORTANTE)
    // Añadimos 'user.id' que faltaba
    const userId = user.Id || user.id || user._id;

    if (!userId) {
      alert("Error: No se encontró el ID del usuario.");
      console.error("Usuario sin ID válido:", user);
      return;
    }

    setIsSaving(true);
    
    const shinyData = {
      userId: userId, // Ahora seguro que no es undefined
      pokemonName: selectedPokemon.name,
      game: gameName,
      attempts: encounters,
      sprite: selectedPokemon.sprite,
      date: new Date()
    };

    // DEBUG: Mira la consola del navegador si falla
    console.log("Enviando Shiny:", shinyData); 

    try {
      const response = await fetch('http://localhost:5000/api/shiny/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shinyData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("¡Shiny registrado correctamente!");
        navigate('/biblioteca');
      } else {
        // Muestra el error que devuelve el backend
        alert(`Error al guardar: ${result.message || 'Error desconocido'}`);
        console.error("Error del servidor:", result);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // AQUI APLICAMOS EL FONDO DINÁMICO
    <div className="app-container" style={{ background: currentBackground, minHeight: '100vh', transition: 'background 0.5s ease' }}>
      
      {/* Botón Volver con sombra para que se lea bien en fondos claros (Gen 5) */}
      <div style={{ textAlign: 'left', marginBottom: '20px', padding: '20px' }}>
        <Link to="/" className="btn btn-back" style={{ 
          fontSize: '1.1rem', 
          background: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255,255,255,0.2)' 
        }}>
          ← Cancelar Caza
        </Link>
      </div>

      <div className="hunt-centered">
        {!selectedPokemon ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Título con sombra para legibilidad */}
            <h1 className="title-main" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              ¿Qué estás cazando?
            </h1>
            <p className="subtitle" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>
              Escribe el nombre del Pokémon objetivo
            </p>
            
            <div className="search-wrapper">
              <input 
                type="text" 
                className="search-input"
                placeholder="Ej: Charmander..."
                value={pokemonName}
                onChange={(e) => searchPokemon(e.target.value)}
                autoFocus
              />
              {suggestions.length > 0 && (
                <div className="suggestions-box">
                  {suggestions.map((poke) => (
                    <div key={poke.name} className="suggestion-item" onClick={() => selectPokemon(poke)}>
                      <span style={{ textTransform: 'capitalize' }}>{poke.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="counter-box">
            <img src={selectedPokemon.sprite} alt={selectedPokemon.name} className="shiny-target-img"/>
            <h2 className="pokemon-name">{selectedPokemon.name}</h2>
            <div className="counter-number">{encounters}</div>
            <div className="counter-label">Intentos Totales</div>

            <div className="action-buttons">
              <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px' }} onClick={handleIncrement}>
                +1 Encuentro
              </button>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn" style={{ flex: 1, background: '#2d3436', color: 'white' }} onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Guardando...' : '💾 Guardar'}
                </button>
                <button className="btn btn-danger" onClick={() => { if(window.confirm("¿Cancelar caza actual?")) setSelectedPokemon(null); setEncounters(0); }}>
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hunt;