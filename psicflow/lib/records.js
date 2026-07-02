// Armazenamento temporário em localStorage para registros de prontuário.
// Será trocado por chamadas ao Supabase quando o projeto migrar de banco de dados.

const KEY = "psicflow_records";

export function getRecords() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveRecords(records) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(records));
}

export function addRecord(record) {
  const records = getRecords();
  const newRecord = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...record,
  };
  const updated = [newRecord, ...records];
  saveRecords(updated);
  return updated;
}

export function removeRecord(id) {
  const updated = getRecords().filter((r) => r.id !== id);
  saveRecords(updated);
  return updated;
}

export function recordsForPatient(patientId) {
  return getRecords()
    .filter((r) => r.patientId === patientId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Diagnóstico/hipóteses e objetivos ficam por paciente também
const PROFILE_KEY = "psicflow_patient_profiles";

export function getProfile(patientId) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[patientId] || { diagnosis: "", hypothesis: "", goals: [] };
  } catch (e) {
    return { diagnosis: "", hypothesis: "", goals: [] };
  }
}

export function saveProfile(patientId, profile) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[patientId] = profile;
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(all));
  } catch (e) {}
}
