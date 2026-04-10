import React, { useState } from 'react';
import { loginOficial } from '../services/authService';

const LoginPage = ({ onLoginSuccess }) => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!user || !pass) {
            setError("Llena todos los campos.");
            return;
        }

        try {
            const data = await loginOficial(user, pass);
            // Si el backend de Go responde con éxito
            onLoginSuccess(data.user);
        } catch (err) {
            setError("Acceso Denegado. Credenciales inválidas.");
        }
    };

    return (
        <div id="login-screen" style={{ backgroundColor: '#0a0a0a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="login-box" style={{ background: '#1e1e1e', padding: '40px', borderRadius: '8px', border: '1px solid #333', width: '400px', textAlign: 'center' }}>
                <h1 style={{ color: '#fff' }}>IUDY <span style={{ color: '#e74c3c' }}>SIMAP</span></h1>
                <p style={{ color: 'gray', fontSize: '12px', letterSpacing: '1px' }}>TERMINAL DE MANDO - NIVEL 4</p>
                
                <input 
                    type="text" 
                    className="form-control mb-2 bg-dark text-white border-secondary"
                    placeholder="Matrícula de Oficial"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <input 
                    type="password" 
                    className="form-control mb-3 bg-dark text-white border-secondary"
                    placeholder="Clave de Acceso"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                />
                
                <button className="btn btn-danger w-100 fw-bold" onClick={handleSubmit}>
                    INICIAR SESIÓN SEGURA
                </button>

                {error && <p className="mt-3 text-danger fw-bold">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;