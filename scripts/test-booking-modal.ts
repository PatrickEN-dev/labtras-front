#!/usr/bin/env node
/**
 * Script para testar a criação de booking através do modal
 * Simula os dados que seriam enviados pelo frontend
 */

const API_BASE_URL = "http://localhost:8000/api";

interface BookingTestData {
  room?: string;
  manager?: string;
  start_date: string;
  end_date: string;
  name: string;
  description?: string;
  purpose: string;
  coffee_option: boolean;
  coffee_quantity?: number;
  coffee_description?: string;
}

async function testBookingCreation() {

  try {
    // 1. Obter dados padrão (como o modal faz)

    const [locationResponse, managerResponse, roomResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/locations/get-or-create-default/`, { method: "POST" }),
      fetch(`${API_BASE_URL}/managers/get-or-create-default/`, { method: "POST" }),
      fetch(`${API_BASE_URL}/rooms/get-or-create-default/`, { method: "POST" }),
    ]);

    const locationData = await locationResponse.json();
    const managerData = await managerResponse.json();
    const roomData = await roomResponse.json();


    // 2. Criar booking (como o modal fez após os ajustes)

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    const endTime = new Date(tomorrow);
    endTime.setHours(15, 0, 0, 0);

    const bookingData: BookingTestData = {
      room: roomData.room.id,
      manager: managerData.manager.id,
      start_date: tomorrow.toISOString(),
      end_date: endTime.toISOString(),
      name: "Reunião de Planejamento Q4",
      description: "Discussão dos objetivos e metas para o próximo trimestre",
      purpose: "Reunião de teste via modal",
      coffee_option: true,
      coffee_quantity: 5,
      coffee_description: "Café e biscoitos para reunião",
    };


    const bookingResponse = await fetch(`${API_BASE_URL}/bookings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text();
      throw new Error(`Erro ${bookingResponse.status}: ${errorText}`);
    }

    const booking = await bookingResponse.json();

    // 3. Verificar o booking criado
    const verifyResponse = await fetch(`${API_BASE_URL}/bookings/${booking.id}/`);
    const verifyData = await verifyResponse.json();

    if (verifyData.room_name) {
    }
    if (verifyData.manager_name) {
    }


    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const success = await testBookingCreation();
  process.exit(success ? 0 : 1);
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

export { testBookingCreation };
