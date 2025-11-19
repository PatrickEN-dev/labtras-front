import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { fullBookingSchema, type BookingFormData } from "@/lib/booking-schemas";
import useDefaultData from "./api/useDefaultData";
import useBookingsApi from "./api/useBookingsApi";
import { format } from "date-fns";
import type { Location, Room, Manager } from "@/lib/mock-data";

export function useBookingEditModal(booking: Booking | null, onClose: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loaded, setLoaded] = useState(false);

  const defaultDataApi = useDefaultData();
  const bookingsApi = useBookingsApi();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(fullBookingSchema),
    mode: "onChange",
    defaultValues: {
      locationId: "",
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

  const loadData = useCallback(async () => {
    if (loaded) return;

    try {
      const defaultData = await defaultDataApi.getDefaultData();

      setLocations(defaultData.locations);
      setRooms(defaultData.rooms);
      setManagers(defaultData.managers);
      setLoaded(true);
    } catch {
      toast.error("Erro ao carregar dados do formulário");
    }
  }, [defaultDataApi, loaded]);

  useEffect(() => {
    if (booking && loaded) {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);

      form.reset({
        locationId: booking.room.location_id || "",
        roomId: booking.room_id || "",
        date: format(startDate, "yyyy-MM-dd"),
        startTime: format(startDate, "HH:mm"),
        endTime: format(endDate, "HH:mm"),
        managerId: booking.manager_id || "",
        name: booking.name || "",
        description: booking.description || "",
        purpose: "",
        hasRefreshments: booking.coffee_option || false,
        refreshmentQuantity: booking.coffee_quantity || 0,
        refreshmentDescription: booking.coffee_description || "",
      });
    }
  }, [booking, loaded, form]);

  const handleClose = useCallback(() => {
    form.reset({
      locationId: "",
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
    });
    onClose();
  }, [form, onClose]);

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

      const updateData = {
        room: formData.roomId,
        manager: formData.managerId,
        start_datetime: `${formData.date}T${formData.startTime}:00Z`,
        end_datetime: `${formData.date}T${formData.endTime}:00Z`,
        name: formData.name,
        description: formData.description || "",
        purpose: formData.purpose || "",
        coffee_option: formData.hasRefreshments,
        coffee_quantity: formData.hasRefreshments ? formData.refreshmentQuantity || 1 : 0,
        coffee_description: formData.hasRefreshments
          ? formData.refreshmentDescription || "Coffee break incluído"
          : "",
      };

      await bookingsApi.updateBooking(booking.id, updateData);

      toast.success("Reserva atualizada com sucesso!");

      handleClose();

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
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

  return {
    form,
    isSubmitting,
    locations,
    rooms,
    managers,
    loaded,
    loadData,
    handleClose,
    handleSubmit,
  };
}
