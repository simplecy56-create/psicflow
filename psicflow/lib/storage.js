// Armazenamento temporário em localStorage.
// Quando o projeto migrar para Supabase, essas funções serão trocadas
// por chamadas reais ao banco de dados, mantendo a mesma assinatura.

const KEY = "psicflow_patients";

export function getPatients() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function savePatients(patients) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(patients));
}

export function addPatient(patient) {
  const patients = getPatients();
  const newPatient = {
    id: Date.now().toString(),
    status: "Ativo",
    createdAt: new Date().toISOString(),
    ...patient,
  };
  const updated = [newPatient, ...patients];
  savePatients(updated);
  return updated;
}

export function removePatient(id) {
  const updated = getPatients().filter((p) => p.id !== id);
  savePatients(updated);
  return updated;
}
