"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Users, Wallet, CalendarCheck } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { getPatients } from "../../../lib/storage";
import { getAppointments, APPOINTMENT_TYPES, typeInfo } from "../../../lib/appointments";
import { getTransactions, currentMonthTransactions, fmtCurrency } from "../../../lib/finance";

function monthLabel(date) {
  const label = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function RelatoriosPage() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getPatients().then(setPatients);
    setAppointments(getAppointments());
    setTransactions(getTransactions());
  }, []);

  const now = new Date();
  const monthAppts = useMemo(() => {
    return appointments.filter((a) => {
      const d = new Date(a.date + "T00:00:00");
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
  }, [appointments]);

  const monthTx = currentMonthTransactions(transactions);
  const receitas = monthTx.filter((t) => t.type === "receita").reduce((s, t) => s + Number(t.value), 0);
  const despesas = monthTx.filter((t) => t.type === "despesa").reduce((s, t) => s + Number(t.value), 0);

  const byType = APPOINTMENT_TYPES.map((type) => {
    const count = monthAppts.filter((a) => a.type === type.value).length;
    return { ...type, count };
  }).filter((t) => t.count > 0);

  const totalTypeCount = byType.reduce((s, t) => s + t.count, 0);

  const activePatients = patients.filter((p) => p.status === "Ativo").length;

  // Pacientes com mais sessões no mês
  const patientCounts = {};
  monthAppts.forEach((a) => {
    patientCounts[a.patientName] = (patientCounts[a.patientName] || 0) + 1;
  });
  const topPatients = Object.entries(patientCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Relatórios"
        subtitle="Analise dados e acompanhe os resultados da sua clínica."
        searchPlaceholder="Buscar relatórios..."
      />

      <p className="text-sm text-gray-500 mb-4">Referente a {monthLabel(now)}</p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total de atendimentos</p>
            <CalendarCheck size={18} className="text-brand" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{monthAppts.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Pacientes ativos</p>
            <Users size={18} className="text-brand" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{activePatients}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Faturamento bruto</p>
            <Wallet size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{fmtCurrency(receitas)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Lucro líquido</p>
            <BarChart3 size={18} className="text-brand" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{fmtCurrency(receitas - despesas)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="font-medium text-gray-900 mb-4">Atendimentos por tipo</p>
          {byType.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum atendimento registrado este mês.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {byType.map((t) => {
                const pct = Math.round((t.count / totalTypeCount) * 100);
                return (
                  <div key={t.value}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: t.color }}
                        ></span>
                        <span className="text-sm text-gray-700">{t.label}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {t.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: t.text }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="font-medium text-gray-900 mb-4">Pacientes com mais sessões (mês)</p>
          {topPatients.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum atendimento registrado este mês.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {topPatients.map(([name, count]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{name}</span>
                  <span className="text-sm font-medium text-gray-900">{count} sessões</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
