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

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  const activePatients = patients.filter((p) => p.status === "Ativo");
  const recent = patients.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Olá, Dra. Marina Silva 👋
        </h1>
      </div>
      <p className="text-sm text-gray-500 mb-8">{todayLabel()}</p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard icon={Calendar} label="Consultas hoje" value="0" sub="Agenda ainda não construída" />
        <MetricCard
          icon={Users}
          label="Pacientes ativos"
          value={activePatients.length}
          sub={`${patients.length} cadastrados no total`}
          subColor="text-green-600"
        />
        <MetricCard icon={Wallet} label="Faturamento do mês" value="R$ 0,00" sub="Módulo financeiro em breve" />
        <MetricCard icon={Clock} label="Sessões pendentes" value="0" sub="Módulo agenda em breve" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-gray-900">Agenda de hoje</p>
            <span className="text-xs text-gray-400">Em construção</span>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar size={28} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              O módulo de agenda ainda não foi construído.
            </p>
          </div>
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
          Progresso do sistema: Dashboard e Pacientes prontos. Agenda, prontuários,
          financeiro, relatórios, tarefas, recursos e configurações entram nos
          próximos pacotes.
        </p>
      </div>
    </div>
  );
}
