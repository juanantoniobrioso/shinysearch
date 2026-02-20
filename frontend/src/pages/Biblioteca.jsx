import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Biblioteca = () => {
  const [shinies, setShinies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState({ 
  isOpen: false, 
  title: "", 
  onConfirm: null 
  });
  // Juegos
  const gamesList = [
    "Oro", "Plata", "Cristal",
    "Rubí", "Zafiro", "Esmeralda", "Rojo Fuego", "Verde Hoja",
    "Diamante", "Perla", "Platino", "HeartGold", "SoulSilver",
    "Blanco", "Negro", "Blanco 2", "Negro 2",
    "X", "Y", "Rubí Omega", "Zafiro Alfa",
    "Sol", "Luna", "Ultra Sol", "Ultra Luna",
    "Espada", "Escudo", "Diamante Brillante", "Perla Reluciente",
    "Escarlata", "Púrpura"
  ];

  //Notas para cada shiny
  const [selectedShinyForNotes, setSelectedShinyForNotes] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");

  const navigate = useNavigate();

  // --- ESTADO PARA LA EDICIÓN (NUEVO) ---
  const [editingShiny, setEditingShiny] = useState(null); // Guarda el shiny que estamos editando
  const [editForm, setEditForm] = useState({ attempts: 0, game: '' }); // Guarda los datos del formulario

  useEffect(() => {
    const userString = localStorage.getItem('USUARIO_ACTIVO');
    if (!userString) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userString);

    const fetchShinies = async () => {
      try {
        const userId = user.Id || user.id || user._id;
        const response = await fetch(`http://localhost:5000/api/shiny/collection/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setShinies(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShinies();
  }, [navigate]);

const handleDelete = (shiny) => {
  // Creamos el nombre con la primera letra en mayúscula
  const formattedName = shiny.pokemonName.charAt(0).toUpperCase() + shiny.pokemonName.slice(1);

  setConfirmAction({
    isOpen: true,
    title: `¿Liberar a ${formattedName}?`,
    onConfirm: async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/shiny/delete/${shiny._id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          setShinies(shinies.filter((s) => s._id !== shiny._id));
          // También lo aplicamos al Toast de éxito
          toast.info(`✨ ${formattedName} ha sido liberado correctamente`);
        }
      } catch (error) {
        toast.error("Error al borrar");
      }
    }
  });
};

  // --- FUNCIONES DE EDICIÓN (NUEVO) ---
  const openEditModal = (shiny) => {
    setEditingShiny(shiny);
    setEditForm({ attempts: shiny.attempts, game: shiny.game });
  };

  const closeEditModal = () => {
    setEditingShiny(null);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/shiny/update/${editingShiny._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedShiny = await response.json();
        
        // Actualizamos la lista localmente para ver el cambio al instante
        setShinies(shinies.map(s => (s._id === updatedShiny._id ? updatedShiny : s)));
        toast.success("Cambios guardados correctamente");
        closeEditModal();
      } else {
        toast.error("Error al actualizar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    }
  };

  //FUNCIONES DE NOTAS
  const openNoteModal = (shiny) => {
    fetchNotes(shiny._id); // Esto carga las notas y abre el modal
  };
  const fetchNotes = async (shinyId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/notes/${shinyId}`);
    const data = await response.json();
    setNotes(data);
    setSelectedShinyForNotes(shinyId);
  } catch (error) {
    console.error("Error al cargar notas");
  }
};

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    try {
      const response = await fetch(`http://localhost:5000/api/notes/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shinyId: selectedShinyForNotes, text: newNoteText })
      });
      if (response.ok) {
        const savedNote = await response.json();
        setNotes([...notes, savedNote]); // Actualizar lista
        setNewNoteText(""); // Limpiar input
      }
    } catch (error) {
      console.error("Error al guardar nota");
    }
  };

  const handleDeleteNote = (note) => {
  // 1. Configuramos el modal de confirmación personalizado
  setConfirmAction({
    isOpen: true,
    title: `¿Borrar la nota: "${note.text.substring(0, 15)}..."?`,
    onConfirm: async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notes/delete/${note._id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // 2. Actualizamos el estado para que desaparezca de la lista
          setNotes(prevNotes => prevNotes.filter(n => n._id !== note._id));
          
          // 3. Lanzamos el Toast con el contenido de la nota
          const shortText = note.text.length > 20 
            ? note.text.substring(0, 20) + "..." 
            : note.text;
            
          toast.success(`🗑️ Nota eliminada: "${shortText}"`);
        } else {
          toast.error("No se pudo borrar la nota");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error de conexión");
      }
    }
  });
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
        <Link to="/" className="btn-nav-retro">
          ← Volver a Inicio
        </Link>
        <h2 style={{margin: 0}}>Mi Colección ✨</h2>
        <div style={{width: '100px'}}></div>
      </header>

      {loading ? (
        <p>Cargando datos...</p>
      ) : shinies.length === 0 ? (
        <div className="empty-state">
          <h3>Aún no tienes capturas</h3>
          <p>¡Ve a cazar tu primer shiny!</p>
          <br/>
          <Link to="/">
            <button className="btn btn-primary">Ir a Cazar</button>
          </Link>
        </div>
      ) : (
        /* GRILLA DE SHINIES */
        <div className="library-grid">
          {shinies.map((shiny) => (
            <div key={shiny._id} className="shiny-card">
              
              {/* BOTÓN BORRAR (X) */}
              <button 
                className="btn-circle btn-delete"
                onClick={() => handleDelete(shiny)}
                title="Borrar"
              >
                ×
              </button>

              {/* BOTÓN EDITAR (LÁPIZ)*/}
              <button 
                className="btn-circle btn-edit"
                onClick={() => openEditModal(shiny)}
                title="Editar"
              >
                ✎
              </button>

              <div className="shiny-date">
                {new Date(shiny.date).toLocaleDateString()}
              </div>

              <img 
                src={shiny.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png`} 
                alt={shiny.pokemonName}
                className="shiny-sprite" 
              />
              
              <h3 className="shiny-name">{shiny.pokemonName}</h3>
              
              <div className="shiny-stats">
                <span>🎮 {shiny.game}</span>
                <span>🎲 {shiny.attempts}</span>
              </div>
              
              {/*---Boton añadir notas */}
              <button 
                className="btn-custom btn-poke-blue" 
                style={{ width: '100%', marginTop: '10px', fontSize: '0.8rem' }}
                onClick={() => openNoteModal(shiny)}
                title="Ver notas"
              >
                Ver Notas / Detalle
              </button>
            </div>
          ))}
        </div>
      )}

      {/*--- Editar notas --- */}
      {selectedShinyForNotes && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Notas del Pokémon</h3>
      
      {/* Contenedor de la lista de notas */}
      <div className="notes-list" style={{
        maxHeight: '250px', 
        overflowY: 'auto', 
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#1a1a1a', 
        borderRadius: '8px'
      }}>
        {notes.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>No hay notas aún.</p>
        ) : (
          notes.map(n => (
            <div key={n._id} style={{
              backgroundColor: '#333',
              color: '#fff',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '10px',
              fontSize: '0.9rem',
              borderLeft: '4px solid #ffcb05',
              textAlign: 'left',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              position: 'relative'
            }}>
              
              {/* BOTÓN BORRAR NOTA */}
              <button 
                onClick={() => handleDeleteNote(n)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ff4757',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0 5px'
                }}
                title="Borrar nota"
              >
                ×
              </button>

              <div style={{ marginBottom: '5px', paddingRight: '20px' }}>
                {n.text}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#aaa' }}>
                📅 {new Date(n.date).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input para añadir nueva nota */}
      <input 
        type="text" 
        className="search-input" 
        placeholder="Escribe una nota..."
        value={newNoteText}
        onChange={(e) => setNewNoteText(e.target.value)}
      />

      <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
        <button className="btn-custom btn-poke-blue" onClick={handleAddNote}>Añadir</button>
        <button className="btn-custom btn-poke-red" onClick={() => setSelectedShinyForNotes(null)}>Cerrar</button>
      </div>
    </div>
  </div>
)}

      {/* --- MODAL DE EDICIÓN --- */}
      {editingShiny && (
        
        <div className="modal-overlay">
          <div className="modal-content">
            
            <h3>Editar {editingShiny.pokemonName}</h3>
            
            <label>Número de Intentos:</label>
            <input 
              type="number" 
              min="0" // 1. Bloqueo visual (flechitas)
              className="search-input"
              style={{ marginBottom: '15px' }}
              value={editForm.attempts}
              onChange={(e) => {
                // 2. Bloqueo lógico (no deja escribir negativos)
                const val = e.target.value;
                if (val >= 0) { 
                  setEditForm({...editForm, attempts: val});
                }
              }}
              // 3. Bloqueo extra: Previene escribir signos 'e', '+', '-'
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />

            <label>Juego:</label>
            {}
            <select 
              className="search-input" 
              style={{ marginBottom: '20px', cursor: 'pointer' }}
              value={editForm.game}
              onChange={(e) => setEditForm({...editForm, game: e.target.value})}
            >
              {gamesList.map((gameName) => (
                <option key={gameName} value={gameName}>
                  {gameName}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-danger" onClick={closeEditModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleUpdate}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
      {confirmAction.isOpen && (
  <div className="modal-overlay" style={{ zIndex: 10000 }}>
    <div className="modal-content" style={{ textAlign: 'center', maxWidth: '300px' }}>
      <h3 style={{ marginBottom: '20px' }}>{confirmAction.title}</h3>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button className="btn btn-danger" onClick={() => {
          confirmAction.onConfirm();
          setConfirmAction({ ...confirmAction, isOpen: false });
        }}>
          Sí, eliminar
        </button>
        <button className="btn btn-primary" onClick={() => setConfirmAction({ ...confirmAction, isOpen: false })}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    </div>
  );
};

export default Biblioteca;