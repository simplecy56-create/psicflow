"use client";

import { useEffect, useState } from "react";
import { User, Trash2, Save, AlertTriangle } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { getProfile, saveProfile, clearAllData } from "../../../lib/profile";

export default function ConfiguracoesPage() {
  const [profile, setProfile] = useState({
    name: "",
    crp: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [saved, setSaved] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  function handleSave(e) {
    e.preventDefault();
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClearData() {
    clearAllData();
    window.location.href = "/";
  }

  return (
    <div>
      <PageHeader
        title="Configurações"
        subtitle="Personalize sua conta e gerencie as preferências do sistema."
        searchPlaceholder="Buscar configurações..."
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-4">
          <form
            onSubmit={handleSave}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-gray-400" />
              <p className="font-medium text-gray-900">Perfil e conta</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Nome</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Registro profissional</label>
                <input
                  value={profile.crp}
                  onChange={(e) => setProfile({ ...profile, crp: e.target.value })}
                  placeholder="CRP 00/000000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">E-mail</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="seuemail@exemplo.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Telefone</label>
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="(11) 98765-4321"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1">Sobre</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  placeholder="Uma breve descrição sobre sua abordagem clínica..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              <Save size={15} />
              {saved ? "Salvo!" : "Salvar alterações"}
            </button>
          </form>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="font-medium text-gray-900 mb-1">Sobre o sistema</p>
            <p className="text-sm text-gray-500">
              PsicFlow — versão do projeto local, com Dashboard, Agenda, Pacientes,
              Prontuários, Financeiro, Relatórios, Tarefas e Recursos.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Os dados estão salvos no navegador (localStorage). Uma futura migração
              para banco de dados permitirá acesso de qualquer dispositivo e upload
              de arquivos.
            </p>
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-5 h-fit">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <p className="font-medium text-red-600">Zona de risco</p>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Apaga todos os dados salvos neste navegador: pacientes, consultas,
            prontuários, financeiro, tarefas e recursos. Essa ação não pode ser
            desfeita.
          </p>
          {!confirmingClear ? (
            <button
              onClick={() => setConfirmingClear(true)}
              className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 text-sm font-medium px-4 py-2 rounded-lg"
            >
              <Trash2 size={15} />
              Limpar todos os dados
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-red-600 font-medium">Tem certeza? Isso não pode ser desfeito.</p>
              <button
                onClick={handleClearData}
                className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                Sim, apagar tudo
              </button>
              <button
                onClick={() => setConfirmingClear(false)}
                className="w-full text-gray-500 text-sm px-4 py-2"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
