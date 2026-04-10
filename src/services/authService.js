import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const loginOficial = async (matricula, password) => {
    try {
        // Ajustamos a la ruta de tu backend en Go
        const response = await axios.post(`${API_URL}/login`, {
            username: matricula, // Cambiamos a 'username' para que coincida con tu DTO en Go
            password: password
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error de conexión");
    }
};