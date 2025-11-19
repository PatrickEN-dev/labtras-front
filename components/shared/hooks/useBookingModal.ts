import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { fullBookingSchema, type BookingFormData } from "@/lib/booking-schemas";
import useSmartBookingCreation from "./api/useSmartBookingCreation";
import useDefaultData from "./api/useDefaultData";
import type { Location, Room, Manager } from "@/lib/mock-data";

export function useBookingModal(onClose: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loaded, setLoaded] = useState(false);

  const smartBookingApi = useSmartBookingCreation();
  const defaultDataApi = useDefaultData();

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

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Preencha todos os campos obrigatórios corretamente");
        return;
      }

      const formData = form.getValues();
      await smartBookingApi.createBookingWithResources(formData);

      toast.success("Reserva criada com sucesso!");
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("400")) {
          toast.error("Dados inválidos. Verifique os campos e tente novamente.");
        } else if (error.message.includes("409")) {
          toast.error("Conflito de horário. Esta sala já está reservada no horário selecionado.");
        } else if (error.message.includes("404")) {
          toast.error("Recurso não encontrado. Tente recarregar a página.");
        } else {
          toast.error("Erro ao criar reserva. Tente novamente.");
        }
      } else {
        toast.error("Erro inesperado ao criar reserva.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [form, smartBookingApi, handleClose]);

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
