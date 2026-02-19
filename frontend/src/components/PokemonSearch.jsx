import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Límites de la Pokédex Nacional por generación
const GEN_LIMITS = {
  1: 151, 2: 251, 3: 386, 4: 493, 
  5: 649, 6: 721, 7: 809, 8: 905, 9: 1025
};

const PokemonSearch = ({ gameGen, onPokemonSelect }) => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Pedimos la lista de TODOS los pokémon (solo nombres y url)
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10000')
      .then(res => res.json())
      .then(data => {
        const processed = data.results.map(p => {
          // Extraemos el ID de la URL: "https://.../pokemon/25/" -> 25
          const id = parseInt(p.url.split('/')[6]);
          return { name: p.name, id: id, url: p.url };
        });
        setAllPokemon(processed);
      });
  }, []);

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchTerm(text);

    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    // Filtramos por nombre Y por generación del juego seleccionado
    const limit = GEN_LIMITS[gameGen] || 1025;
    const filtered = allPokemon.filter(p => 
      p.name.includes(text) && p.id <= limit
    );

    setSuggestions(filtered.slice(0, 5));
  };

  return (
    <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto' }}>
      <input 
        type="text" 
        placeholder="Escribe el Pokémon..." 
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      
      {suggestions.length > 0 && (
        <ul style={{ 
          listStyle: 'none', padding: 0, margin: 0, 
          position: 'absolute', width: '100%', 
          background: '#333', border: '1px solid #555', zIndex: 10 
        }}>
          {suggestions.map(p => (
            <li 
              key={p.name} 
              onClick={() => {
                onPokemonSelect(p);
                setSearchTerm('');
                setSuggestions([]);
              }}
              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #444' }}
            >
              #{p.id} {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PokemonSearch;