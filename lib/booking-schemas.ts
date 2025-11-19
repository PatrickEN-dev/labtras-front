import { z } from "zod";

export const locationSchema = z
  .object({
    locationId: z.string().optional(),
    customLocation: z.string().optional(),
    roomId: z.string().min(1, "Selecione uma sala"),
  })
  .refine(
    (data) => {
      return data.locationId || data.customLocation;
    },
    {
      message: "Informe uma localização",
      path: ["customLocation"],
    }
  );

export const dateTimeSchema = z
  .object({
    date: z.string().min(1, "Selecione uma data"),
    startTime: z.string().min(1, "Selecione o horário de início"),
    endTime: z.string().min(1, "Selecione o horário de fim"),
  })
  .refine(
    (data) => {
      if (data.date) {
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }
      return true;
    },
    {
      message: "A data deve ser hoje ou no futuro",
      path: ["date"],
    }
  )
  .refine(
    (data) => {
      if (data.date && data.startTime) {
        const selectedDate = new Date(data.date);
        const today = new Date();

        if (selectedDate.toDateString() === today.toDateString()) {
          const [hours, minutes] = data.startTime.split(":").map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);

          const minimumTime = new Date();
          minimumTime.setMinutes(minimumTime.getMinutes() + 15);

          return selectedDateTime >= minimumTime;
        }
      }
      return true;
    },
    {
      message: "Para hoje, selecione um horário com pelo menos 15 minutos de antecedência",
      path: ["startTime"],
    }
  )
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

export const additionalConfigSchema = z
  .object({
    managerId: z.string().min(1, "Responsável é obrigatório"),
    hasRefreshments: z.boolean(),
    refreshmentQuantity: z.number().optional(),
    refreshmentDescription: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.hasRefreshments) {
        return data.refreshmentQuantity && data.refreshmentQuantity > 0;
      }
      return true;
    },
    {
      message: "Informe a quantidade para o coffee break",
      path: ["refreshmentQuantity"],
    }
  );

export const fullBookingSchema = z
  .object({
    // Campos para seleção/criação de recursos
    locationId: z.string().optional(),
    customLocation: z.string().optional(),
    roomId: z.string().min(1, "Selecione uma sala"),
    managerId: z.string().min(1, "Responsável é obrigatório"),

    // Campos de data e hora
    date: z.string().min(1, "Selecione uma data"),
    startTime: z.string().min(1, "Selecione o horário de início"),
    endTime: z.string().min(1, "Selecione o horário de fim"),

    // Campos que vão para a API
    name: z.string().min(1, "Nome da reunião é obrigatório"),
    description: z.string().optional(),
    purpose: z.string().optional(),
    hasRefreshments: z.boolean(),
    refreshmentQuantity: z.number().optional(),
    refreshmentDescription: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.date) {
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }
      return true;
    },
    {
      message: "A data deve ser hoje ou no futuro",
      path: ["date"],
    }
  )
  .refine(
    (data) => {
      if (data.date && data.startTime) {
        const selectedDate = new Date(data.date);
        const today = new Date();

        // Se a data selecionada for hoje, verificar se o horário é futuro
        if (selectedDate.toDateString() === today.toDateString()) {
          const [hours, minutes] = data.startTime.split(":").map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);

          // Adicionar margem de 15 minutos para dar tempo de preparação
          const minimumTime = new Date();
          minimumTime.setMinutes(minimumTime.getMinutes() + 15);

          return selectedDateTime >= minimumTime;
        }
      }
      return true;
    },
    {
      message: "Para hoje, selecione um horário com pelo menos 15 minutos de antecedência",
      path: ["startTime"],
    }
  )
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
  )
  .refine(
    (data) => {
      if (data.date && data.endTime) {
        const selectedDate = new Date(data.date);
        const today = new Date();

        // Se a data selecionada for hoje, verificar se o horário de fim também é futuro
        if (selectedDate.toDateString() === today.toDateString()) {
          const [hours, minutes] = data.endTime.split(":").map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);

          const minimumTime = new Date();
          minimumTime.setMinutes(minimumTime.getMinutes() + 30); // 30 min para reunião mínima

          return selectedDateTime >= minimumTime;
        }
      }
      return true;
    },
    {
      message: "Para hoje, o horário de término deve permitir pelo menos 30 minutos de reunião",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      return data.locationId || data.customLocation;
    },
    {
      message: "Informe uma localização",
      path: ["customLocation"],
    }
  )
  .refine(
    (data) => {
      if (data.hasRefreshments) {
        return data.refreshmentQuantity && data.refreshmentQuantity > 0;
      }
      return true;
    },
    {
      message: "Informe a quantidade para o coffee break",
      path: ["refreshmentQuantity"],
    }
  );

export type LocationData = z.infer<typeof locationSchema>;
export type DateTimeData = z.infer<typeof dateTimeSchema>;
export type AdditionalConfig = z.infer<typeof additionalConfigSchema>;
export type BookingFormData = z.infer<typeof fullBookingSchema>;

export function validateStep(step: number, data: Partial<BookingFormData>) {
  switch (step) {
    case 0:
      return locationSchema.safeParse(data);
    case 1:
      return dateTimeSchema.safeParse(data);
    case 2:
      return additionalConfigSchema.safeParse(data);
    default:
      return { success: false, error: { issues: [] } };
  }
}
