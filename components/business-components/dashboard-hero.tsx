"use client";

import { useState } from "react";
import { HeroSection } from "@/components/generic-components/hero-section";
import { ActionButton } from "@/components/generic-components/action-button";
import { BookingModalSteps } from "./booking-modal-steps";
import { Plus, Calendar } from "lucide-react";

export function DashboardHero() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <HeroSection
        title="Sistema de Reservas"
        subtitle="Agende sua sala em segundos"
        description="Gerencie reservas de salas de reuniões de forma simples e eficiente"
      >
        <ActionButton
          icon={Plus}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          onClick={() => setIsBookingModalOpen(true)}
        >
          Nova Reserva
        </ActionButton>
        <ActionButton
          icon={Calendar}
          variant="outline"
          size="lg"
          className="px-8"
          onClick={() => console.log("Ver agenda")}
        >
          Ver Agenda
        </ActionButton>
      </HeroSection>

      <BookingModalSteps open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </>
  );
}
