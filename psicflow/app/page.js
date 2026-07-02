"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  Wallet,
  Clock,
  TrendingUp,
} from "lucide-react";
import { getPatients } from "../lib/storage";
import { getAppointments, typeInfo } from "../lib/appointments";
import { getTransactions, currentMonthTransactions, fmtCurrency } from "../lib/finance";

function todayLabel() {
  const d = new Date();
  const formatted = d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function MetricCard({ icon: Icon, label, value, sub, subColor = "text-gray-400" }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <Icon size={18} className="text-gray-400" />
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setPatients(getPatients());
    setAppointments(getAppointments());
    setTransactions(getTransactions());
  }, []);

  const activePatients = patients.filter((p) => p.status === "Ativo");
  const recent = patients.slice(0, 5);
  const todaysAppts = appointments
    .filter((a) => a.date === todayIso())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const monthTx = currentMonthTransactions(transactions);
  const receitasMes = monthTx
    .filter((t) => t.type === "receita")
    .reduce((s, t) => s + Number(t.value), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Olá, Dra. Marina Silva 👋
        </h1>
      </div>
      <p className="text-sm text-gray-500 mb-8">{todayLabel()}</p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard icon={Calendar} label="Consultas hoje" value={todaysAppts.length} sub={todaysAppts.length ? "Ver agenda" : "Nenhuma agendada"} subColor="text-brand" />
        <MetricCard
          icon={Users}
          label="Pacientes ativos"
          value={activePatients.length}
          sub={`${patients.length} cadastrados no total`}
          subColor="text-green-600"
        />
        <MetricCard icon={Wallet} label="Faturamento do mês" value={fmtCurrency(receitasMes)} sub={monthTx.length ? "Ver financeiro" : "Nenhum lançamento"} subColor="text-brand" />
        <MetricCard icon={Clock} label="Total de consultas" value={appointments.length} sub="Cadastradas na agenda" subColor="text-green-600" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-gray-900">Agenda de hoje</p>
          </div>
          {todaysAppts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar size={28} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">
                Nenhuma consulta agendada para hoje.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {todaysAppts.map((a) => {
                const info = typeInfo(a.type);
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2"
                    style={{ backgroundColor: info.color, color: info.text }}
                  >
                    <span className="text-xs font-semibold w-12 shrink-0">{a.startTime}</span>
                    <span className="text-sm font-medium flex-1 truncate">{a.patientName}</span>
                    <span className="text-xs opacity-80">{info.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-gray-900">Pacientes recentes</p>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum paciente cadastrado ainda.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recent.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center text-xs font-semibold shrink-0">
                    {p.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-800 truncate">{p.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-3">
        <TrendingUp size={18} className="text-brand shrink-0" />
        <p className="text-sm text-gray-600">
          Progresso do sistema: Dashboard, Pacientes, Agenda, Prontuários e Financeiro
          prontos. Relatórios, tarefas, recursos e configurações entram nos
          próximos pacotes.
        </p>
      </div>
    </div>
  );
}
