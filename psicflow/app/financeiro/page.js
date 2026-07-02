"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, X, Trash2 } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { getPatients } from "../../lib/storage";
import {
  getTransactions,
  addTransaction,
  removeTransaction,
  toggleStatus,
  CATEGORIES,
  currentMonthTransactions,
  fmtCurrency,
} from "../../lib/finance";

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("todas");
  const [form, setForm] = useState({
    type: "receita",
    description: "",
    patientId: "",
    category: CATEGORIES[0],
    value: "",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    setTransactions(getTransactions());
    setPatients(getPatients());
  }, []);

  const monthTx = useMemo(() => currentMonthTransactions(transactions), [transactions]);

  const receitas = monthTx.filter((t) => t.type === "receita").reduce((s, t) => s + Number(t.value), 0);
  const despesas = monthTx.filter((t) => t.type === "despesa").reduce((s, t) => s + Number(t.value), 0);
  const saldo = receitas - despesas;

  const pendentes = transactions.filter((t) => t.type === "receita" && t.status === "Pendente");

  const filtered = transactions.filter((t) => {
    if (filter === "todas") return true;
    if (filter === "receitas") return t.type === "receita";
    return t.type === "despesa";
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!form.description.trim() || !form.value) return;
    const patient = patients.find((p) => p.id === form.patientId);
    const updated = addTransaction({
      ...form,
      value: Number(form.value),
      patientName: patient ? patient.name : null,
    });
    setTransactions(updated);
    setForm({
      type: "receita",
      description: "",
      patientId: "",
      category: CATEGORIES[0],
      value: "",
      date: new Date().toISOString().slice(0, 10),
    });
    setShowForm(false);
  }

  function handleRemove(id) {
    setTransactions(removeTransaction(id));
  }

  function handleToggle(id) {
    setTransactions(toggleStatus(id));
  }

  return (
    <div>
      <PageHeader
        title="Financeiro"
        subtitle="Acompanhe suas receitas, despesas e o fluxo financeiro do seu consultório."
        searchPlaceholder="Buscar recibos, pacientes, pagamentos..."
        actionLabel="Novo lançamento"
        onAction={() => setShowForm(true)}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Receitas (mês)</p>
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{fmtCurrency(receitas)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Despesas (mês)</p>
            <TrendingDown size={18} className="text-red-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{fmtCurrency(despesas)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Saldo do mês</p>
            <Wallet size={18} className="text-brand" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{fmtCurrency(saldo)}</p>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3"
        >
          <div>
            <label className="text-xs text-gray-500 block mb-1">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-gray-500 block mb-1">Descrição</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ex: Consulta, Aluguel..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          {form.type === "receita" && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">Paciente</label>
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
          )}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="0,00"
              className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Salvar
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 px-2 py-2">
            <X size={16} />
          </button>
        </form>
      )}

      <div className="flex gap-6">
        <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100">
            {[
              { k: "todas", label: "Todas" },
              { k: "receitas", label: "Receitas" },
              { k: "despesas", label: "Despesas" },
            ].map((f) => (
              <button
                key={f.k}
                onClick={() => setFilter(f.k)}
                className={`text-xs px-3 py-1.5 rounded-lg ${
                  filter === f.k ? "bg-brand text-white" : "bg-gray-50 text-gray-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Wallet size={28} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Nenhuma movimentação registrada ainda.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="font-normal py-2 px-4">Data</th>
                  <th className="font-normal py-2 px-4">Descrição</th>
                  <th className="font-normal py-2 px-4">Categoria</th>
                  <th className="font-normal py-2 px-4">Valor</th>
                  <th className="font-normal py-2 px-4">Status</th>
                  <th className="font-normal py-2 px-4 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-4 text-gray-500">{fmtDate(t.date)}</td>
                    <td className="py-2.5 px-4">
                      <p className="font-medium text-gray-800">{t.description}</p>
                      {t.patientName && (
                        <p className="text-xs text-gray-400">{t.patientName}</p>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-gray-500">{t.category}</td>
                    <td
                      className={`py-2.5 px-4 font-medium ${
                        t.type === "receita" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {t.type === "receita" ? "+" : "-"} {fmtCurrency(t.value)}
                    </td>
                    <td className="py-2.5 px-4">
                      <button
                        onClick={() => handleToggle(t.id)}
                        className={`text-xs px-2 py-1 rounded-md ${
                          t.status === "Recebido" || t.status === "Pago"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {t.status}
                      </button>
                    </td>
                    <td className="py-2.5 px-4">
                      <button
                        onClick={() => handleRemove(t.id)}
                        aria-label="Remover lançamento"
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="w-72 shrink-0 bg-white border border-gray-200 rounded-xl p-4 h-fit">
          <p className="text-sm font-medium text-gray-800 mb-3">Contas a receber</p>
          {pendentes.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhuma pendência.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {pendentes.map((t) => (
                <div key={t.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-800">{t.patientName || t.description}</p>
                    <p className="text-xs text-gray-400">{fmtDate(t.date)}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {fmtCurrency(t.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
