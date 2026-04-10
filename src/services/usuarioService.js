import axios from 'axios';

const API_URL = 'http://localhost:8080/api/usuarios';

export const getUsuarios = () => axios.get(API_URL);
export const createUsuario = (data) => axios.post(API_URL, data);
export const updateUsuario = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteUsuario = (id) => axios.delete(`${API_URL}/${id}`);