"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingModal } from "./booking-modal";
import { Plus, Calendar, MapPin, BarChart3, List } from "lucide-react";
import { ActionButton } from "@/components/ui-base/action-button";

export function QuickActions() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Ações Rápidas</CardTitle>
          <CardDescription>Principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ActionButton
            icon={Plus}
            variant="default"
            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Nova Reserva
          </ActionButton>

          <Link href="/bookings" className="block">
            <ActionButton icon={List} variant="outline" className="w-full justify-start">
              Ver Todas as Reservas
            </ActionButton>
          </Link>

          <div className="opacity-50 cursor-not-allowed">
            <ActionButton
              icon={Calendar}
              variant="outline"
              className="w-full justify-start pointer-events-none"
            >
              Ver Agenda (Em breve)
            </ActionButton>
          </div>

          <div className="opacity-50 cursor-not-allowed">
            <ActionButton
              icon={MapPin}
              variant="outline"
              className="w-full justify-start pointer-events-none"
            >
              Gerenciar Salas (Em breve)
            </ActionButton>
          </div>

          <div className="opacity-50 cursor-not-allowed">
            <ActionButton
              icon={BarChart3}
              variant="outline"
              className="w-full justify-start pointer-events-none"
            >
              Relatórios (Em breve)
            </ActionButton>
          </div>
        </CardContent>
      </Card>

      <BookingModal open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </>
  );
}
