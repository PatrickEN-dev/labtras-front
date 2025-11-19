"use client";

import { useState } from "react";
import { BookingModal } from "./booking-modal";
import { Plus, Calendar } from "lucide-react";
import { ActionButton } from "../ui-base/action-button";
import { HeroSection } from "../layout/hero-section";

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
        <div className="opacity-50 cursor-not-allowed">
          <ActionButton
            icon={Calendar}
            variant="outline"
            size="lg"
            className="px-8 pointer-events-none"
          >
            Ver Agenda (Em breve)
          </ActionButton>
        </div>
      </HeroSection>

      <BookingModal open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </>
  );
}
