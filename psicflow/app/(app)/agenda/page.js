"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { getPatients } from "../../../lib/storage";
import {
  getAppointments,
  addAppointment,
  removeAppointment,
  APPOINTMENT_TYPES,
  typeInfo,
} from "../../../lib/appointments";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HOURS = Array.from({ length: 12 }, (_, i) => 7 + i); // 07h to 18h

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function fmtDate(d) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AgendaPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    date: isoDate(new Date()),
    startTime: "09:00",
    endTime: "10:00",
    type: "individual",
  });

  useEffect(() => {
    setAppointments(getAppointments());
    getPatients().then(setPatients);
  }, []);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  function apptsForDay(day) {
    const iso = isoDate(day);
    return appointments
      .filter((a) => a.date === iso)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.patientId) return;
    const patient = patients.find((p) => p.id === form.patientId);
    const updated = addAppointment({
      ...form,
      patientName: patient ? patient.name : "Paciente",
    });
    setAppointments(updated);
    setShowForm(false);
  }

  function handleRemove(id) {
    setAppointments(removeAppointment(id));
  }

  return (
    <div>
      <PageHeader
        title="Agenda"
        subtitle="Organize seus horários e consultas."
        searchPlaceholder="Buscar paciente ou consulta..."
        actionLabel="Nova consulta"
        onAction={() => setShowForm(true)}
      />

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center"
        >
          <ChevronLeft size={16} className="text-gray-500" />
        </button>
        <button
          onClick={() => setWeekStart(startOfWeek(new Date()))}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
        >
          Hoje
        </button>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center"
        >
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        <span className="text-sm text-gray-600 ml-2">
          {fmtDate(weekDays[0])} – {fmtDate(weekDays[6])}
        </span>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3"
        >
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-gray-500 block mb-1">Paciente</label>
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
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
            <label className="text-xs text-gray-500 block mb-1">Início</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Fim</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {APPOINTMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Agendar
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

      {patients.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-4">
          Cadastre pacientes na página "Pacientes" antes de criar consultas.
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100">
          <div></div>
          {weekDays.map((day, i) => {
            const isToday = isoDate(day) === isoDate(new Date());
            return (
              <div
                key={i}
                className={`text-center py-2 border-l border-gray-100 ${
                  isToday ? "bg-brand-light" : ""
                }`}
              >
                <p className="text-xs text-gray-400">{DAY_LABELS[day.getDay()]}</p>
                <p
                  className={`text-sm font-medium ${
                    isToday ? "text-brand-dark" : "text-gray-700"
                  }`}
                >
                  {day.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              <div className="text-xs text-gray-400 text-right pr-2 py-3 border-t border-gray-50">
                {hour}:00
              </div>
              {weekDays.map((day, i) => {
                const dayAppts = apptsForDay(day).filter(
                  (a) => parseInt(a.startTime.split(":")[0]) === hour
                );
                return (
                  <div
                    key={i}
                    className="border-t border-l border-gray-50 min-h-[52px] p-1 relative"
                  >
                    {dayAppts.map((a) => {
                      const info = typeInfo(a.type);
                      return (
                        <div
                          key={a.id}
                          className="rounded-lg px-2 py-1 mb-1 group relative"
                          style={{ backgroundColor: info.color, color: info.text }}
                        >
                          <p className="text-xs font-medium truncate">
                            {a.startTime} {a.patientName}
                          </p>
                          <p className="text-[10px] truncate opacity-80">{info.label}</p>
                          <button
                            onClick={() => handleRemove(a.id)}
                            aria-label="Remover consulta"
                            className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 text-current"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {APPOINTMENT_TYPES.map((t) => (
          <div key={t.value} className="flex items-center gap-2 text-xs text-gray-500">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: t.color }}
            ></span>
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}
