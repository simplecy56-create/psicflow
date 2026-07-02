// Armazenamento temporário em localStorage para movimentações financeiras.
// Será trocado por chamadas ao Supabase quando o projeto migrar de banco de dados.

const KEY = "psicflow_transactions";

export function getTransactions() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveTransactions(list) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function addTransaction(tx) {
  const list = getTransactions();
  const newTx = {
    id: Date.now().toString(),
    status: tx.type === "receita" ? "Recebido" : "Pago",
    ...tx,
  };
  const updated = [newTx, ...list];
  saveTransactions(updated);
  return updated;
}

export function removeTransaction(id) {
  const updated = getTransactions().filter((t) => t.id !== id);
  saveTransactions(updated);
  return updated;
}

export function toggleStatus(id) {
  const list = getTransactions();
  const updated = list.map((t) => {
    if (t.id !== id) return t;
    if (t.type === "receita") {
      return { ...t, status: t.status === "Recebido" ? "Pendente" : "Recebido" };
    }
    return { ...t, status: t.status === "Pago" ? "Pendente" : "Pago" };
  });
  saveTransactions(updated);
  return updated;
}

export const CATEGORIES = [
  "Consulta individual",
  "Terapia de casal",
  "Avaliação",
  "Supervisão",
  "Despesas fixas",
  "Materiais",
  "Outros",
];

export function currentMonthTransactions(list, refDate = new Date()) {
  const y = refDate.getFullYear();
  const m = refDate.getMonth();
  return list.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === y && d.getMonth() === m;
  });
}

export function fmtCurrency(value) {
  return (Number(value) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
