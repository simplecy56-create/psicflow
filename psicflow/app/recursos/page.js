"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderOpen, Star, X, Trash2, FileText } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import {
  getResources,
  addResource,
  removeResource,
  toggleFavorite,
  CATEGORIES,
} from "../../lib/resources";

export default function RecursosPage() {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[0],
  });

  useEffect(() => {
    setResources(getResources());
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = {};
    resources.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [resources]);

  const favorites = resources.filter((r) => r.favorite);

  const filtered =
    activeCategory === "Todos"
      ? resources
      : resources.filter((r) => r.category === activeCategory);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const updated = addResource(form);
    setResources(updated);
    setForm({ title: "", description: "", category: CATEGORIES[0] });
    setShowForm(false);
  }

  function handleRemove(id) {
    setResources(removeResource(id));
  }

  function handleFavorite(id) {
    setResources(toggleFavorite(id));
  }

  return (
    <div>
      <PageHeader
        title="Recursos"
        subtitle="Ferramentas e materiais para apoiar sua prática clínica."
        searchPlaceholder="Buscar recursos..."
        actionLabel="Novo recurso"
        onAction={() => setShowForm(true)}
      />

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-500 block mb-1">Título</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Modelo de anamnese infantil"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-500 block mb-1">Descrição</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Breve descrição"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
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
          <button
            type="submit"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Adicionar
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 px-2 py-2">
            <X size={16} />
          </button>
        </form>
      )}

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setActiveCategory("Todos")}
              className={`text-xs px-3 py-1.5 rounded-lg border ${
                activeCategory === "Todos"
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              Todos ({resources.length})
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-lg border ${
                  activeCategory === c
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                {c} ({categoryCounts[c] || 0})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-20 text-center">
              <FolderOpen size={28} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Nenhum recurso nessa categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-brand-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                    {r.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.description}</p>
                    )}
                    <span className="inline-block text-[10px] text-gray-400 mt-1.5 bg-gray-50 px-2 py-0.5 rounded-md">
                      {r.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleFavorite(r.id)}
                      aria-label="Favoritar recurso"
                      className={r.favorite ? "text-amber-400" : "text-gray-300"}
                    >
                      <Star size={16} fill={r.favorite ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => handleRemove(r.id)}
                      aria-label="Remover recurso"
                      className="text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-72 shrink-0 bg-white border border-gray-200 rounded-xl p-4 h-fit">
          <p className="text-sm font-medium text-gray-800 mb-3">Meus favoritos</p>
          {favorites.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhum favorito ainda.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {favorites.map((r) => (
                <div key={r.id} className="flex items-center gap-2">
                  <Star size={13} className="text-amber-400 shrink-0" fill="currentColor" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-800 truncate">{r.title}</p>
                    <p className="text-[10px] text-gray-400 truncate">{r.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
