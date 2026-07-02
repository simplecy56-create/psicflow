"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, X, Target, Stethoscope } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { getPatients } from "../../lib/storage";
import {
  recordsForPatient,
  addRecord,
  removeRecord,
  getProfile,
  saveProfile,
} from "../../lib/records";

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function fmt(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function ProntuariosPage() {
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [records, setRecords] = useState([]);
  const [profile, setProfile] = useState({ diagnosis: "", hypothesis: "", goals: [] });
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    complaint: "",
    summary: "",
    interventions: "",
    plan: "",
  });

  useEffect(() => {
    const p = getPatients();
    setPatients(p);
    if (p.length > 0) setSelectedId(p[0].id);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setRecords(recordsForPatient(selectedId));
    setProfile(getProfile(selectedId));
  }, [selectedId]);

  const selectedPatient = patients.find((p) => p.id === selectedId);

  function handleAddRecord(e) {
    e.preventDefault();
    if (!form.complaint.trim() && !form.summary.trim()) return;
    addRecord({ ...form, patientId: selectedId });
    setRecords(recordsForPatient(selectedId));
    setForm({
      date: new Date().toISOString().slice(0, 10),
      complaint: "",
      summary: "",
      interventions: "",
      plan: "",
    });
    setShowForm(false);
  }

  function handleRemoveRecord(id) {
    removeRecord(id);
    setRecords(recordsForPatient(selectedId));
  }

  function handleSaveProfile() {
    saveProfile(selectedId, profile);
    setEditingProfile(false);
  }

  function addGoal() {
    if (!newGoal.trim()) return;
    setProfile({ ...profile, goals: [...profile.goals, { text: newGoal, done: false }] });
    setNewGoal("");
  }

  function toggleGoal(idx) {
    const goals = [...profile.goals];
    goals[idx] = { ...goals[idx], done: !goals[idx].done };
    const updated = { ...profile, goals };
    setProfile(updated);
    saveProfile(selectedId, updated);
  }

  if (patients.length === 0) {
    return (
      <div>
        <PageHeader
          title="Prontuários"
          subtitle="Acompanhe toda a evolução clínica dos seus pacientes."
          searchPlaceholder="Buscar no prontuário..."
        />
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-24 text-center">
          <FileText size={32} className="text-gray-300 mb-3" />
          <p className="font-medium text-gray-800 mb-1">Nenhum paciente cadastrado</p>
          <p className="text-sm text-gray-500 max-w-xs">
            Cadastre pacientes na página "Pacientes" para começar a registrar prontuários.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Prontuários"
        subtitle="Acompanhe toda a evolução clínica dos seus pacientes."
        searchPlaceholder="Buscar no prontuário..."
      />

      <div className="flex gap-6">
        {/* Lista de pacientes */}
        <div className="w-64 shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden h-fit">
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 last:border-0 ${
                selectedId === p.id ? "bg-brand-light" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center text-xs font-semibold shrink-0">
                {initials(p.name)}
              </div>
              <span className="text-sm text-gray-800 truncate">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo do prontuário */}
        {selectedPatient && (
          <div className="flex-1 min-w-0 flex gap-6">
            <div className="flex-1 min-w-0">
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-light text-brand-dark flex items-center justify-center text-sm font-semibold">
                    {initials(selectedPatient.name)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedPatient.name}</p>
                    <p className="text-xs text-gray-500">{records.length} registro(s)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                  <Plus size={16} />
                  Novo registro
                </button>
              </div>

              {showForm && (
                <form
                  onSubmit={handleAddRecord}
                  className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-gray-800">Novo registro</p>
                    <button type="button" onClick={() => setShowForm(false)} className="text-gray-400">
                      <X size={16} />
                    </button>
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
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Queixa principal</label>
                    <input
                      value={form.complaint}
                      onChange={(e) => setForm({ ...form, complaint: e.target.value })}
                      placeholder="Ex: Ansiedade em situações sociais"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Resumo da sessão</label>
                    <textarea
                      value={form.summary}
                      onChange={(e) => setForm({ ...form, summary: e.target.value })}
                      rows={3}
                      placeholder="O que foi discutido, evolução observada..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Intervenções</label>
                    <textarea
                      value={form.interventions}
                      onChange={(e) => setForm({ ...form, interventions: e.target.value })}
                      rows={2}
                      placeholder="Técnicas utilizadas na sessão..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Plano para próxima sessão</label>
                    <textarea
                      value={form.plan}
                      onChange={(e) => setForm({ ...form, plan: e.target.value })}
                      rows={2}
                      placeholder="Tarefas, foco da próxima sessão..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="self-end bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg"
                  >
                    Salvar registro
                  </button>
                </form>
              )}

              {records.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-16 text-center">
                  <FileText size={28} className="text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">Nenhum registro ainda para este paciente.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {records.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 relative group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-brand-dark bg-brand-light px-2 py-0.5 rounded-md">
                          {fmt(r.date)}
                        </span>
                        <button
                          onClick={() => handleRemoveRecord(r.id)}
                          aria-label="Remover registro"
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {r.complaint && (
                        <p className="text-sm font-medium text-gray-800 mb-1">{r.complaint}</p>
                      )}
                      {r.summary && (
                        <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">{r.summary}</p>
                      )}
                      {r.interventions && (
                        <p className="text-xs text-gray-500 mb-1">
                          <span className="font-medium">Intervenções: </span>
                          {r.interventions}
                        </p>
                      )}
                      {r.plan && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Próxima sessão: </span>
                          {r.plan}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Painel lateral: diagnóstico e objetivos */}
            <div className="w-72 shrink-0 flex flex-col gap-4 h-fit">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Stethoscope size={15} className="text-gray-400" />
                    <p className="text-sm font-medium text-gray-800">Diagnóstico / Hipóteses</p>
                  </div>
                  <button
                    onClick={() =>
                      editingProfile ? handleSaveProfile() : setEditingProfile(true)
                    }
                    className="text-xs text-brand font-medium"
                  >
                    {editingProfile ? "Salvar" : "Editar"}
                  </button>
                </div>
                {editingProfile ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={profile.diagnosis}
                      onChange={(e) => setProfile({ ...profile, diagnosis: e.target.value })}
                      placeholder="Diagnóstico (ex: F41.1)"
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs"
                    />
                    <input
                      value={profile.hypothesis}
                      onChange={(e) => setProfile({ ...profile, hypothesis: e.target.value })}
                      placeholder="Hipótese"
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-gray-600 flex flex-col gap-1">
                    <p>{profile.diagnosis || "Nenhum diagnóstico registrado."}</p>
                    {profile.hypothesis && (
                      <p className="text-gray-400">Hipótese: {profile.hypothesis}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={15} className="text-gray-400" />
                  <p className="text-sm font-medium text-gray-800">Objetivos</p>
                </div>
                <div className="flex flex-col gap-2 mb-3">
                  {profile.goals.length === 0 ? (
                    <p className="text-xs text-gray-400">Nenhum objetivo definido.</p>
                  ) : (
                    profile.goals.map((g, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <input
                          type="checkbox"
                          checked={g.done}
                          onChange={() => toggleGoal(idx)}
                          className="accent-brand"
                        />
                        <span className={g.done ? "line-through text-gray-400" : ""}>{g.text}</span>
                      </label>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addGoal()}
                    placeholder="Novo objetivo..."
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs"
                  />
                  <button
                    onClick={addGoal}
                    className="text-xs bg-brand-light text-brand-dark px-2 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
