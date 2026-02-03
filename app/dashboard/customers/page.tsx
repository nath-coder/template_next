"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import { customersApi } from "@/app/helpers/api";
import { Customer } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/app/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { CustomerTableSkeleton } from "@/app/components/ui/skeleton";
import { ErrorState } from "@/app/components/ui/error-state";
import { AddCustomerModal, DeleteCustomerModal, EditCustomerModal } from "@/app/components/ui/customer-modals";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
import { Search, MoreHorizontal, Mail, User, Users } from "lucide-react";

// Hook personalizado para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Componente de estadísticas
function CustomerStats({ customers, isLoading }: { customers: Customer[], isLoading: boolean }) {
  const stats = useMemo(() => {
    if (isLoading) return { total: 0, domains: 0 };
    
    const uniqueDomains = new Set(
      customers.map(customer => customer.email.split('@')[1])
    ).size;
    
    return {
      total: customers.length,
      domains: uniqueDomains
    };
  }, [customers, isLoading]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : stats.total}</div>
          <p className="text-xs text-muted-foreground">Clientes registrados</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dominios Únicos</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : stats.domains}</div>
          <p className="text-xs text-muted-foreground">Empresas diferentes</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estado</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Activo
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Sistema operativo</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal de la tabla
function CustomersTable({
  customers, 
  isLoading, 
  searchTerm, 
  currentPage, 
  itemsPerPage, 
  onPageChange,
  onDeleteCustomer,
  onEditCustomer
}: { 
  customers: Customer[], 
  isLoading: boolean,
  searchTerm: string,
  currentPage: number,
  itemsPerPage: number,
  onPageChange: (page: number) => void,
  onDeleteCustomer: (customer: Customer) => void,
  onEditCustomer: (customer: Customer) => void
}) {
  if (isLoading) {
    return <CustomerTableSkeleton />;
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos de paginación
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Lista de Clientes
          <Badge variant="outline" className="ml-auto">
            {totalItems} total • {currentCustomers.length} en esta página
          </Badge>
        </CardTitle>
        <CardDescription>
          Gestiona y visualiza todos los clientes registrados en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Dominio</TableHead>
              <TableHead className="w-12">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No se encontraron clientes</p>
                    <p className="text-sm text-muted-foreground">
                      Intenta con un término diferente
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentCustomers.map((customer, index) => (
                <TableRow key={customer._id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {String(startIndex + index + 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={customer.image_url} alt={customer.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">{customer.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          ID: {customer._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      @{customer.email.split('@')[1]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditCustomer(customer)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => onDeleteCustomer(customer)}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} resultados
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {/* Páginas numeradas */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => onPageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente principal
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<'cors' | 'general' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cargar customers iniciales
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await customersApi.getCustomers();
        setCustomers(data);
      } catch (err: unknown) {
        // Detectar tipo de error
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        const isCorsError = errorMessage.includes('CORS') || 
                           errorMessage.includes('Network Error') ||
                           errorMessage.includes('blocked');
        
        setError(isCorsError ? 'cors' : 'general');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleRetry = () => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await customersApi.getCustomers();
        setCustomers(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        const isCorsError = errorMessage.includes('CORS') || 
                           errorMessage.includes('Network Error') ||
                           errorMessage.includes('blocked');
        
        setError(isCorsError ? 'cors' : 'general');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  };

  // Manejadores de modales y paginación
  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setEditModalOpen(true);
  };

  const handleCustomerDeleted = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c._id !== customerId));
    setCustomerToDelete(null);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => 
      c._id === updatedCustomer._id ? updatedCustomer : c
    ));
    setCustomerToEdit(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset página cuando cambia la búsqueda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra la base de datos de clientes registrados
          </p>
        </div>
        <AddCustomerModal onCustomerAdded={handleCustomerAdded} />
      </div>

      {/* Error State */}
      {error && (
        <ErrorState
          title={error === 'cors' ? 'Error de Conexión' : 'Error al Cargar Datos'}
          message={error === 'cors' 
            ? 'No se pudo conectar directamente con la API externa debido a restricciones CORS.' 
            : 'Hubo un problema al cargar los datos de los clientes.'}
          type={error}
          onRetry={handleRetry}
        />
      )}

      {/* Stats */}
      <CustomerStats customers={customers} isLoading={isLoading} />

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline" className="hidden md:flex">
          {searchTerm ? `Buscando: "${searchTerm}"` : "Todos los clientes"}
        </Badge>
      </div>

      {/* Table */}
      <Suspense fallback={<CustomerTableSkeleton />}>
        <CustomersTable 
          customers={customers} 
          isLoading={isLoading}
          searchTerm={debouncedSearchTerm}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onDeleteCustomer={handleDeleteCustomer}
          onEditCustomer={handleEditCustomer}
        />
      </Suspense>

      {/* Modal de eliminación */}
      <DeleteCustomerModal
        customer={customerToDelete}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onCustomerDeleted={handleCustomerDeleted}
      />

      {/* Modal de edición */}
      <EditCustomerModal
        customer={customerToEdit}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onCustomerUpdated={handleCustomerUpdated}
      />
    </div>
  );
}