"use client"

import { Flame } from "lucide-react"

interface DayTabsProps {
  currentDay: 1 | 2
  onDayChange: (day: 1 | 2) => void
}

export function DayTabs({ currentDay, onDayChange }: DayTabsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="inline-flex rounded-full overflow-hidden bg-zinc-800 p-1">
        <button
          onClick={() => onDayChange(1)}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors rounded-full ${
            currentDay === 1 ? "bg-amber-500 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Flame className="w-4 h-4" />
          Dia 1 - Sábado
        </button>
        <button
          onClick={() => onDayChange(2)}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors rounded-full ${
            currentDay === 2 ? "bg-amber-500 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Flame className="w-4 h-4" />
          Dia 2 - Domingo
        </button>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-white">
          {currentDay === 1 ? "Dia 1 - Sábado, 6 de Dezembro" : "Dia 2 - Domingo, 7 de Dezembro"}
        </h3>
        <p className="text-zinc-400">14h às 21h (BRT)</p>
      </div>
    </div>
  )
}
