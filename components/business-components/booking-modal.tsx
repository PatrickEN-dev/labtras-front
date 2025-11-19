import React, { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { Modal } from "@/components/ui-base/modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookingLocation, BookingDateTime, BookingAdditionalConfig } from "./booking";
import { LoadingSpinner } from "@/components/feedback/loading-spinner";
import { useBookingModal } from "@/components/shared/hooks/useBookingModal";
import { Sparkles } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ open, onClose }: BookingModalProps) {
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
  } = useBookingModal(onClose);

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
    if (!locationId) {
      return [];
    }

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
          <Sparkles className="h-4 w-4" />
          Sistema inteligente de reservas
        </span>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="px-6">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSubmitting ? <LoadingSpinner size="sm" inline /> : "Criar Reserva"}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal open={open} toggle={handleClose} size="xl">
      <div className="flex flex-col h-[90vh] max-h-[800px]">
        <div className="px-8 py-6 border-b bg-linear-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-900">Nova Reserva</h2>
          <p className="text-gray-600 mt-1">Preencha os dados para criar uma nova reserva</p>
        </div>

        <ScrollArea className="flex-1 px-8 py-6">
          {!loaded ? (
            <div className="flex flex-col items-center justify-center h-64">
              <LoadingSpinner size="lg" text="Carregando formulário..." />
            </div>
          ) : (
            <div className="space-y-8">
              <BookingLocation form={form} locations={locations} rooms={filteredRoomsByLocation} />

              <BookingDateTime form={form} rooms={rooms} />

              <BookingAdditionalConfig form={form} managers={managers} />
            </div>
          )}
        </ScrollArea>

        {footer}
      </div>
    </Modal>
  );
}
