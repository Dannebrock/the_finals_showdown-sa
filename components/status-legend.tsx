export function StatusLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-6 py-6 border-t border-zinc-800 mt-8">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-sky-500" />
        <span className="text-sm text-zinc-400">Jogos transmitidos</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-green-500" />
        <span className="text-sm text-zinc-400">Avança para próxima fase</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-orange-500" />
        <span className="text-sm text-zinc-400">Mais uma chance</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-600" />
        <span className="text-sm text-zinc-400">Time eliminado</span>
      </div>
    </div>
  )
}
