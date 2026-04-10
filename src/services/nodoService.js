import axios from 'axios';

const API_URL = 'http://localhost:8080/api/nodos';

export const getNodos = () => axios.get(API_URL);