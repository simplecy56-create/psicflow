import PageHeader from "./PageHeader";

export default function ModulePlaceholder({ title, subtitle, icon: Icon }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} searchPlaceholder="Buscar..." />
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-24 text-center">
        {Icon && <Icon size={32} className="text-gray-300 mb-3" />}
        <p className="font-medium text-gray-800 mb-1">
          Este módulo ainda não foi construído
        </p>
        <p className="text-sm text-gray-500 max-w-xs">
          {title} entra em um dos próximos pacotes de código, seguindo a ordem combinada.
        </p>
      </div>
    </div>
  );
}
