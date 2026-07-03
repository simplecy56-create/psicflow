// Armazenamento temporário em localStorage para recursos/materiais.
// Será trocado por chamadas ao Supabase quando o projeto migrar de banco de dados.

const KEY = "psicflow_resources";

const DEFAULT_RESOURCES = [
  {
    id: "seed-1",
    title: "Modelo de Anamnese Adulto",
    description: "Modelo completo para coleta de dados do paciente adulto.",
    category: "Modelos e documentos",
    favorite: true,
  },
  {
    id: "seed-2",
    title: "Escala de Ansiedade de Beck (BAI)",
    description: "Instrumento para avaliação dos sintomas de ansiedade.",
    category: "Escalas psicológicas",
    favorite: true,
  },
  {
    id: "seed-3",
    title: "Técnica do Diário de Pensamentos",
    description: "Exercício para identificação de pensamentos automáticos.",
    category: "Técnicas e exercícios",
    favorite: false,
  },
  {
    id: "seed-4",
    title: "Artigo: Terapia Cognitivo-Comportamental",
    description: "Revisão dos principais conceitos e técnicas da TCC.",
    category: "Artigos e leituras",
    favorite: false,
  },
];

export const CATEGORIES = [
  "Modelos e documentos",
  "Escalas psicológicas",
  "Vídeos e aulas",
  "Artigos e leituras",
  "Áudios e meditações",
  "Técnicas e exercícios",
  "Protocolos",
];

export function getResources() {
  if (typeof window === "undefined") return DEFAULT_RESOURCES;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(DEFAULT_RESOURCES));
      return DEFAULT_RESOURCES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_RESOURCES;
  }
}

export function saveResources(list) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function addResource(resource) {
  const list = getResources();
  const newResource = {
    id: Date.now().toString(),
    favorite: false,
    ...resource,
  };
  const updated = [newResource, ...list];
  saveResources(updated);
  return updated;
}

export function removeResource(id) {
  const updated = getResources().filter((r) => r.id !== id);
  saveResources(updated);
  return updated;
}

export function toggleFavorite(id) {
  const list = getResources();
  const updated = list.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r));
  saveResources(updated);
  return updated;
}
