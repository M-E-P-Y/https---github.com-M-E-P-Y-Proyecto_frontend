import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/Sidebar'; // Asegúrate de tener este componente creado
import './index.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [oficial, setOficial] = useState(null);

    const handleLogin = (datosUsuario) => {
        setOficial(datosUsuario);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setOficial(null);
    };

    return (
        <Router>
            <div className="app-root d-flex">
                {/* El Sidebar solo se muestra si el oficial está dentro del sistema */}
                {isAuthenticated && <Sidebar oficial={oficial} onLogout={handleLogout} />}
                
                <main className="flex-grow-1 overflow-auto" style={{ height: '100vh' }}>
                    <AppRoutes 
                        isAuthenticated={isAuthenticated} 
                        onLoginSuccess={handleLogin} 
                        oficial={oficial} 
                    />
                </main>
            </div>
        </Router>
    );
}

export default App;