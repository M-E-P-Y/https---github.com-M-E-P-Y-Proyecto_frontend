import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ oficial, onLogout }) => {
    const location = useLocation();

    // Función para marcar el botón activo según la ruta
    const activeClass = (path) => 
        location.pathname === path ? 'btn-active' : '';

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h1>IUDY <span className="accent-red">SIMAP</span></h1>
                <p className="system-tag">SISTEMA DE MANDO TÁCTICO</p>
            </div>

            <div className="user-profile-box">
                <div className="status-dot"></div>
                <div className="user-info">
                    <span className="user-name">{oficial?.username || 'OFICIAL G-10'}</span>
                    <span className="user-rank">NIVEL 4 - ALCAIDE</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <Link to="/dashboard" className={`nav-item ${activeClass('/dashboard')}`}>
                    <span className="nav-icon">📊</span> DASHBOARD
                </Link>
                <Link to="/usuarios" className={`nav-item ${activeClass('/usuarios')}`}>
                    <span className="nav-icon">👤</span> GESTIÓN DE USUARIOS
                </Link>
                <Link to="/nodos" className={`nav-item ${activeClass('/nodos')}`}>
                    <span className="nav-icon">📡</span> NODOS PABELLÓN C
                </Link>
                <Link to="/historial" className={`nav-item ${activeClass('/historial')}`}>
                    <span className="nav-icon">📜</span> REGISTRO DE ALERTAS
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button onClick={onLogout} className="btn-logout">
                    FINALIZAR SESIÓN
                </button>
            </div>
        </div>
    );
};

export default Sidebar;