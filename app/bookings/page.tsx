"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookingModal } from "@/components/business-components/booking-modal";
import { BookingEditModal } from "@/components/business-components/booking-edit-modal";
import { Calendar, Clock, MapPin, User, Coffee, Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import useBookingsApi from "@/components/business-components/hooks/api/useBookingsApi";

type BookingType = Booking;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingType | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const bookingsApi = useBookingsApi();

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsApi.getBookings();
      setBookings(data);
    } catch (error) {
      toast.error("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateBooking = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    loadBookings();
  };

  const handleEditBooking = (booking: BookingType) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBooking(null);
    loadBookings();
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      await bookingsApi.deleteBooking(bookingToDelete);
      toast.success("Reserva excluída com sucesso!");
      setBookingToDelete(null);
      loadBookings();
    } catch (error) {
      toast.error("Erro ao excluir reserva");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "dd/MM/yyyy", { locale: ptBR }),
      time: format(date, "HH:mm", { locale: ptBR }),
    };
  };

  const getBookingStatus = (booking: BookingType) => {
    const now = new Date();
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);

    if (endDate < now) return { label: "Finalizada", color: "bg-gray-500" };
    if (startDate <= now && endDate >= now) return { label: "Em andamento", color: "bg-green-500" };
    return { label: "Agendada", color: "bg-blue-500" };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas de Salas</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as reservas do sistema</p>
        </div>
        <Button onClick={handleCreateBooking} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Reserva
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    bookings.filter((b) => {
                      const today = new Date().toDateString();
                      const bookingDate = new Date(b.start_date).toDateString();
                      return bookingDate === today;
                    }).length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Café</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.coffee_option).length}
                </p>
              </div>
              <Coffee className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    bookings.filter((b) => {
                      const now = new Date();
                      const startDate = new Date(b.start_date);
                      const endDate = new Date(b.end_date);
                      return startDate <= now && endDate >= now;
                    }).length
                  }
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma reserva encontrada</h3>
              <p className="text-gray-600 mb-4">
                Não há reservas disponíveis no momento. Isso pode ser porque a API está indisponível
                ou não há dados cadastrados.
              </p>
              <Button onClick={handleCreateBooking} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Reserva
              </Button>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => {
            const startDateTime = formatDateTime(booking.start_date);
            const endDateTime = formatDateTime(booking.end_date);
            const status = getBookingStatus(booking);

            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${status.color}`}
                        >
                          {status.label}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.name || "Reunião sem título"}
                        </h3>
                      </div>

                      {booking.description && (
                        <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                          {booking.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{booking.room.name}</p>
                            <p className="text-xs text-gray-500">
                              Capacidade: {booking.room.capacity} pessoas
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{booking.manager.name}</p>
                            <p className="text-xs text-gray-500">{booking.manager.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{startDateTime.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {startDateTime.time} - {endDateTime.time}
                          </span>
                        </div>
                      </div>

                      {booking.coffee_option && (
                        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
                          <Coffee className="h-4 w-4" />
                          <span>
                            Coffee break para {booking.coffee_quantity || 1} pessoas
                            {booking.coffee_description && ` - ${booking.coffee_description}`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBooking(booking)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBookingToDelete(booking.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <BookingModal open={isModalOpen} onClose={handleCloseModal} />

      <BookingEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        booking={editingBooking}
      />

      <AlertDialog open={!!bookingToDelete} onOpenChange={() => setBookingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBooking}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
