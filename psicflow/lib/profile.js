// Armazenamento temporário em localStorage para dados de perfil do profissional.
// Será trocado por chamadas ao Supabase quando o projeto migrar de banco de dados.

const KEY = "psicflow_profile";

const DEFAULT_PROFILE = {
  name: "Dra. Marina Silva",
  crp: "CRP 06/123456",
  email: "",
  phone: "",
  bio: "",
};

export function getProfile() {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(profile));
}

export function clearAllData() {
  if (typeof window === "undefined") return;
  const keys = [
    "psicflow_patients",
    "psicflow_appointments",
    "psicflow_records",
    "psicflow_patient_profiles",
    "psicflow_transactions",
    "psicflow_tasks",
    "psicflow_resources",
    "psicflow_profile",
  ];
  keys.forEach((k) => window.localStorage.removeItem(k));
}
