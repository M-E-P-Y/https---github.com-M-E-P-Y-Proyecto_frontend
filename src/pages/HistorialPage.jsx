import React, { useEffect, useState } from 'react';
import { getAlertas } from '../services/alertaService';

const HistorialPage = () => {
    // CORRECCIÓN 1: Inicializar siempre como arreglo vacío []
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAlertas()
            .then(res => {
                // CORRECCIÓN 2: Asegurarnos de que res.data sea un arreglo
                setAlertas(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar historial:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-4 text-white">Cargando historial de seguridad...</div>;

    return (
        <div className="p-4 bg-dark text-white min-vh-100">
            <h2 className="fw-bold mb-4 text-danger">🚨 HISTORIAL DE EVENTOS - PABELLÓN C</h2>
            
            <div className="table-responsive bg-secondary-dark rounded shadow">
                <table className="table table-dark table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Mensaje</th>
                            <th>Nivel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* CORRECCIÓN 3: Validación de seguridad con 'length' */}
                        {alertas && alertas.length > 0 ? (
                            alertas.map((alerta, index) => (
                                <tr key={alerta.id || index}>
                                    <td>{new Date(alerta.fecha).toLocaleString()}</td>
                                    <td><span className="badge bg-info">{alerta.tipo}</span></td>
                                    <td>{alerta.mensaje}</td>
                                    <td>
                                        <span className={`fw-bold ${alerta.nivel === 'CRÍTICO' ? 'text-danger' : 'text-warning'}`}>
                                            {alerta.nivel}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">
                                    No hay eventos registrados en el historial.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialPage;