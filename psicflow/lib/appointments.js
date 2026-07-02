// Armazenamento temporário em localStorage para consultas.
// Será trocado por chamadas ao Supabase quando o projeto migrar de banco de dados.

const KEY = "psicflow_appointments";

export function getAppointments() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveAppointments(appointments) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(appointments));
}

export function addAppointment(appt) {
  const appointments = getAppointments();
  const newAppt = {
    id: Date.now().toString(),
    ...appt,
  };
  const updated = [...appointments, newAppt];
  saveAppointments(updated);
  return updated;
}

export function removeAppointment(id) {
  const updated = getAppointments().filter((a) => a.id !== id);
  saveAppointments(updated);
  return updated;
}

// Tipos de consulta e suas cores, no mesmo espírito do sistema de referência
export const APPOINTMENT_TYPES = [
  { value: "individual", label: "Terapia Individual", color: "#DCEBFF", text: "#1D4ED8" },
  { value: "casal", label: "Terapia de Casal", color: "#FBE4FF", text: "#A21CAF" },
  { value: "infantil", label: "Terapia Infantil", color: "#DFF7EA", text: "#15803D" },
  { value: "supervisao", label: "Supervisão / Consultoria", color: "#FFE9CC", text: "#B45309" },
  { value: "outros", label: "Outros", color: "#EAEAF0", text: "#52525B" },
];

export function typeInfo(value) {
  return APPOINTMENT_TYPES.find((t) => t.value === value) || APPOINTMENT_TYPES[4];
}
