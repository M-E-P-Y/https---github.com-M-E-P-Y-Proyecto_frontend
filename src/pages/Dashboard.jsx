import React, { useState } from 'react';
import { publishMessage } from '../services/mqttService';
import { registrarAlerta } from '../services/alertaService'; // Importamos el servicio

// ... dentro del componente Dashboard ...

const triggerPanico = async () => {
    // 1. Efecto visual y MQTT (Instantáneo)
    setAlertaActiva(true);
    publishMessage('simap/pabellonC/sistema/panico', 'ACTIVATED');

    // 2. Registro en Base de Datos (Persistencia)
    try {
        await registrarAlerta(
            "BOTÓN DE PÁNICO", 
            `Activado manualmente por oficial: ${oficial?.username}`, 
            "CRITICO"
        );
        console.log("Evento registrado en bitácora MongoDB");
    } catch (error) {
        console.error("Error al registrar en bitácora:", error);
    }

    // Apagar efecto visual tras 5 segundos
    setTimeout(() => setAlertaActiva(false), 5000);
};
const Dashboard = ({ oficial }) => {
    const [estadoLuz, setEstadoLuz] = useState(false);
    const [estadoLock, setEstadoLock] = useState(false);
    const [alertaActiva, setAlertaActiva] = useState(false);

    // Funciones de control rescatadas de tu app_prision.html
    const toggleLuz = () => {
        const nuevoEstado = !estadoLuz;
        setEstadoLuz(nuevoEstado);
        publishMessage('simap/pabellonC/actuadores/luz', nuevoEstado ? 'ON' : 'OFF');
    };

    const toggleLockdown = () => {
        const nuevoEstado = !estadoLock;
        setEstadoLock(nuevoEstado);
        publishMessage('simap/pabellonC/actuadores/servomotor', nuevoEstado ? 'LOCK' : 'UNLOCK');
    };

    const triggerPanico = () => {
        setAlertaActiva(true);
        publishMessage('simap/pabellonC/sistema/panico', 'ACTIVATED');
        // Simulamos que la alerta se apaga sola tras 5 segundos o se queda fija
        setTimeout(() => setAlertaActiva(false), 5000);
    };

    return (
        <div className="p-4 bg-dark text-white min-vh-100">
            {/* Banner de Estado Principal */}
            <div className={`status-banner mb-4 p-4 rounded text-center shadow ${alertaActiva ? 'bg-danger animate-pulse' : 'bg-success text-dark'}`}>
                <h2 className="fw-bold m-0">
                    {alertaActiva ? '🚨 ALERTA DE SEGURIDAD ACTIVADA 🚨' : 'SISTEMA OPERATIVO - PABELLÓN C SEGURO'}
                </h2>
                <small>{alertaActiva ? 'PROTOCOLO DE EMERGENCIA EN CURSO' : 'VIGILANCIA ACTIVA'}</small>
            </div>

            <div className="row g-4">
                {/* Columna de Controles Críticos */}
                <div className="col-md-6">
                    <div className="card bg-secondary-dark p-4 h-100">
                        <h4 className="text-muted mb-4 h6">CONTROLES DE INFRAESTRUCTURA</h4>
                        
                        <div className="d-grid gap-3">
                            {/* Control de Luz */}
                            <button 
                                className={`btn btn-lg fw-bold ${estadoLuz ? 'btn-info' : 'btn-outline-secondary'}`}
                                onClick={toggleLuz}
                            >
                                {estadoLuz ? '💡 APAGAR ILUMINACIÓN' : '🔦 ENCENDER ILUMINACIÓN'}
                            </button>

                            {/* Control de Exclusas (Servomotor) */}
                            <button 
                                className={`btn btn-lg fw-bold ${estadoLock ? 'btn-danger' : 'btn-warning text-dark'}`}
                                onClick={toggleLockdown}
                            >
                                {estadoLock ? '🔐 DESBLOQUEAR EXCLUSAS' : '🔒 EJECUTAR LOCKDOWN'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columna de Acción de Pánico */}
                <div className="col-md-6">
                    <div className="card bg-secondary-dark p-4 h-100 border-danger border-opacity-25">
                        <h4 className="text-muted mb-4 h6">SISTEMA DE RESPUESTA RÁPIDA</h4>
                        <button 
                            className="btn btn-danger w-100 h-100 d-flex flex-column align-items-center justify-content-center py-5"
                            onClick={triggerPanico}
                        >
                            <span style={{ fontSize: '3rem' }}>⚠️</span>
                            <span className="mt-2 fw-bold">BOTÓN DE PÁNICO</span>
                            <small className="opacity-75">INFORMAR A CENTRAL INMEDIATAMENTE</small>
                        </button>
                    </div>
                </div>
            </div>

            {/* Vista Previa de Nodos (Próximamente) */}
            <div className="mt-4 card bg-secondary-dark p-3">
                <div className="d-flex justify-content-between">
                    <span className="text-muted small">CONEXIÓN CON ESP32-A (SENSORES): <span className="text-success">EN LÍNEA</span></span>
                    <span className="text-muted small">CONEXIÓN CON ESP32-B (ACTUADORES): <span className="text-success">EN LÍNEA</span></span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;