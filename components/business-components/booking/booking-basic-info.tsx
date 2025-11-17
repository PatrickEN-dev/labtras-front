import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface BookingBasicInfoProps {
  form: any;
}

export function BookingBasicInfo({ form }: BookingBasicInfoProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-blue-600" />
          Informações Básicas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Título da Reunião *
          </Label>
          <Input
            id="title"
            placeholder="Ex: Reunião de planejamento"
            {...register("title")}
            className="mt-1"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Descrição (opcional)
          </Label>
          <Textarea
            id="description"
            placeholder="Detalhes sobre a reunião..."
            rows={3}
            {...register("description")}
            className="mt-1"
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
