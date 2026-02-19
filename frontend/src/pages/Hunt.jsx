import { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importamos toast

const Hunt = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const gameName = location.state?.gameName || slug;
  const gameGen = location.state?.gen || 9;

  // --- CONFIGURACIÓN DE COLORES Y LÍMITES ---
  const genGradients = {
    2: 'linear-gradient(135deg, #BD932F, #B7B7B7)',
    3: 'linear-gradient(135deg, #0044C3, #AA2447)',
    4: 'linear-gradient(135deg, #6FB4C3, #895389)',
    5: 'linear-gradient(135deg, #000000, #FFFFFF)',
    6: 'linear-gradient(135deg, #C94242, #45A2D6)',
    7: 'linear-gradient(135deg, #E8914D, #3B7BF5)',
    8: 'linear-gradient(135deg, #33DDF5, #E84682)',
    9: 'linear-gradient(135deg, #FF0000, #AE00FF)',
  };

  const maxDexIds = {
    1: 151, 2: 251, 3: 386, 4: 493, 
    5: 649, 6: 721, 7: 809, 8: 905, 9: 1025
  };

  const currentBackground = genGradients[gameGen] || 'var(--bg-main)';

  // --- ESTADOS ---
  const [pokemonName, setPokemonName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [encounters, setEncounters] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // ESTADO PARA MODAL DE CONFIRMACIÓN (Igual que en Biblioteca)
  const [confirmAction, setConfirmAction] = useState({ 
    isOpen: false, 
    title: "", 
    onConfirm: null 
  });

  // --- LÓGICA DE BÚSQUEDA ---
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
  
  // --- GUARDAR CON TOAST ---
  const handleSave = async () => {
    if (!selectedPokemon) return;
    
    const userString = localStorage.getItem('USUARIO_ACTIVO');
    if (!userString) {
      toast.error("Sesión expirada. Por favor, inicia sesión.");
      return;
    }
    const user = JSON.parse(userString);
    const userId = user.Id || user.id || user._id;

    if (!userId) {
      toast.error("ID de usuario no encontrado.");
      return;
    }

    setIsSaving(true);
    
    const shinyData = {
      userId,
      pokemonName: selectedPokemon.name,
      game: gameName,
      attempts: encounters,
      sprite: selectedPokemon.sprite,
      date: new Date()
    };

    try {
      const response = await fetch('http://localhost:5000/api/shiny/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shinyData)
      });

      if (response.ok) {
        toast.success(`✨ ¡${selectedPokemon.name.toUpperCase()} capturado y guardado!`);
        navigate('/biblioteca');
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.message || 'No se pudo guardar'}`);
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setIsSaving(false);
    }
  };

  // --- CANCELAR CON MODAL PERSONALIZADO ---
  const handleCancelHunt = () => {
    setConfirmAction({
      isOpen: true,
      title: `¿Seguro que quieres abandonar la caza de ${selectedPokemon.name}?`,
      onConfirm: () => {
        setSelectedPokemon(null);
        setEncounters(0);
        toast.info("Caza cancelada");
      }
    });
  };

  return (
    <div className="app-container" style={{ background: currentBackground, minHeight: '100vh', transition: 'background 0.5s ease' }}>
      
      <div style={{ textAlign: 'left', marginBottom: '20px', padding: '20px' }}>
        <Link to="/" className="btn btn-back" style={{ 
          fontSize: '1.1rem', 
          background: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255,255,255,0.2)' 
        }}>
          ← Volver a Inicio
        </Link>
      </div>

      <div className="hunt-centered">
        {!selectedPokemon ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <h2 className="pokemon-name" style={{textTransform: 'capitalize'}}>{selectedPokemon.name}</h2>
            <div className="counter-number">{encounters}</div>
            <div className="counter-label">Intentos Totales</div>

            <div className="action-buttons">
              <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px', width: '100%' }} onClick={handleIncrement}>
                +1 Encuentro
              </button>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="btn" style={{ flex: 1, background: '#2d3436', color: 'white' }} onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Guardando...' : '💾 Guardar'}
                </button>
                <button className="btn btn-danger" onClick={handleCancelHunt}>
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMACIÓN PERSONALIZADO (Mismo que en Biblioteca) */}
      {confirmAction.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: '350px', borderLeft: '5px solid #ffcb05', borderRight: '5px solid #ffcb05' }}>
            <h3 style={{ marginBottom: '10px', color: '#ffcb05' }}>Confirmar</h3>
            <p style={{ marginBottom: '25px', color: '#FFFFFF', fontSize: '1.1rem' }}>{confirmAction.title}</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => {
                confirmAction.onConfirm();
                setConfirmAction({ ...confirmAction, isOpen: false });
              }}>
                Sí, cancelar
              </button>
              <button className="btn btn-primary" onClick={() => setConfirmAction({ ...confirmAction, isOpen: false })}>
                Continuar Caza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hunt;