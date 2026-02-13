import React, { useState, useEffect } from 'react';

function Home() {
  // 1. Guardamos los datos del Pokémon recibido de la API
  const [pokemon, setPokemon] = useState(null);
  
  // 2. Guardamos lo que el usuario escribe en el input
  const [pokemonBuscado, setPokemonBuscado] = useState('pikachu'); // Valor inicial

  // Función que busca el Pokémon (Se usa al inicio y al pulsar el botón)
  const buscarPokemon = async () => {
    if (!pokemonBuscado) return;

    try {
      // Convertimos a minúsculas porque la API falla con mayúsculas
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonBuscado.toLowerCase()}`);
      
      if (!response.ok) {
        alert("Pokémon no encontrado");
        return;
      }

      const data = await response.json();
      setPokemon(data); // Guardamos el pokémon encontrado
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Cargar un pokémon nada más entrar (usando el valor inicial)
  useEffect(() => {
    buscarPokemon();
  }, []); 

  return (
    <div className="container mt-5 text-center">
      <h1>Mi Colección Shiny ✨</h1>
      
      {/* GRUPO DE BÚSQUEDA */}
      <div className="d-flex justify-content-center gap-2 w-50 mx-auto my-3">
        <input 
          type="text" 
          className="form-control"
          placeholder="Escribe un pokémon" 
          value={pokemonBuscado} // Conectado al estado
          onChange={(e) => setPokemonBuscado(e.target.value)} // Actualiza el estado al escribir
        />
        <button 
          className="btn btn-primary" 
          onClick={buscarPokemon} // Llama a la API al hacer clic
        >
          Buscar
        </button>
      </div>

      {/* TARJETA DEL POKÉMON */}
      {pokemon ? (
        <div className="card mx-auto shadow" style={{width: '18rem'}}>
          <div className="card-body">
            <h2 className="card-title text-uppercase">{pokemon.name}</h2>
            <img 
              src={pokemon.sprites.front_shiny} 
              alt={pokemon.name} 
              className="img-fluid"
              style={{ width: '150px', filter: 'drop-shadow(0 0 10px gold)' }}
            />
            <p className="card-text mt-2 fw-bold">ID: #{pokemon.id}</p>
            {/* Mostramos el tipo */}
            <span className="badge bg-success">
               {pokemon.types[0].type.name}
            </span>
          </div>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default Home;