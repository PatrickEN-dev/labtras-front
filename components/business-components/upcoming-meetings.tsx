import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Coffee, BarChart3, User } from "lucide-react";
import { ClientOnly } from "@/components/generic-components/client-only";
import { useEffect, useState } from "react";
import useBookingsApi from "./hooks/api/useBookingsApi";

export function UpcomingMeetings() {
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const bookingsApi = useBookingsApi();

  useEffect(() => {
    const loadTodayBookings = async () => {
      try {
        const bookings = await bookingsApi.getBookings();

        const now = new Date();

        const filtered = bookings
          .filter((booking: any) => {
            const bookingStartDate = new Date(booking.start_date);
            const isUpcoming = bookingStartDate > now;
            return isUpcoming;
          })
          .sort(
            (a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          )
          .slice(0, 3);

        setUpcomingBookings(filtered);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadTodayBookings();
  }, [bookingsApi]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="lg:col-span-2" suppressHydrationWarning={true}>
      <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Próximas Reuniões</CardTitle>
              <CardDescription>Próximas reuniões agendadas</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/bookings")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Todas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClientOnly>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Carregando reuniões...</p>
                </div>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Nenhuma reunião futura agendada</p>
                </div>
              </div>
            ) : (
              upcomingBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all"
                  suppressHydrationWarning={true}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className="shrink-0 w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                      suppressHydrationWarning={true}
                    >
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="grow" suppressHydrationWarning={true}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {booking.name || "Reunião sem título"}
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {formatTime(booking.start_date)} - {formatTime(booking.end_date)}
                        </span>
                      </div>

                      {booking.description && (
                        <p className="text-sm text-gray-700 mb-2 bg-white/60 p-2 rounded-lg">
                          {booking.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {booking.room.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {booking.manager.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        {booking.coffee_option ? (
                          <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            <Coffee className="h-3 w-3" />
                            <span>Café para {booking.coffee_quantity || 1} pessoas</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Sem café
                          </span>
                        )}

                        <span className="text-xs text-blue-600 font-medium">
                          Capacidade: {booking.room.capacity} pessoas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ClientOnly>
        </CardContent>
      </Card>
    </div>
  );
}
