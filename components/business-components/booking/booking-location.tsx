import { useEffect, useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Home } from "lucide-react";
import useLocationsApi from "../hooks/api/useLocationsApi";
import useRoomsApi from "../hooks/api/useRoomsApi";

interface BookingLocationProps {
  form: any;
}

export function BookingLocation({ form }: BookingLocationProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [rooms, setRooms] = useState<RoomWithLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setValue, watch } = form;
  const locationId = watch("locationId");
  const roomId = watch("roomId");

  const locationsApi = useLocationsApi();
  const roomsApi = useRoomsApi();

  const getLocations = useMemo(() => locationsApi.getLocations, [locationsApi]);
  const getRooms = useMemo(() => roomsApi.getRooms, [roomsApi]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoadingLocations(true);
        setError(null);
        const data = await getLocations();
        setLocations(data);
      } catch (err) {
        setError("Erro ao carregar localizações");
        console.error("Erro ao carregar localizações:", err);
      } finally {
        setLoadingLocations(false);
      }
    };

    loadLocations();
  }, [getLocations]);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);
        setError(null);
        const params = locationId ? { location_id: locationId } : {};
        const data = await getRooms(params);
        setRooms(data);

        // Reset room selection if current room is not in new list
        if (roomId && !data.find((room) => room.id === roomId)) {
          setValue("roomId", "");
        }
      } catch (err) {
        setError("Erro ao carregar salas");
        console.error("Erro ao carregar salas:", err);
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, [locationId, getRooms, roomId, setValue]);

  if (loadingLocations) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-purple-600" />
            Local
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && locations.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-purple-600" />
            Local
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <div className="text-red-600 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-purple-600" />
          Local
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">
              <Home className="inline h-4 w-4 mr-1" />
              Localização *
            </Label>
            <Select value={locationId} onValueChange={(value) => setValue("locationId", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione a localização" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">
              <MapPin className="inline h-4 w-4 mr-1" />
              Sala *
            </Label>
            <Select
              value={roomId}
              onValueChange={(value) => setValue("roomId", value)}
              disabled={!locationId || loadingRooms}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={loadingRooms ? "Carregando..." : "Selecione a sala"} />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} {room.capacity && `(${room.capacity} pessoas)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </CardContent>
    </Card>
  );
}
