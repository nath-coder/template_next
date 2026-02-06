import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { serverApi } from '@/lib/ServiceApi';


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