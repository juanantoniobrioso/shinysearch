import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Hunt from './pages/Hunt';
import Biblioteca from './pages/Biblioteca'; // Asegúrate de que el archivo se llame Biblioteca.jsx
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/hunt/:gameId" element={<Hunt />} />
        
        {/* Aquí definimos que la URL es /biblioteca */}
        <Route path="/biblioteca" element={<Biblioteca />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;