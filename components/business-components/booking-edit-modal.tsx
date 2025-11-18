import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/generic-components/modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookingLocation, BookingDateTime, BookingAdditionalConfig } from "./booking";
import { fullBookingSchema, type BookingFormData } from "@/lib/booking-schemas";
import { toast } from "sonner";

import useDefaultData from "@/components/business-components/hooks/api/useDefaultData";
import useBookingsApi from "@/components/business-components/hooks/api/useBookingsApi";
import type { Location, Room, Manager } from "@/lib/mock-data";

interface BookingEditModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export function BookingEditModal({ open, onClose, booking }: BookingEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultDataApi = useDefaultData();
  const bookingsApi = useBookingsApi();
  const [locations, setLocations] = useState<Location[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loaded, setLoaded] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(fullBookingSchema),
    mode: "onChange",
    defaultValues: {
      locationId: "",
      customLocation: "",
      roomId: "",
      date: "",
      startTime: "",
      endTime: "",
      managerId: "",
      name: "",
      description: "",
      purpose: "",
      hasRefreshments: false,
      refreshmentQuantity: 0,
      refreshmentDescription: "",
    },
  });

  useEffect(() => {
    if (booking && open) {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);

      form.reset({
        locationId: "",
        customLocation: "",
        roomId: booking.room_id,
        date: startDate.toISOString().split("T")[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        managerId: booking.manager_id,
        name: booking.name || "",
        description: booking.description || "",
        hasRefreshments: booking.coffee_option,
        refreshmentQuantity: booking.coffee_quantity || 0,
        refreshmentDescription: booking.coffee_description || "",
      });
    }
  }, [booking, open, form]);

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  useEffect(() => {
    if (!open) return;
    if (loaded) return;

    const loadData = async () => {
      try {
        const data = await defaultDataApi.getDefaultData();
        setLocations(data.locations);
        setRooms(data.rooms);
        setManagers(data.managers);
        setLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente.");
      }
    };

    loadData();
  }, [open, loaded, defaultDataApi]);

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

  const handleSubmit = useCallback(async () => {
    if (!booking) return;

    try {
      setIsSubmitting(true);

      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Preencha todos os campos obrigatórios corretamente");
        return;
      }

      const formData = form.getValues();
      console.log("Dados do formulário para edição:", formData);

      const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`).toISOString();
      const endDateTime = new Date(`${formData.date}T${formData.endTime}:00`).toISOString();

      const updateData = {
        room: formData.roomId,
        manager: formData.managerId,
        start_date: startDateTime,
        end_date: endDateTime,
        name: formData.name || "Reunião sem título",
        description: formData.description || "",
        purpose: formData.purpose || "Reunião agendada via sistema",
        coffee_option: formData.hasRefreshments,
        coffee_quantity: formData.hasRefreshments ? formData.refreshmentQuantity || 1 : 0,
        coffee_description: formData.hasRefreshments
          ? formData.refreshmentDescription || "Coffee break incluído"
          : "",
      };

      await bookingsApi.updateBooking(booking.id, updateData);

      console.log("Booking atualizado com sucesso");
      toast.success("Reserva atualizada com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Erro ao atualizar reserva:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          toast.error("Dados inválidos. Verifique os campos e tente novamente.");
        } else if (error.message.includes("409")) {
          toast.error("Conflito de horário. Esta sala já está reservada no horário selecionado.");
        } else if (error.message.includes("404")) {
          toast.error("Reserva não encontrada. Tente recarregar a página.");
        } else {
          toast.error("Erro ao atualizar reserva. Tente novamente.");
        }
      } else {
        toast.error("Erro inesperado ao atualizar reserva.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [form, bookingsApi, booking, handleClose]);

  const footer = (
    <div className="flex items-center justify-between px-8 py-6 border-t bg-linear-to-r from-slate-50 to-gray-50 backdrop-blur-sm">
      <div className="text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          Editando reserva
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={isSubmitting}
          className="px-6 py-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Atualizando Reserva...
            </>
          ) : (
            "✅ Salvar Alterações"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      toggle={handleClose}
      title="Editar Reserva"
      size="lg"
      footer={footer}
      className="max-w-5xl"
      contentClassName="p-0 bg-gradient-to-br from-white to-slate-50"
    >
      <div className="px-8 py-6 border-b bg-linear-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Editar Reserva
            </h2>
            <p className="text-sm text-slate-500 mt-1">Modifique os detalhes da sua reserva</p>
          </div>
        </div>
      </div>

      <ScrollArea className="max-h-[75vh]">
        <div className="space-y-8 p-8">
          {!loaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <svg
                    className="animate-spin h-8 w-8 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">Carregando dados da reserva...</p>
                <p className="text-sm text-slate-400">Preparando formulário de edição</p>
              </div>
            </div>
          ) : (
            <>
              <BookingLocation form={form} locations={locations} rooms={filteredRoomsByLocation} />
              <BookingDateTime form={form} />
              <BookingAdditionalConfig form={form} managers={managers} />
            </>
          )}
        </div>
      </ScrollArea>
    </Modal>
  );
}
