"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Wallet,
  BarChart3,
  CheckSquare,
  FolderOpen,
  Settings,
  HelpCircle,
  Stethoscope,
  LogOut,
} from "lucide-react";
import { createClient } from "../lib/supabase";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/prontuarios", label: "Prontuários", icon: FileText },
  { href: "/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/tarefas", label: "Tarefas", icon: CheckSquare },
  { href: "/recursos", label: "Recursos", icon: FolderOpen },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 bg-sidebar text-white flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
          <Stethoscope size={18} />
        </div>
        <div>
          <p className="font-semibold text-sm leading-none">PsicFlow</p>
        </div>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-brand text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-sm cursor-pointer">
          <HelpCircle size={18} />
          <span>Ajuda e suporte</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-sm"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>

      <div className="border-t border-white/10 px-4 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-light text-brand-dark flex items-center justify-center text-xs font-semibold">
          DR
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">Dra. Marina Silva</p>
          <p className="text-xs text-white/50 truncate">Psicóloga | CRP 06/123456</p>
        </div>
      </div>
    </aside>
  );
}
