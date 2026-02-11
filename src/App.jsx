import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. Estado para guardar los datos del Pokémon
  const [pokemon, setPokemon] = useState(null);

  // 2. useEffect para llamar a la API al cargar el componente
  useEffect(() => {
    // Definimos la función asíncrona
    const fetchPokemon = async () => {
      try {
        // Hacemos la petición a la PokéAPI (puedes cambiar 'charizard' por otro)
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/mewtwo');
        const data = await response.json();
        
        // Guardamos los datos en el estado
        setPokemon(data);
      } catch (error) {
        console.error("Error buscando el pokémon:", error);
      }
    };

    fetchPokemon();
  }, []); // El array vacío [] significa "ejecútalo solo una vez al inicio"

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Mi Colección Shiny ✨</h1>
      
      {/* 3. Renderizado Condicional: Si hay pokemon, lo mostramos */}
      {pokemon ? (
        <div className="card">
          <h2>{pokemon.name.toUpperCase()}</h2>
          {/* Aquí está la clave: accedemos a front_shiny */}
          <img 
            src={pokemon.sprites.front_shiny} 
            alt={pokemon.name} 
            style={{ width: '200px', filter: 'drop-shadow(0 0 10px gold)' }}
          />
          <p>ID: #{pokemon.id}</p>
          <p>Tipo: {pokemon.types.map(t => t.type.name).join(', ')}</p>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  )
}

export default App