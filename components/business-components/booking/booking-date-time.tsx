import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingDateTimeProps {
  form: any;
}

export function BookingDateTime({ form }: BookingDateTimeProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
    setIsCalendarOpen(false);
  };

  const parsedDate = date ? new Date(date) : undefined;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarIcon className="h-5 w-5 text-green-600" />
          Data e Horário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Data *</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !parsedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {parsedDate
                    ? format(parsedDate, "dd/MM/yyyy", { locale: ptBR })
                    : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parsedDate}
                  onSelect={handleDateChange}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <Label htmlFor="startTime" className="text-sm font-medium">
              Hora Início *
            </Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setValue("startTime", e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.startTime && (
              <p className="text-sm text-red-600 mt-1">{errors.startTime.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="endTime" className="text-sm font-medium">
              Hora Fim *
            </Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setValue("endTime", e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.endTime && (
              <p className="text-sm text-red-600 mt-1">{errors.endTime.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
