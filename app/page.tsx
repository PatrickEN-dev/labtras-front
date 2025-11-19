"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardHero } from "@/components/business-components/dashboard-hero";
import { DashboardStats } from "@/components/business-components/dashboard-stats";
import { UpcomingMeetings } from "@/components/business-components/upcoming-meetings";
import { QuickActions } from "@/components/business-components/quick-actions";
import { RoomStatus } from "@/components/business-components/room-status";
import { LabTransTerms } from "@/components/business-components/labtrans-terms";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header
        title="LabTrans"
        subtitle="Reservas de Salas"
        logoText="LT"
        showTerms={true}
        termsComponent={<LabTransTerms variant="button" />}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHero />

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <UpcomingMeetings />

          <div className="space-y-6">
            <QuickActions />
            <RoomStatus />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
