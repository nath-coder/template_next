import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Configuración de la API externa
const API_BASE_URL = 'https://backend-next-tutorial-fay6a.ondigitalocean.app/api/v1';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzViZTQ3NjFjYzI2MzJhOWQxZDc4ZSIsImVtYWlsIjoiZGlhbmFAZ21haWwuY29tIiwibmFtZSI6IkRpYW5hUHJpbmNlIiwiaWF0IjoxNzcwMDg1NTMyfQ.UUiYi7s5rsNEUNhLdAivo8sdA2ozvYRXiCm-L73mxH8';

// Configurar axios para el servidor
const serverApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`,
  },
});

// GET /api/customers - Obtener todos los customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    const params = search ? { search } : {};
    const response = await serverApi.get('/customer', { params });
    
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching customers:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      return NextResponse.json(
        { error: 'Failed to fetch customers', details: message },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Crear un nuevo customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await serverApi.post('/customer', body);
    
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      return NextResponse.json(
        { error: 'Failed to create customer', details: message },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}