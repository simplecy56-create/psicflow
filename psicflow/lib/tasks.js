// Armazenamento temporário em localStorage para tarefas.
// Será trocado por chamadas ao Supabase quando o projeto migrar de banco de dados.

const KEY = "psicflow_tasks";

export function getTasks() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveTasks(list) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function addTask(task) {
  const list = getTasks();
  const newTask = {
    id: Date.now().toString(),
    status: "Pendente",
    ...task,
  };
  const updated = [newTask, ...list];
  saveTasks(updated);
  return updated;
}

export function removeTask(id) {
  const updated = getTasks().filter((t) => t.id !== id);
  saveTasks(updated);
  return updated;
}

export function cycleStatus(id) {
  const order = ["Pendente", "Em andamento", "Concluída"];
  const list = getTasks();
  const updated = list.map((t) => {
    if (t.id !== id) return t;
    const idx = order.indexOf(t.status);
    const next = order[(idx + 1) % order.length];
    return { ...t, status: next };
  });
  saveTasks(updated);
  return updated;
}

export function isOverdue(task) {
  if (!task.dueDate || task.status === "Concluída") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
}
