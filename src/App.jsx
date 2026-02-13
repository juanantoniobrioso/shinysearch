import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- ZONA DE IMPORTS (Aquí estaba el fallo) ---
import Home from './pages/Home';
import Header from './Header/Header'; 
import Footer from './Footer/Footer'; 
// ----------------------------------------------

function App() {
  return (
    <BrowserRouter>
      {/* Si Header no está importado arriba, esto da pantalla blanca */}
      <Header /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;