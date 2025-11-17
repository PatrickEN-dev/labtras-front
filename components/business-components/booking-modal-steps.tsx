import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/generic-components/modal";
import { Stepper, Step } from "@/components/generic-components/stepper";
import { Button } from "@/components/ui/button";
import {
  BookingBasicInfo,
  BookingLocation,
  BookingDateTime,
  BookingAdditionalConfig,
} from "./booking";
import { fullBookingSchema, type BookingFormData } from "@/lib/booking-schemas";
import { toast } from "sonner";
import {
  FileText,
  MapPin,
  CalendarIcon,
  Settings,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import useBookingsApi from "@/components/business-components/hooks/api/useBookingsApi";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const STEPS: Step[] = [
  {
    id: "basic-info",
    title: "Informações",
    description: "Dados básicos",
    icon: FileText,
  },
  {
    id: "location",
    title: "Local",
    description: "Sala e localização",
    icon: MapPin,
  },
  {
    id: "datetime",
    title: "Data/Hora",
    description: "Quando será",
    icon: CalendarIcon,
  },
  {
    id: "config",
    title: "Configuração",
    description: "Ajustes finais",
    icon: Settings,
  },
];

export function BookingModalSteps({ open, onClose }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookingsApi = useBookingsApi();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(fullBookingSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      locationId: "",
      roomId: "",
      date: "",
      startTime: "",
      endTime: "",
      managerId: "",
      numberOfParticipants: 1,
      hasVideoCall: false,
      hasRefreshments: false,
      equipmentNeeded: [],
      notes: "",
    },
  });

  const handleClose = useCallback(() => {
    form.reset();
    setCurrentStep(0);
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      const formData = form.getValues();

      // Preparar dados para envio seguindo a interface CreateBookingData
      const bookingData = {
        room: formData.roomId,
        manager: formData.managerId || "",
        start_date: formData.date || "",
        end_date: formData.date || "", // Mesmo dia por enquanto
        coffee_option: formData.hasRefreshments,
        coffee_quantity: formData.hasRefreshments ? 1 : 0,
        coffee_description: formData.hasRefreshments ? "Coffee break incluído" : "",
      };

      await bookingsApi.createBooking(bookingData);
      toast.success("Reserva criada com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      toast.error("Erro ao criar reserva. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, bookingsApi, handleClose]);

  const handleNext = useCallback(async () => {
    // Valida os campos do step atual
    const isStepValid = await form.trigger();

    if (!isStepValid) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  }, [currentStep, form, handleSubmit]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback(
    async (stepIndex: number) => {
      // Permitir voltar sempre, validar para avançar
      if (stepIndex <= currentStep) {
        setCurrentStep(stepIndex);
      } else {
        const isValid = await form.trigger();
        if (isValid) {
          setCurrentStep(stepIndex);
        } else {
          toast.error("Preencha os campos obrigatórios antes de avançar.");
        }
      }
    },
    [currentStep, form]
  );

  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 0:
        return <BookingBasicInfo form={form} />;
      case 1:
        return <BookingLocation form={form} />;
      case 2:
        return <BookingDateTime form={form} />;
      case 3:
        return <BookingAdditionalConfig form={form} />;
      default:
        return null;
    }
  }, [currentStep, form]);

  // Verifica se pode prosseguir para o próximo step
  const canProceed = Object.keys(form.formState.errors).length === 0;

  const footer = (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 0}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-2">
        {currentStep === STEPS.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Criando..." : "Criar Reserva"}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed} className="flex items-center gap-2">
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  // Mostra erros de validação se houver
  const hasErrors = Object.keys(form.formState.errors).length > 0;
  const firstError = Object.values(form.formState.errors)[0]?.message as string;

  return (
    <Modal
      open={open}
      toggle={handleClose}
      title="Nova Reserva"
      size="lg"
      footer={footer}
      className="max-w-4xl"
      contentClassName="px-0"
    >
      <div className="px-6 pb-6">
        {/* Stepper */}
        <div className="mb-6">
          <Stepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            allowStepClick={true}
          />
        </div>

        <div className="min-h-[400px]">
          {hasErrors && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span className="text-red-800 text-sm">{firstError}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)}>{renderStepContent()}</form>
        </div>
      </div>
    </Modal>
  );
}
