import React, { useState } from "react";
import { customersApi } from "@/service/api";
import { Customer } from "@/lib/types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";

interface AddCustomerModalProps {
  onCustomerAdded: (customer: Customer) => void;
}

export function AddCustomerModal({ onCustomerAdded }: AddCustomerModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      return;
    }

    try {
      setIsLoading(true);
      const newCustomer = await customersApi.createCustomer({
        ...formData,
        image_url: formData.image_url || `https://randomuser.me/api/portraits/med/men/${Math.floor(Math.random() * 99)}.jpg`
      });
      
      onCustomerAdded(newCustomer);
      setOpen(false);
      setFormData({ name: "", email: "", image_url: "" });
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Completa la información del nuevo cliente. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                Foto URL
              </Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="col-span-3"
                placeholder="https://ejemplo.com/foto.jpg (opcional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteCustomerModalProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerDeleted: (customerId: string) => void;
}

export function DeleteCustomerModal({
  customer,
  open,
  onOpenChange,
  onCustomerDeleted,
}: DeleteCustomerModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!customer) return;

    try {
      setIsLoading(true);
      await customersApi.deleteCustomer(customer._id);
      onCustomerDeleted(customer._id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Cliente</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a <strong>{customer.name}</strong>?
            <br />
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditCustomerModalProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerUpdated: (customer: Customer) => void;
}

export function EditCustomerModal({
  customer,
  open,
  onOpenChange,
  onCustomerUpdated,
}: EditCustomerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image_url: "",
  });

  // Llenar el formulario cuando se abre el modal
  React.useEffect(() => {
    if (customer && open) {
      setFormData({
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
      });
    }
  }, [customer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !customer) {
      return;
    }

    try {
      setIsLoading(true);
      const updatedCustomer = await customersApi.updateCustomer(customer._id, {
        ...formData,
        image_url: formData.image_url || customer.image_url
      });
      
      onCustomerUpdated(updatedCustomer);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información de <strong>{customer.name}</strong>. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nombre *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email *
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image_url" className="text-right">
                Foto URL
              </Label>
              <Input
                id="edit-image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="col-span-3"
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}