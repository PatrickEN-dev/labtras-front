import { z } from "zod";

export const basicInfoSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título muito longo"),
  description: z.string().optional(),
});

export const locationSchema = z.object({
  locationId: z.string().min(1, "Selecione uma localização"),
  roomId: z.string().min(1, "Selecione uma sala"),
});

export const dateTimeSchema = z
  .object({
    date: z.string().min(1, "Selecione uma data"),
    startTime: z.string().min(1, "Selecione o horário de início"),
    endTime: z.string().min(1, "Selecione o horário de fim"),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const start = parseInt(data.startTime.replace(":", ""));
        const end = parseInt(data.endTime.replace(":", ""));
        return end > start;
      }
      return true;
    },
    {
      message: "Horário de fim deve ser posterior ao horário de início",
      path: ["endTime"],
    }
  );

export const additionalConfigSchema = z.object({
  managerId: z.string().optional(),
  numberOfParticipants: z.number().min(1, "Número de participantes deve ser pelo menos 1"),
  hasVideoCall: z.boolean(),
  hasRefreshments: z.boolean(),
  equipmentNeeded: z.array(z.string()),
  notes: z.string().optional(),
});

export const fullBookingSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  locationId: z.string().min(1, "Selecione uma localização"),
  roomId: z.string().min(1, "Selecione uma sala"),
  date: z.string().min(1, "Selecione uma data"),
  startTime: z.string().min(1, "Selecione o horário de início"),
  endTime: z.string().min(1, "Selecione o horário de fim"),
  managerId: z.string().optional(),
  numberOfParticipants: z.number().min(1, "Número de participantes deve ser pelo menos 1"),
  hasVideoCall: z.boolean(),
  hasRefreshments: z.boolean(),
  equipmentNeeded: z.array(z.string()),
  notes: z.string().optional(),
});

export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type LocationData = z.infer<typeof locationSchema>;
export type DateTimeData = z.infer<typeof dateTimeSchema>;
export type AdditionalConfig = z.infer<typeof additionalConfigSchema>;
export type BookingFormData = z.infer<typeof fullBookingSchema>;

export function validateStep(step: number, data: Partial<BookingFormData>) {
  switch (step) {
    case 0:
      return basicInfoSchema.safeParse(data);
    case 1:
      return locationSchema.safeParse(data);
    case 2:
      return dateTimeSchema.safeParse(data);
    case 3:
      return additionalConfigSchema.safeParse(data);
    default:
      return { success: false, error: { issues: [] } };
  }
}
