"use client"

import { themeColors } from "@/lib/types" // Importando o novo tema
import { cn } from "@/lib/utils"

export function Legend() {
  const items = [   
    { 
      // Laranja
      className: themeColors.final, 
      label: "Vaga para Final", 
      labelEn: "Spot in Final" 
    },
    { 
      // Laranja
      className: themeColors.sunday, 
      label: "Avança para Domingo", 
      labelEn: "Advance to Sunday" 
    },
    { 
      // Azul
      className: themeColors.survival, 
      label: "Mais uma chance", 
      labelEn: "One more chance" 
    },
    { 
      // Vermelho
      className: themeColors.eliminated, 
      label: "Time eliminado", 
      labelEn: "Eliminated" 
    },
  ]

  return (
    <div className="mt-8 md:mt-12 bg-zinc-900 rounded-lg border border-zinc-800 p-3 md:p-4">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-8">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Usamos className agora em vez de style backgroundColor */}
            <div className={cn("w-5 h-5 sm:w-6 sm:h-6 rounded flex-shrink-0", item.className)} />
            
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-zinc-300">{item.label}</span>
              <span className="text-[10px] sm:text-xs text-zinc-500">{item.labelEn}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}