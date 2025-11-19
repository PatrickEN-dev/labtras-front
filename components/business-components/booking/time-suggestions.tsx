import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Lightbulb, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: string;
}

interface TimeSuggestionsProps {
  suggestions: TimeSlot[];
  onSelectSuggestion: (startTime: string, endTime: string) => void;
  loading?: boolean;
  conflictingBookings?: Booking[];
}

export function TimeSuggestions({
  suggestions,
  onSelectSuggestion,
  loading = false,
  conflictingBookings = [],
}: TimeSuggestionsProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Verificando disponibilidade...</p>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0 && conflictingBookings.length === 0) {
    return null;
  }

  const formatDuration = (startTime: string, endTime: string) => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const duration = end - start;

    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${duration}min`;
  };

  const getSuggestionTypeIcon = (suggestion: TimeSlot) => {
    if (suggestion.reason?.includes("amanhã")) {
      return <Calendar className="h-4 w-4 text-orange-500" />;
    }
    return <Clock className="h-4 w-4 text-green-500" />;
  };

  const getSuggestionTypeColor = (suggestion: TimeSlot) => {
    if (suggestion.reason?.includes("amanhã")) {
      return "bg-orange-50 border-orange-200 hover:bg-orange-100";
    }
    return "bg-green-50 border-green-200 hover:bg-green-100";
  };

  return (
    <div className="space-y-4">
      {conflictingBookings.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700 text-sm">
              <Clock className="h-4 w-4" />
              Conflito de Horário Detectado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {conflictingBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm text-red-700">{booking.name}</div>
                    <div className="text-xs text-red-600">Responsável: {booking.manager.name}</div>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {new Date(booking.start_date).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(booking.end_date).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-700 text-sm">
              <Lightbulb className="h-4 w-4" />
              Horários Alternativos Sugeridos
            </CardTitle>
            <p className="text-xs text-gray-600">
              Clique em um horário para aplicá-lo automaticamente
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`
                    p-4 border rounded-lg transition-all duration-200 cursor-pointer
                    ${getSuggestionTypeColor(suggestion)}
                  `}
                  onClick={() => onSelectSuggestion(suggestion.startTime, suggestion.endTime)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSuggestionTypeIcon(suggestion)}
                      <span className="font-medium text-sm">Opção {index + 1}</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {suggestion.startTime} - {suggestion.endTime}
                    </div>
                    <div className="text-xs text-gray-600">
                      Duração: {formatDuration(suggestion.startTime, suggestion.endTime)}
                    </div>
                    {suggestion.reason && (
                      <div className="text-xs text-orange-600 mt-1">{suggestion.reason}</div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-3 text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSuggestion(suggestion.startTime, suggestion.endTime);
                    }}
                  >
                    Usar este horário
                  </Button>
                </div>
              ))}
            </div>

            {suggestions.some((s) => s.reason?.includes("amanhã")) && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div className="text-sm text-orange-700">
                    <span className="font-medium">Sugestão:</span> Esta sala está muito ocupada
                    hoje. Considere agendar para amanhã ou escolher uma sala diferente.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
