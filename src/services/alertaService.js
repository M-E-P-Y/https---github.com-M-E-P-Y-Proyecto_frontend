import axios from 'axios';

const API_URL = 'http://localhost:8080/api/alertas';

// Esta es la función que React no encuentra:
export const getAlertas = async () => {
    try {
        return await axios.get(API_URL);
    } catch (error) {
        console.error("Error en getAlertas:", error);
        throw error;
    }
};

// También añadimos la de crear por si la necesitas luego
export const registrarAlerta = async (tipo, mensaje, nivel) => {
    try {
        const nuevaAlerta = {
            fecha: new Date().toLocaleString(),
            tipo: tipo,
            mensaje: mensaje,
            nivel: nivel
        };
        return await axios.post(API_URL, nuevaAlerta);
    } catch (error) {
        console.error("Error al registrar alerta:", error);
    }
};