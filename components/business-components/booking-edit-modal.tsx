import React, { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { Modal } from "@/components/ui-base/modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookingLocation, BookingDateTime, BookingAdditionalConfig } from "./booking";
import { LoadingSpinner } from "@/components/feedback/loading-spinner";
import { useBookingEditModal } from "@/components/shared/hooks/useBookingEditModal";
import { Edit3 } from "lucide-react";

interface BookingEditModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export function BookingEditModal({ open, onClose, booking }: BookingEditModalProps) {
  const {
    form,
    isSubmitting,
    locations,
    rooms,
    managers,
    loaded,
    loadData,
    handleClose,
    handleSubmit,
  } = useBookingEditModal(booking, onClose);

  useEffect(() => {
    if (open && !loaded) {
      loadData();
    }
  }, [open, loaded, loadData]);

  const locationId = useWatch({
    control: form.control,
    name: "locationId",
  });

  const filteredRoomsByLocation = useMemo(() => {
    if (!locationId) return [];

    const filtered = rooms.filter((r) => {
      const matches =
        r.location === locationId ||
        (r as any).location_id === locationId ||
        (r as any).location?.id === locationId;

      return matches;
    });

    if (filtered.length === 0 && rooms.length > 0) {
      return rooms;
    }

    return filtered;
  }, [rooms, locationId]);

  const footer = (
    <div className="flex items-center justify-between px-8 py-6 border-t bg-linear-to-r from-slate-50 to-gray-50 backdrop-blur-sm">
      <div className="text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Editando reserva: {booking?.name || "Sem título"}
        </span>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="px-6">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          {isSubmitting ? <LoadingSpinner size="sm" inline /> : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal open={open} toggle={handleClose} size="xl">
      <div className="flex flex-col h-[90vh] max-h-[800px]">
        <div className="px-8 py-6 border-b bg-linear-to-r from-orange-50 to-red-50">
          <h2 className="text-2xl font-bold text-gray-900">Editar Reserva</h2>
          <p className="text-gray-600 mt-1">Modifique os dados da reserva conforme necessário</p>
        </div>

        <ScrollArea className="flex-1 px-8 py-6">
          {!loaded ? (
            <div className="flex flex-col items-center justify-center h-64">
              <LoadingSpinner size="lg" text="Carregando dados da reserva..." />
            </div>
          ) : (
            <div className="space-y-8">
              <BookingLocation form={form} locations={locations} rooms={filteredRoomsByLocation} />

              <BookingDateTime form={form} rooms={rooms} excludeBookingId={booking?.id} />

              <BookingAdditionalConfig form={form} managers={managers} />
            </div>
          )}
        </ScrollArea>

        {footer}
      </div>
    </Modal>
  );
}
