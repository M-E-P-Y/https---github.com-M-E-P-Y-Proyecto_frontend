import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import UsuariosPage from '../pages/UsuariosPage';
import HistorialPage from '../pages/HistorialPage';
import NodosPage from '../pages/NodosPage';

// Componente para proteger rutas (HOC)
const PrivateRoute = ({ children, isAuthenticated }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
};

const AppRoutes = ({ isAuthenticated, onLoginSuccess, oficial }) => {
    return (
        <Routes>
            {/* RUTA PÚBLICA: Acceso al sistema */}
            <Route 
                path="/" 
                element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={onLoginSuccess} />
                } 
            />

            {/* RUTAS PRIVADAS: Requieren sesión activa */}
            <Route 
                path="/dashboard" 
                element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Dashboard oficial={oficial} />
                    </PrivateRoute>
                } 
            />

            <Route 
                path="/usuarios" 
                element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <UsuariosPage />
                    </PrivateRoute>
                } 
            />

            <Route 
                path="/nodos" 
                element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <NodosPage />
                    </PrivateRoute>
                } 
            />

            <Route 
                path="/historial" 
                element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <HistorialPage />
                    </PrivateRoute>
                } 
            />

            {/* REDIRECCIÓN: Si el oficial escribe una URL que no existe */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;