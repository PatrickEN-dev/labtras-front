"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/generic-components/action-button";
import { BookingModalSteps } from "./booking-modal-steps";
import { Plus, Calendar, MapPin, BarChart3 } from "lucide-react";

export function QuickActions() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const quickActions = [
    {
      icon: Plus,
      label: "Nova Reserva",
      primary: true,
      onClick: () => setIsBookingModalOpen(true),
    },
    {
      icon: Calendar,
      label: "Ver Agenda",
      primary: false,
      onClick: () => console.log("Ver agenda"),
    },
    {
      icon: MapPin,
      label: "Gerenciar Salas",
      primary: false,
      onClick: () => console.log("Gerenciar salas"),
    },
    {
      icon: BarChart3,
      label: "Relatórios",
      primary: false,
      onClick: () => console.log("Relatórios"),
    },
  ];

  return (
    <>
      <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Ações Rápidas</CardTitle>
          <CardDescription>Principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              variant={action.primary ? "default" : "outline"}
              className={
                action.primary
                  ? "w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  : "w-full justify-start"
              }
              onClick={action.onClick}
            >
              {action.label}
            </ActionButton>
          ))}
        </CardContent>
      </Card>

      <BookingModalSteps open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </>
  );
}
