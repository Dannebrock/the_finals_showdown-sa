"use client"

import Image from "next/image"
import { useTournament } from "@/components/tournament-context"
import { Button } from "@/components/ui/button"
import { Swords, Plus, Minus, Crown, Trophy, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function Bo3Management() {
  const { state, updateBo3Match, setCurrentDay } = useTournament()
  const { teams, groups, bo3Matches, currentDay } = state

  const getTeam = (teamId: string | null) => (teamId ? teams.find((t) => t.id === teamId) : null)

  // 1. Filtrar grupos do dia atual
  const dayGroupIds = groups.filter((g) => g.day === currentDay).map((g) => g.id)
  
  // 2. Filtrar partidas que pertencem a esses grupos
  const dayMatches = bo3Matches.filter((m) => dayGroupIds.includes(m.sourceGroupId))

  // 3. Remover duplicatas visuais (baseado em sourceGroupId e matchType)
  // Isso resolve o problema visual se o banco tiver lixo
  const uniqueMatchesMap = new Map();
  dayMatches.forEach(match => {
      const key = `${match.sourceGroupId}-${match.matchType}`; // Ex: "G5-upper"
      // Se for G8 (grupo único MD3), a chave é só o grupo
      if (match.sourceGroupId === 'G8' || match.matchType === undefined) { 
          uniqueMatchesMap.set(match.id, match);
      } else {
          if (!uniqueMatchesMap.has(key)) {
              uniqueMatchesMap.set(key, match);
          }
      }
  });
  const uniqueMatches = Array.from(uniqueMatchesMap.values()) as typeof bo3Matches;

  // 4. Agrupar por Grupo
  const matchesByGroup: Record<string, typeof bo3Matches> = {}
  
  const sortedMatches = uniqueMatches.sort((a, b) => {
      const groupA = groups.find(g => g.id === a.sourceGroupId)?.name || ""
      const groupB = groups.find(g => g.id === b.sourceGroupId)?.name || ""
      return groupA.localeCompare(groupB, undefined, { numeric: true })
  })

  sortedMatches.forEach((match) => {
    if (!matchesByGroup[match.sourceGroupId]) {
      matchesByGroup[match.sourceGroupId] = []
    }
    matchesByGroup[match.sourceGroupId].push(match)
  })

  // Handlers de Vitória
  const handleAddWin = (matchId: string, teamNumber: 1 | 2) => {
    const match = bo3Matches.find((m) => m.id === matchId)
    if (!match || match.completed) return
    const update = teamNumber === 1 
        ? { team1Wins: Math.min(match.team1Wins + 1, 2) }
        : { team2Wins: Math.min(match.team2Wins + 1, 2) }
    updateBo3Match(matchId, update)
  }

  const handleRemoveWin = (matchId: string, teamNumber: 1 | 2) => {
    const match = bo3Matches.find((m) => m.id === matchId)
    if (!match) return
    const update = teamNumber === 1 
        ? { team1Wins: Math.max(match.team1Wins - 1, 0), winnerId: null, completed: false }
        : { team2Wins: Math.max(match.team2Wins - 1, 0), winnerId: null, completed: false }
    updateBo3Match(matchId, update)
  }

  const getGroup = (groupId: string) => groups.find((g) => g.id === groupId)

  return (
    <div className="space-y-6">
      {/* Botões de Dia */}
      <div className="flex justify-center gap-4">
        <Button onClick={() => setCurrentDay(1)} className={cn("px-6 py-3 font-bold", currentDay === 1 ? "bg-amber-500 text-black" : "bg-zinc-800 text-white")}>Dia 1 - Sábado</Button>
        <Button onClick={() => setCurrentDay(2)} className={cn("px-6 py-3 font-bold", currentDay === 2 ? "bg-amber-500 text-black" : "bg-zinc-800 text-white")}>Dia 2 - Domingo</Button>
      </div>

      {/* Instruções */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
        <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Swords className="w-5 h-5 text-amber-500" /> Gerenciamento de Partidas</h3>
        <p className="text-sm text-zinc-400">As partidas aparecem aqui automaticamente quando um grupo é fechado.</p>
      </div>

      {/* Lista de Partidas */}
      {Object.keys(matchesByGroup).length > 0 ? (
        Object.entries(matchesByGroup).map(([groupId, matches]) => {
          const group = getGroup(groupId)
          return (
            <div key={groupId} className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-l-4 border-amber-500 pl-3">
                <Trophy className="w-5 h-5 text-amber-500" />
                {group?.name === 'G8' ? 'Decisão Final (Last Chance)' : `Partidas do Grupo ${group?.name}`}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {matches.map((match) => {
                  const team1 = getTeam(match.team1Id)
                  const team2 = getTeam(match.team2Id)
                  const isComplete = match.completed

                  return (
                    <div key={match.id} className={cn("bg-zinc-900 rounded-lg border overflow-hidden relative", isComplete ? "border-green-500" : "border-zinc-800")}>
                      
                      {/* Label do Tipo de Partida */}
                      <div className="absolute top-0 right-0 bg-zinc-800 text-[10px] px-2 py-1 text-zinc-400 rounded-bl">
                        {group?.name === 'G8' ? 'DECISÃO DE VAGA' : (match.matchType === 'upper' ? 'UPPER (1º vs 2º)' : 'LOWER (3º vs 4º)')}
                      </div>

                      {/* Cabeçalho */}
                      <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-white flex items-center gap-2">
                           <Swords className="w-3 h-3 text-zinc-400" />
                           {group?.name}
                        </span>
                        {isComplete && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Finalizada</span>}
                      </div>

                      {/* Conteúdo da Partida (Times e Placar) */}
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-4 items-center">
                          
                          {/* Time 1 */}
                          <TeamCard team={team1} wins={match.team1Wins} isWinner={match.winnerId === match.team1Id} onAdd={() => handleAddWin(match.id, 1)} onRemove={() => handleRemoveWin(match.id, 1)} isLocked={isComplete} />

                          {/* Placar Central */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-zinc-500">{match.team1Wins} - {match.team2Wins}</div>
                            <p className="text-xs text-zinc-500 mt-1">Md3</p>
                          </div>

                          {/* Time 2 */}
                          <TeamCard team={team2} wins={match.team2Wins} isWinner={match.winnerId === match.team2Id} onAdd={() => handleAddWin(match.id, 2)} onRemove={() => handleRemoveWin(match.id, 2)} isLocked={isComplete} />
                          
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      ) : (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <AlertTriangle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg">Nenhuma partida ativa.</p>
          <p className="text-zinc-500 text-sm mt-2">Certifique-se de que os grupos anteriores foram fechados corretamente.</p>
        </div>
      )}
    </div>
  )
}

// Componente auxiliar para limpar o código principal
function TeamCard({ team, wins, isWinner, onAdd, onRemove, isLocked }: any) {
    return (
        <div className={cn("text-center p-3 rounded-lg transition-all", isWinner && "bg-green-500/20 ring-2 ring-green-500")}>
            <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden bg-zinc-700 mb-2">
                {team?.logo ? <Image src={team.logo} alt={team.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-zinc-400">{team?.name?.charAt(0) || "?"}</div>}
            </div>
            <p className="font-bold text-white text-sm mb-2 truncate">{team?.name || "Aguardando..."}</p>
            
            {/* Bolinhas de Vitória */}
            <div className="flex items-center justify-center gap-1 mb-2">
                {[0, 1].map((i) => (
                    <div key={i} className={cn("w-3 h-3 rounded-full border", i < wins ? "bg-green-500 border-green-400" : "bg-zinc-800 border-zinc-600")} />
                ))}
            </div>

            {/* Botões */}
            {!isLocked && team && (
                <div className="flex items-center justify-center gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-500 hover:text-white" onClick={onRemove} disabled={wins === 0}><Minus className="w-3 h-3" /></Button>
                    <Button size="icon" className="h-6 w-6 bg-green-600 hover:bg-green-700" onClick={onAdd} disabled={wins >= 2}><Plus className="w-3 h-3" /></Button>
                </div>
            )}
            {isWinner && <div className="flex items-center justify-center gap-1 mt-2 text-amber-400"><Crown className="w-3 h-3" /><span className="text-[10px] font-bold">VENCEDOR</span></div>}
        </div>
    )
}