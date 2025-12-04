"use client"

import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface DaySelectorProps {
  currentDay: 1 | 2
  onDayChange: (day: 1 | 2) => void
}

export function DaySelector({ currentDay, onDayChange }: DaySelectorProps) {
  return (
    <div className="flex justify-center my-6">
      <div className="inline-flex bg-zinc-800 border border-zinc-700 rounded-full p-1">
        <button
          onClick={() => onDayChange(1)}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all",
            currentDay === 1 ? "bg-red-500 text-white" : "text-zinc-400 hover:text-white",
          )}
        >
          <Flame className="w-4 h-4" />
          Dia 1 - Sábado
        </button>
        <button
          onClick={() => onDayChange(2)}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all",
            currentDay === 2 ? "bg-red-500 text-white" : "text-zinc-400 hover:text-white",
          )}
        >
          <Flame className="w-4 h-4" />
          Dia 2 - Domingo
        </button>
      </div>
    </div>
  )
}
