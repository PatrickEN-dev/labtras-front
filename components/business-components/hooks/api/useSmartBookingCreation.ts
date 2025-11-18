import { useCallback } from "react";
import useApi from "@/components/generic-components/hooks/useApi";
import type { BookingFormData } from "@/lib/booking-schemas";

interface DefaultResourceResponse<T> {
  created: boolean;
  location?: T;
  manager?: T;
  room?: T;
}

interface SmartBookingResult {
  booking: any;
  usedDefaults: {
    location: boolean;
    room: boolean;
    manager: boolean;
  };
}

const useSmartBookingCreation = () => {
  const api = useApi();

  const createBookingWithResources = useCallback(
    async (formData: BookingFormData): Promise<SmartBookingResult> => {
      const usedDefaults = {
        location: false,
        room: false,
        manager: false,
      };

      let actualLocationId = formData.locationId;
      let actualRoomId = formData.roomId;
      let actualManagerId = formData.managerId;

      try {
        if (formData.customLocation) {
          const newLocation = await api.post<any>("/locations/", {
            name: formData.customLocation,
            address: "Endereço a ser definido",
            description: "Localização customizada criada automaticamente",
          });
          actualLocationId = newLocation.id;
        } else {
          if (!formData.locationId || formData.locationId.startsWith("loc-")) {
            const defaultLocationResponse = await api.post<DefaultResourceResponse<any>>(
              "/locations/get-or-create-default/",
              {}
            );
            actualLocationId = defaultLocationResponse.location!.id;
            usedDefaults.location = true;
          }
        }

        if (!formData.roomId || formData.roomId.startsWith("room-")) {
          const defaultRoomResponse = await api.post<DefaultResourceResponse<any>>(
            "/rooms/get-or-create-default/",
            {}
          );
          actualRoomId = defaultRoomResponse.room!.id;
          usedDefaults.room = true;
        }

        if (!formData.managerId || formData.managerId.startsWith("mgr-")) {
          const defaultManagerResponse = await api.post<DefaultResourceResponse<any>>(
            "/managers/get-or-create-default/",
            {}
          );
          actualManagerId = defaultManagerResponse.manager!.id;
          usedDefaults.manager = true;
        }

        const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`).toISOString();
        const endDateTime = new Date(`${formData.date}T${formData.endTime}:00`).toISOString();

        const bookingData = {
          room: actualRoomId,
          manager: actualManagerId,
          start_date: startDateTime,
          end_date: endDateTime,
          name: formData.name || "Reunião sem título",
          description: formData.description || "",
          purpose: formData.purpose || "Reunião agendada via sistema",
          coffee_option: formData.hasRefreshments,
          coffee_quantity: formData.hasRefreshments ? formData.refreshmentQuantity || 1 : 0,
          coffee_description: formData.hasRefreshments
            ? formData.refreshmentDescription || "Coffee break incluído"
            : "",
        };

        const booking = await api.post("/bookings/", bookingData);

        return {
          booking,
          usedDefaults,
        };
      } catch (error) {
        throw error;
      }
    },
    [api]
  );

  return {
    createBookingWithResources,
  };
};

export default useSmartBookingCreation;
