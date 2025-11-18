import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/generic-components/modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookingLocation, BookingDateTime, BookingAdditionalConfig } from "./booking";
import { fullBookingSchema, type BookingFormData } from "@/lib/booking-schemas";
import { toast } from "sonner";
import useSmartBookingCreation from "@/components/business-components/hooks/api/useSmartBookingCreation";
import useDefaultData from "@/components/business-components/hooks/api/useDefaultData";
import type { Location, Room, Manager } from "@/lib/mock-data";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const smartBookingApi = useSmartBookingCreation();
  const defaultDataApi = useDefaultData();
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

        if (data.defaultIds.locationId) {
          form.setValue("locationId", data.defaultIds.locationId);
        }
        if (data.defaultIds.managerId) {
          form.setValue("managerId", data.defaultIds.managerId);
        }

        setLoaded(true);
      } catch (error) {
        toast.error("Erro ao carregar dados. Tente novamente.");
      }
    };

    loadData();
  }, [open, loaded, defaultDataApi, form]);

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

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Preencha todos os campos obrigatórios corretamente");
        return;
      }

      const formData = form.getValues();

      const result = await smartBookingApi.createBookingWithResources(formData);

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

  const footer = (
    <div className="flex items-center justify-between px-8 py-6 border-t bg-linear-to-r from-slate-50 to-gray-50 backdrop-blur-sm">
      <div className="text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Sistema de reservas LabTrans
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
          className="px-8 py-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
              Criando Reserva...
            </>
          ) : (
            "✨ Criar Reserva"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      toggle={handleClose}
      title="Nova Reserva"
      size="lg"
      footer={footer}
      className="max-w-5xl"
      contentClassName="p-0 bg-gradient-to-br from-white to-slate-50"
    >
      <div className="px-8 py-6 border-b bg-linear-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
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
                d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-9 4V7a1 1 0 011-1h10a1 1 0 011 1v4m-9 4v4a1 1 0 001 1h8a1 1 0 001-1v-4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Nova Reserva
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Agende sua sala de reunião de forma rápida e fácil
            </p>
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
                    className="animate-spin h-8 w-8 text-blue-600"
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
                <p className="text-slate-600 font-medium">Carregando dados do sistema...</p>
                <p className="text-sm text-slate-400">Preparando as informações necessárias</p>
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
