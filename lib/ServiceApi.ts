
// Configuración de la API externa

import axios from "axios";

// Configurar axios para el servidor
const serverApi = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.API_TOKEN}`,
  },
});

export { serverApi };