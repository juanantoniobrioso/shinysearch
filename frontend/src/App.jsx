import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        <Route path="/biblioteca" element={<Biblioteca />} />
      </Routes>
      <div className="App">
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        theme="dark" 
      />
      </div>
    </BrowserRouter>
    
  );
}

export default App;