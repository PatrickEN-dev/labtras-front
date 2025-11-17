import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Users, Coffee } from "lucide-react";
import useManagersApi from "../hooks/api/useManagersApi";

interface BookingAdditionalConfigProps {
  form: any;
}

export function BookingAdditionalConfig({ form }: BookingAdditionalConfigProps) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setValue, watch, register } = form;
  const managerId = watch("managerId");
  const hasVideoCall = watch("hasVideoCall");
  const hasRefreshments = watch("hasRefreshments");

  const managersApi = useManagersApi();
  const getManagers = useMemo(() => managersApi.getManagers, [managersApi]);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getManagers();
        setManagers(data);
      } catch (err) {
        setError("Erro ao carregar gerentes");
        console.error("Erro ao carregar gerentes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadManagers();
  }, [getManagers]);

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-orange-600" />
            Configurações Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5 text-orange-600" />
          Configurações Adicionais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        {/* Responsável */}
        <div>
          <Label className="text-sm font-medium">
            <Users className="inline h-4 w-4 mr-1" />
            Responsável (opcional)
          </Label>
          <Select value={managerId} onValueChange={(value) => setValue("managerId", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              {managers.map((manager) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.name} - {manager.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <Label htmlFor="numberOfParticipants" className="text-sm font-medium">
            <Users className="inline h-4 w-4 mr-1" />
            Número de Participantes *
          </Label>
          <Input
            id="numberOfParticipants"
            type="number"
            min="1"
            {...register("numberOfParticipants", { valueAsNumber: true })}
            className="mt-1"
          />
        </div>

        {/* Opções */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasVideoCall"
              checked={hasVideoCall}
              onCheckedChange={(checked) => setValue("hasVideoCall", Boolean(checked))}
            />
            <Label htmlFor="hasVideoCall" className="text-sm font-medium leading-none">
              Reunião por vídeo chamada
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasRefreshments"
              checked={hasRefreshments}
              onCheckedChange={(checked) => setValue("hasRefreshments", Boolean(checked))}
            />
            <Label htmlFor="hasRefreshments" className="text-sm font-medium leading-none">
              <Coffee className="inline h-4 w-4 mr-1" />
              Incluir coffee break
            </Label>
          </div>
        </div>

        {/* Observações */}
        <div>
          <Label htmlFor="notes" className="text-sm font-medium">
            Observações (opcional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Observações adicionais sobre a reserva..."
            rows={3}
            {...register("notes")}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
