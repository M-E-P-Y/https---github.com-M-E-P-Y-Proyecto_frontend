import React, { useEffect, useState } from 'react';
import { subscribeToTopic } from '../services/mqttService';
import { getNodos } from '../services/nodoService';
import { registrarAlerta } from '../services/alertaService'; // Importamos el servicio de base de datos

const NodosPage = () => {
    const [nodos, setNodos] = useState([]);
    const [datosSensores, setDatosSensores] = useState({
        proximidad: "0",
        movimiento: "No detectado",
        boton: "Reposo"
    });

    useEffect(() => {
        // 1. Cargar configuración de la DB (MongoDB -> Go -> React)
        getNodos().then(res => setNodos(res.data)).catch(err => console.error("Error al cargar nodos:", err));

        // --- SUSCRIPCIONES MQTT ---

        // 1. Ultrasonido
        subscribeToTopic('simap/pabellonC/sensores/ultrasonido', (msg) => {
            setDatosSensores(prev => ({ ...prev, proximidad: msg }));
        });

        // 2. Movimiento (Sincronizado con Wokwi)
        subscribeToTopic('simap/pabellonC/sensores/movimiento', (msg) => {
            const detectado = msg === 'DETECTADO';
            
            setDatosSensores(prev => ({ 
                ...prev, 
                movimiento: detectado ? '¡MOVIMIENTO!' : 'Calma' 
            }));

            // Si detecta movimiento, manda a guardar en MongoDB automáticamente
            if (detectado) {
                registrarAlerta({
                    tipo: "MOVIMIENTO",
                    mensaje: "Intrusión detectada en área restringida - Pabellón C",
                    nivel: "CRÍTICO"
                }).catch(err => console.error("Error al guardar historial:", err));
            }
        });

        // 3. Botón de Pánico (Sincronizado con Wokwi)
        subscribeToTopic('simap/pabellonC/actuadores/panico', (msg) => {
            const activado = msg === 'ON';

            setDatosSensores(prev => ({ 
                ...prev, 
                boton: activado ? 'PRESIONADO' : 'Reposo' 
            }));

            // Si se presiona el botón, guarda el evento de pánico
            if (activado) {
                registrarAlerta({
                    tipo: "PÁNICO",
                    mensaje: "Botón de pánico activado físicamente por oficial",
                    nivel: "ALTO"
                }).catch(err => console.error("Error al guardar historial:", err));
            }
        });
        
    }, []);

    return (
        <div className="p-4 bg-dark text-white min-vh-100">
            <h2 className="fw-bold mb-4"><span className="text-info">|</span> ESTADO DE NODOS - PABELLÓN C</h2>

            <div className="row g-4">
                {/* Sensor Ultrasonido */}
                <div className="col-md-4">
                    <div className="card bg-secondary-dark p-4 border-0 shadow">
                        <h6 className="text-muted">DISTANCIA (ULTRASONIDO)</h6>
                        <div className="d-flex align-items-end gap-2 my-3">
                            <span className="h1 mb-0 fw-bold text-info">{datosSensores.proximidad}</span>
                            <span className="h4 mb-1 text-muted">cm</span>
                        </div>
                        <div className="progress bg-dark" style={{ height: '10px' }}>
                            <div 
                                className={`progress-bar ${parseInt(datosSensores.proximidad) < 20 ? 'bg-danger' : 'bg-info'}`} 
                                style={{ width: `${Math.min(parseInt(datosSensores.proximidad), 100)}%` }}
                            ></div>
                        </div>
                        <small className="mt-2 text-muted">Detección de proximidad en puerta</small>
                    </div>
                </div>

                {/* Sensor Movimiento */}
                <div className="col-md-4">
                    <div className={`card p-4 border-0 shadow ${datosSensores.movimiento === '¡MOVIMIENTO!' ? 'bg-danger-subtle border-danger' : 'bg-secondary-dark'}`}>
                        <h6 className={datosSensores.movimiento === '¡MOVIMIENTO!' ? 'text-danger' : 'text-muted'}>SENSOR PIR</h6>
                        <div className="text-center my-4">
                            <span className="h2 fw-bold text-dark">
                                {datosSensores.movimiento === '¡MOVIMIENTO!' ? '🏃 DETECTADO' : '🛡️ DESPEJADO'}
                            </span>
                        </div>
                        <p className="small text-center text-muted mb-0">Rastreador de presencia área 1</p>
                    </div>
                </div>

                {/* Botón de Activación Física */}
                <div className="col-md-4">
                    <div className="card bg-secondary-dark p-4 border-0 shadow">
                        <h6 className="text-muted">INTERRUPTOR FÍSICO ESP32</h6>
                        <div className="text-center my-4">
                            <span className={`h2 fw-bold ${datosSensores.boton === 'PRESIONADO' ? 'text-warning' : 'text-white-50'}`}>
                                {datosSensores.boton === 'PRESIONADO' ? '🔘 ACTIVADO' : '⚪ REPOSO'}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between small text-muted">
                            <span>Estado manual:</span>
                            <span className={datosSensores.boton === 'PRESIONADO' ? 'text-warning' : 'text-success'}>FUNCIONAL</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listado de Nodos registrados en MongoDB */}
            <div className="mt-5">
                <h5 className="text-muted h6 mb-3">INFRAESTRUCTURA REGISTRADA (MONGODB)</h5>
                <div className="table-responsive bg-secondary-dark rounded">
                    <table className="table table-dark table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Nombre / Ubicación</th>
                                <th>IP Asignada</th>
                                <th>Estado Red</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nodos.length > 0 ? nodos.map((n, index) => (
                                <tr key={n.id || index}>
                                    <td>{n.nombre_ubicacion}</td>
                                    <td>{n.ip_asignada}</td>
                                    <td><span className="text-success">● ONLINE</span></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">Buscando infraestructura en SIMAP...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NodosPage;