import { useState, useEffect, useMemo, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import useAvailabilityCheck from "@/components/shared/hooks/api/useAvailabilityCheck";
import { TimeSlotVisualizer } from "./time-slot-visualizer";
import { TimeSuggestions } from "./time-suggestions";

interface BookingDateTimeProps {
  form: any;
  excludeBookingId?: string;
  rooms?: Array<{ id: string; name: string }>;
}

export function BookingDateTime({ form, excludeBookingId, rooms = [] }: BookingDateTimeProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState<
    Array<{ start: string; end: string; booking: Booking }>
  >([]);
  const [availabilityResult, setAvailabilityResult] = useState<{
    available: boolean;
    conflictingBookings: Booking[];
    suggestedSlots: Array<{
      startTime: string;
      endTime: string;
      available: boolean;
      reason?: string;
    }>;
  }>({ available: true, conflictingBookings: [], suggestedSlots: [] });
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const {
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = form;
  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const roomId = watch("roomId");

  const { checkAvailability, getOccupiedSlots } = useAvailabilityCheck();

  const checkAvailabilityRef = useRef(checkAvailability);
  const getOccupiedSlotsRef = useRef(getOccupiedSlots);
  const setErrorRef = useRef(setError);
  const clearErrorsRef = useRef(clearErrors);
  const lastRequestKeyRef = useRef<string>("");

  useEffect(() => {
    checkAvailabilityRef.current = checkAvailability;
    getOccupiedSlotsRef.current = getOccupiedSlots;
    setErrorRef.current = setError;
    clearErrorsRef.current = clearErrors;
  });

  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room.id === roomId);
  }, [rooms, roomId]);

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));

      if (startTime) validateTime(startTime, "startTime");
      if (endTime) validateTime(endTime, "endTime");
    }
    setIsCalendarOpen(false);
  };

  const validateTime = (timeValue: string, field: "startTime" | "endTime") => {
    if (!date || !timeValue) return;

    const selectedDate = new Date(date);
    const today = new Date();

    // Verificar apenas se for hoje
    if (selectedDate.toDateString() === today.toDateString()) {
      const [hours, minutes] = timeValue.split(":").map(Number);
      const selectedDateTime = new Date();
      selectedDateTime.setHours(hours, minutes, 0, 0);

      const minimumTime = new Date();
      minimumTime.setMinutes(minimumTime.getMinutes() + 15);

      if (selectedDateTime < minimumTime) {
        setError(field, {
          type: "manual",
          message:
            field === "startTime"
              ? "Para hoje, selecione um horário com pelo menos 15 minutos de antecedência"
              : "Horário de término muito próximo ao atual",
        });
      } else {
        clearErrors(field);
      }
    }
  };

  const handleTimeChange = (timeValue: string, field: "startTime" | "endTime") => {
    setValue(field, timeValue);
    validateTime(timeValue, field);
  };

  // Effect para carregar slots ocupados quando sala/data mudam
  useEffect(() => {
    if (roomId && date) {
      // Evitar múltiplas requests se já temos dados para esta sala/data
      const currentKey = `${roomId}-${date}`;

      if (lastRequestKeyRef.current === currentKey) return;
      lastRequestKeyRef.current = currentKey;

      const loadOccupiedSlots = async () => {
        try {
          const slots = await getOccupiedSlotsRef.current(roomId, date);
          setOccupiedSlots(slots);
        } catch (error) {
          console.error("Erro ao carregar slots ocupados:", error);
          setOccupiedSlots([]);
        }
      };

      loadOccupiedSlots();
    }
  }, [roomId, date]);

  useEffect(() => {
    if (roomId && date && startTime && endTime) {
      const checkRealTimeAvailability = async () => {
        setCheckingAvailability(true);
        try {
          const result = await checkAvailabilityRef.current({
            roomId,
            date,
            startTime,
            endTime,
            excludeBookingId,
          });

          setAvailabilityResult(result);

          if (!result.available) {
            setErrorRef.current("startTime", {
              type: "manual",
              message: "Horário não disponível - conflito detectado",
            });
          } else {
            if (errors.startTime?.message?.includes("conflito")) {
              clearErrorsRef.current("startTime");
            }
          }
        } catch (error) {
          console.error("Erro ao verificar disponibilidade:", error);
        } finally {
          setCheckingAvailability(false);
        }
      };

      const timeoutId = setTimeout(checkRealTimeAvailability, 1000); // Debounce mais agressivo
      return () => clearTimeout(timeoutId);
    }
  }, [roomId, date, startTime, endTime, excludeBookingId, errors.startTime?.message]);

  const handleSuggestionSelect = (suggestedStart: string, suggestedEnd: string) => {
    setValue("startTime", suggestedStart);
    setValue("endTime", suggestedEnd);
    validateTime(suggestedStart, "startTime");
    validateTime(suggestedEnd, "endTime");
  };

  const parsedDate = date ? new Date(date) : undefined;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-slate-50/50">
      <CardHeader className="pb-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="bg-linear-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent font-bold">
              Agendamento
            </span>
            <p className="text-sm text-slate-500 font-normal mt-1">
              Defina data e horários da reunião
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              📅 Data da Reunião *
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11 border-slate-200 focus:border-green-500 focus:ring-green-500/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white",
                    !parsedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 text-green-600" />
                  {parsedDate
                    ? format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white/95 backdrop-blur-sm border-slate-200"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={parsedDate}
                  onSelect={handleDateChange}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="rounded-lg"
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <span>⚠️</span>
                {errors.date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="startTime"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              🕐 Horário de Início *
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-600" />
              {checkingAvailability ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                roomId &&
                date &&
                startTime &&
                endTime && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {availabilityResult.available ? (
                      <div title="Horário disponível">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <div title="Conflito detectado">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>
                )
              )}
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => handleTimeChange(e.target.value, "startTime")}
                className={cn(
                  "pl-10 pr-10 h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white",
                  !availabilityResult.available &&
                    roomId &&
                    date &&
                    startTime &&
                    endTime &&
                    "border-red-300 bg-red-50"
                )}
              />
            </div>
            {errors.startTime && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <span>⚠️</span>
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="endTime"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              🕐 Horário de Término *
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-600" />
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => handleTimeChange(e.target.value, "endTime")}
                className="pl-10 h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white"
              />
            </div>
            {errors.endTime && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <span>⚠️</span>
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">💡</span>
            <div className="text-sm text-blue-700">
              <span className="font-medium">Dica:</span> Para agendamentos hoje, selecione horários
              com pelo menos 15 minutos de antecedência.
            </div>
          </div>
        </div>

        {startTime && endTime && (
          <div className="bg-linear-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200/50">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-emerald-600 font-medium">⏱️ Duração estimada:</span>
              <span className="text-slate-700 font-semibold">
                {(() => {
                  const start = new Date(`2000-01-01T${startTime}`);
                  const end = new Date(`2000-01-01T${endTime}`);
                  const diff = end.getTime() - start.getTime();
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                  return hours > 0
                    ? `${hours}h ${minutes > 0 ? `${minutes}min` : ""}`
                    : `${minutes}min`;
                })()}
              </span>
            </div>
          </div>
        )}

        {/* Visualizador de horários ocupados */}
        {roomId && date && (
          <div className="mt-6">
            <TimeSlotVisualizer
              occupiedSlots={occupiedSlots}
              selectedStart={startTime}
              selectedEnd={endTime}
              roomName={selectedRoom?.name}
              date={date}
            />
          </div>
        )}

        {/* Sugestões de horários alternativos */}
        {!availabilityResult.available &&
          (availabilityResult.conflictingBookings.length > 0 ||
            availabilityResult.suggestedSlots.length > 0) && (
            <div className="mt-6">
              <TimeSuggestions
                suggestions={availabilityResult.suggestedSlots}
                conflictingBookings={availabilityResult.conflictingBookings}
                onSelectSuggestion={handleSuggestionSelect}
                loading={checkingAvailability}
              />
            </div>
          )}
      </CardContent>
    </Card>
  );
}
