import { useEffect, useState, useMemo } from "react";
import { StatsCard } from "@/components/generic-components/stats-card";
import { Clock, MapPin, Users, Coffee } from "lucide-react";
import useBookingsApi from "./hooks/api/useBookingsApi";
import useRoomsApi from "./hooks/api/useRoomsApi";
import type { Room } from "@/lib/mock-data";

interface DashboardStatsData {
  meetingsToday: number;
  availableRooms: number;
  totalRooms: number;
  activeParticipants: number;
  coffeeOrders: number;
}

const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0];
};

const calculateActiveParticipants = (bookings: Booking[]): number => {
  return bookings.length * 4;
};

const calculateCoffeeOrders = (bookings: Booking[]): number => {
  return bookings.reduce((total, booking) => total + (booking.coffee_quantity || 0), 0);
};

const getCurrentActiveBookings = (bookings: Booking[]): Booking[] => {
  const now = new Date();
  return bookings.filter((booking) => {
    const startTime = new Date(booking.start_date);
    const endTime = new Date(booking.end_date);
    return now >= startTime && now <= endTime;
  });
};

const calculateAvailableRooms = (totalRooms: Room[], activeBookings: Booking[]): number => {
  const busyRoomsIds = new Set(activeBookings.map((booking) => booking.room_id));
  return Math.max(0, totalRooms.length - busyRoomsIds.size);
};

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    meetingsToday: 0,
    availableRooms: 0,
    totalRooms: 0,
    activeParticipants: 0,
    coffeeOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingsApi = useBookingsApi();
  const roomsApi = useRoomsApi();

  // Memorizar a data de hoje para evitar recálculos
  const today = useMemo(() => getTodayDateString(), []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fazer as duas requisições em paralelo para melhor performance
        const [todayBookings, allRooms] = await Promise.all([
          bookingsApi.getBookings({
            start_date: today,
            end_date: today,
          }),
          roomsApi.getRooms(),
        ]);

        // Calcular estatísticas usando funções auxiliares
        const activeBookings = getCurrentActiveBookings(todayBookings);
        const activeParticipants = calculateActiveParticipants(todayBookings);
        const coffeeOrders = calculateCoffeeOrders(todayBookings);
        const availableRooms = calculateAvailableRooms(allRooms, activeBookings);

        setStats({
          meetingsToday: todayBookings.length,
          availableRooms,
          totalRooms: allRooms.length,
          activeParticipants,
          coffeeOrders,
        });
      } catch (err) {
        setError("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const displayValue = (value: number): string | number => {
    if (isLoading) return "...";
    if (error) return "?";
    return value;
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Reuniões Hoje"
        value={displayValue(stats.meetingsToday)}
        description={error ? "Erro ao carregar" : "agendadas"}
        icon={Clock}
        iconColor="text-blue-600"
        changeColor="text-green-600"
      />

      <StatsCard
        title="Salas Disponíveis"
        value={displayValue(stats.availableRooms)}
        description={error ? "Erro ao carregar" : `de ${stats.totalRooms} total`}
        icon={MapPin}
        iconColor="text-green-600"
      />

      <StatsCard
        title="Participantes"
        value={displayValue(stats.activeParticipants)}
        description={error ? "Erro ao carregar" : "estimados hoje"}
        icon={Users}
        iconColor="text-purple-600"
      />

      <StatsCard
        title="Café Solicitado"
        value={displayValue(stats.coffeeOrders)}
        description={error ? "Erro ao carregar" : "copos hoje"}
        icon={Coffee}
        iconColor="text-amber-600"
        changeColor="text-amber-600"
      />
    </div>
  );
}
