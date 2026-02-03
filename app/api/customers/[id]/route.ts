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

// GET /api/customers/[id] - Obtener un customer por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const response = await serverApi.get(`/customer/${id}`);
    
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching customer:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      return NextResponse.json(
        { error: 'Failed to fetch customer', details: message },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Actualizar un customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const response = await serverApi.put(`/customer/${id}`, body);
    
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error updating customer:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      return NextResponse.json(
        { error: 'Failed to update customer', details: message },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Eliminar un customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await serverApi.delete(`/customer/${id}`);
    
    return NextResponse.json(
      { message: 'Customer deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting customer:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      return NextResponse.json(
        { error: 'Failed to delete customer', details: message },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}