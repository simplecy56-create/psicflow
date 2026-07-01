"use client";

import { useEffect, useState } from "react";
import { Trash2, Phone, Mail, X } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { getPatients, addPatient, removePatient } from "../../lib/storage";

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function PacientesPage() {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const updated = addPatient(form);
    setPatients(updated);
    setForm({ name: "", phone: "", email: "" });
    setShowForm(false);
  }

  function handleRemove(id) {
    const updated = removePatient(id);
    setPatients(updated);
    if (selected?.id === id) setSelected(null);
  }

  return (
    <div>
      <PageHeader
        title="Pacientes"
        subtitle="Gerencie e acompanhe seus pacientes."
        searchPlaceholder="Buscar paciente por nome, telefone ou e-mail..."
        actionLabel="Novo paciente"
        onAction={() => setShowForm(true)}
      />

      <div className="flex gap-6">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {showForm && (
            <form
              onSubmit={handleAdd}
              className="p-4 border-b border-gray-100 bg-gray-50 flex items-end gap-3"
            >
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Nome</label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome do paciente"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Telefone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 98765-4321"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">E-mail</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="paciente@email.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 px-2 py-2"
              >
                <X size={16} />
              </button>
            </form>
          )}

          {patients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-gray-500 mb-1">
                Nenhum paciente cadastrado ainda.
              </p>
              <p className="text-xs text-gray-400">
                Clique em "Novo paciente" para começar.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="font-normal py-3 px-4">Paciente</th>
                  <th className="font-normal py-3 px-4">Contato</th>
                  <th className="font-normal py-3 px-4">Status</th>
                  <th className="font-normal py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center text-xs font-semibold">
                          {initials(p.name)}
                        </div>
                        <span className="font-medium text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {p.phone || p.email || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(p.id);
                        }}
                        aria-label="Remover paciente"
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="w-80 shrink-0 bg-white border border-gray-200 rounded-xl p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-gray-900">Detalhes do paciente</p>
              <button onClick={() => setSelected(null)} className="text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-brand-light text-brand-dark flex items-center justify-center text-sm font-semibold">
                {initials(selected.name)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{selected.name}</p>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md">
                  {selected.status}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                {selected.phone || "Não informado"}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                {selected.email || "Não informado"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
