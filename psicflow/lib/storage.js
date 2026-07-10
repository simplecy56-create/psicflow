// Pacientes agora são salvos de verdade no Supabase, vinculados ao usuário logado.
import { createClient } from "./supabase";

export async function getPatients() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar pacientes:", error);
    return [];
  }
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    phone: p.phone,
    email: p.email,
    status: p.status,
    createdAt: p.created_at,
  }));
}

export async function addPatient(patient) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("patients").insert({
    user_id: user.id,
    name: patient.name,
    phone: patient.phone || null,
    email: patient.email || null,
    status: "Ativo",
  });
  if (error) console.error("Erro ao adicionar paciente:", error);
  return getPatients();
}

export async function removePatient(id) {
  const supabase = createClient();
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) console.error("Erro ao remover paciente:", error);
  return getPatients();
}
