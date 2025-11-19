"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/business-components/booking-modal";
import { BookingStats, BookingList } from "@/components/business-components/booking";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "@/components/ui-base/confirm-dialog";
import { LoadingSpinner } from "@/components/feedback/loading-spinner";
import { useBookingsManagement } from "@/components/shared/hooks/useBookingsManagement";
import { BookingEditModal } from "@/components/business-components/booking-edit-modal";

export default function BookingsPage() {
  const {
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
  } = useBookingsManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <div className="ml-4">
          <h2 className="text-lg font-semibold">Carregando reservas...</h2>
          <p className="text-gray-600">Aguarde enquanto carregamos suas reservas</p>
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

      <BookingStats bookings={bookings} />

      <BookingList
        bookings={bookings}
        loading={loading}
        onEdit={handleEditBooking}
        onDelete={handleDeleteBooking}
        onCreateNew={handleCreateBooking}
      />

      <BookingModal
        open={isModalOpen}
        onClose={() => {
          handleCloseModal();
          refreshBookings();
        }}
      />

      {editingBooking && (
        <BookingEditModal
          open={isEditModalOpen}
          onClose={() => {
            handleCloseEditModal();
            refreshBookings();
          }}
          booking={editingBooking}
        />
      )}

      <ConfirmDialog
        open={!!bookingToDelete}
        onClose={() => setBookingToDelete(null)}
        onConfirm={confirmDeleteBooking}
        title="Confirmar exclusão"
        description="Tem certeza de que deseja excluir esta reserva? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
      />
    </div>
  );
}
