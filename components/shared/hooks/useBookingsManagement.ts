import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useBookingsApi from "./api/useBookingsApi";

export function useBookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const bookingsApi = useBookingsApi();

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookingsApi.getBookings();
      setBookings(data);
    } catch {
      toast.error("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateBooking = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleEditBooking = useCallback((booking: Booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteBooking = useCallback((id: string) => {
    setBookingToDelete(id);
  }, []);

  const confirmDeleteBooking = useCallback(async () => {
    if (!bookingToDelete) return;

    try {
      await bookingsApi.deleteBooking(bookingToDelete);
      setBookings((prev) => prev.filter((b) => b.id !== bookingToDelete));
      toast.success("Reserva excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir reserva");
    } finally {
      setBookingToDelete(null);
    }
  }, [bookingToDelete]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingBooking(null);
  }, []);

  const refreshBookings = useCallback(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    loadBookings();
  }, []);

  return {
    bookings,
    loading,
    isModalOpen,
    isEditModalOpen,
    editingBooking,
    bookingToDelete,
    handleCreateBooking,
    handleEditBooking,
    handleDeleteBooking,
    confirmDeleteBooking,
    handleCloseModal,
    handleCloseEditModal,
    refreshBookings,

    setBookingToDelete,
  };
}
