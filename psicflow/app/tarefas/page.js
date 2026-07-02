"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckSquare, X, Trash2, Circle, CircleDot, CheckCircle2 } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { getPatients } from "../../lib/storage";
import { getTasks, addTask, removeTask, cycleStatus, isOverdue } from "../../lib/tasks";

const STATUS_STYLE = {
  Pendente: { bg: "bg-amber-50", text: "text-amber-700", icon: Circle },
  "Em andamento": { bg: "bg-blue-50", text: "text-blue-700", icon: CircleDot },
  Concluída: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 },
};

function fmtDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function TarefasPage() {
  const [tasks, setTasks] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("todas");
  const [form, setForm] = useState({
    title: "",
    patientId: "",
    dueDate: "",
  });

  useEffect(() => {
    setTasks(getTasks());
    setPatients(getPatients());
  }, []);

  const counts = useMemo(
    () => ({
      pendentes: tasks.filter((t) => t.status === "Pendente").length,
      andamento: tasks.filter((t) => t.status === "Em andamento").length,
      concluidas: tasks.filter((t) => t.status === "Concluída").length,
      atrasadas: tasks.filter((t) => isOverdue(t)).length,
    }),
    [tasks]
  );

  const filtered = tasks.filter((t) => {
    if (filter === "todas") return true;
    if (filter === "atrasadas") return isOverdue(t);
    const map = { pendentes: "Pendente", andamento: "Em andamento", concluidas: "Concluída" };
    return t.status === map[filter];
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const patient = patients.find((p) => p.id === form.patientId);
    const updated = addTask({ ...form, patientName: patient ? patient.name : null });
    setTasks(updated);
    setForm({ title: "", patientId: "", dueDate: "" });
    setShowForm(false);
  }

  function handleRemove(id) {
    setTasks(removeTask(id));
  }

  function handleCycle(id) {
    setTasks(cycleStatus(id));
  }

  return (
    <div>
      <PageHeader
        title="Tarefas"
        subtitle="Organize e acompanhe suas tarefas e pendências."
        searchPlaceholder="Buscar tarefas..."
        actionLabel="Nova tarefa"
        onAction={() => setShowForm(true)}
      />

      <div className="flex items-center gap-2 mb-4">
        {[
          { k: "todas", label: `Todas (${tasks.length})` },
          { k: "pendentes", label: `Pendentes (${counts.pendentes})` },
          { k: "andamento", label: `Em andamento (${counts.andamento})` },
          { k: "concluidas", label: `Concluídas (${counts.concluidas})` },
          { k: "atrasadas", label: `Atrasadas (${counts.atrasadas})` },
        ].map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={`text-xs px-3 py-1.5 rounded-lg border ${
              filter === f.k
                ? "bg-brand text-white border-brand"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-500 block mb-1">Tarefa</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Ligar para paciente"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Paciente (opcional)</label>
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Nenhum</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Prazo</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Adicionar
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 px-2 py-2">
            <X size={16} />
          </button>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-20 text-center">
          <CheckSquare size={28} className="text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">Nenhuma tarefa aqui.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {filtered.map((t) => {
            const style = STATUS_STYLE[t.status];
            const StatusIcon = style.icon;
            const overdue = isOverdue(t);
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50"
              >
                <button
                  onClick={() => handleCycle(t.id)}
                  aria-label="Mudar status da tarefa"
                  className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md shrink-0 ${style.bg} ${style.text}`}
                >
                  <StatusIcon size={13} />
                  {t.status}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm text-gray-800 truncate ${
                      t.status === "Concluída" ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {t.title}
                  </p>
                  {t.patientName && (
                    <p className="text-xs text-gray-400 truncate">{t.patientName}</p>
                  )}
                </div>
                {t.dueDate && (
                  <span className={`text-xs shrink-0 ${overdue ? "text-red-500 font-medium" : "text-gray-400"}`}>
                    {overdue ? "Atrasada • " : ""}
                    {fmtDate(t.dueDate)}
                  </span>
                )}
                <button
                  onClick={() => handleRemove(t.id)}
                  aria-label="Remover tarefa"
                  className="text-gray-300 hover:text-red-500 shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
