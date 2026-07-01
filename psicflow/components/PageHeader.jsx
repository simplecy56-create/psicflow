"use client";

import { Search, Bell, Calendar, Plus } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  searchPlaceholder = "Buscar...",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex items-start justify-between mb-8 gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm w-64 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <button className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center relative">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        <button className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
          <Calendar size={16} className="text-gray-500" />
        </button>
        {actionLabel && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            <Plus size={16} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
