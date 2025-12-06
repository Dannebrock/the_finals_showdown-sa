"use client"

import Image from "next/image"
import { useTournament } from "@/components/tournament-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Crown, Star, X, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { Team, FinalMatch } from "@/lib/types"

// --- COMPONENTE 1: SETUP DA FINAL (Seleção de Times) ---
function SetupFinalComponent() {
  const { state, initFinalMatch } = useTournament()
  const { teams } = state
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])

  const handleAddTeam = (teamId: string) => {
    if (selectedTeams.length < 4 && !selectedTeams.includes(teamId)) {
      setSelectedTeams([...selectedTeams, teamId])
    }
  }

  const themeColors = {
  final: "bg-green-600 border-green-500 shadow-[0_0_20px_rgba(22,163,74,0.6)] ring-2 ring-green-400",
  default: "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 transition-colors"
}

  const handleRemoveTeam = (teamId: string) => {
    setSelectedTeams(selectedTeams.filter((id) => id !== teamId))
  }

  const availableTeams = teams.filter((t) => !selectedTeams.includes(t.id))

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-500" />
        Configurar Final
      </h3>

      <div className="space-y-4">
        {/* Dropdown de Seleção */}
        <Select onValueChange={handleAddTeam} disabled={selectedTeams.length >= 4}>
          <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Adicionar time à final..." />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            {availableTeams.map((team) => (
              <SelectItem key={team.id} value={team.id} className="text-white hover:bg-zinc-700 cursor-pointer">
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Times Selecionados */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedTeams.map((teamId) => {
            const team = teams.find((t) => t.id === teamId)
            if (!team) return null
            return (
              <div key={teamId} className="bg-zinc-800 rounded-lg p-3 text-center relative group border border-zinc-700">
                <button
                  onClick={() => handleRemoveTeam(teamId)}
                  className="absolute top-1 right-1 text-zinc-500 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden bg-zinc-700 mb-2">
                  {team.logo ? (
                    <Image src={team.logo} alt={team.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500">
                      {team.name.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="text-white text-sm font-medium truncate">{team.name}</p>
              </div>
            )
          })}
        </div>

        <Button
          onClick={() => initFinalMatch(selectedTeams)}
          disabled={selectedTeams.length < 2}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Iniciar Final ({selectedTeams.length}/4 times)
        </Button>
      </div>
    </div>
  )
}

// --- COMPONENTE 2: PLACAR GERAL (Visualização dos Pontos) ---
function Scoreboard({ teams: finalTeams, allTeams }: { teams: FinalMatch['teams'], allTeams: Team[] }) {
  // Ordena por pontos
  const sortedTeams = [...finalTeams].sort((a, b) => b.points - a.points)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {sortedTeams.map((ft) => {
        const team = allTeams.find((t) => t.id === ft.teamId)
        const isMatchPoint = ft.points >= 4
        
        return (
          <div key={ft.teamId} className={cn(
            "bg-zinc-900 border rounded-lg p-4 text-center relative transition-all",
            isMatchPoint ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "border-zinc-800"
          )}>
             {isMatchPoint && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  MATCH POINT
                </div>
             )}
             
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-zinc-800 mb-2 border-2 border-zinc-700">
              {team?.logo ? (
                <Image src={team.logo} alt={team.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl text-zinc-500 font-bold">
                  {team?.name.charAt(0)}
                </div>
              )}
            </div>
            
            <h4 className="text-white font-bold truncate mb-1">{team?.name}</h4>
            
            {/* Pontuação Numérica */}
            <div className="text-4xl font-black text-white mb-2">{ft.points}</div>
            
            {/* Indicadores Visuais (Bolinhas) */}
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors",
                    i < ft.points ? "bg-amber-500" : "bg-zinc-800"
                  )} 
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// --- COMPONENTE PRINCIPAL ---
export function FinalManagement() {
  const { state, startNewRound, submitCashoutResults, submitBo3Results } = useTournament()
  const { teams, finalMatch } = state

  // State local para inputs
  const [cashoutInputs, setCashoutInputs] = useState<Record<string, number>>({})
  const [bo3Score, setBo3Score] = useState<{ t1: number, t2: number }>({ t1: 0, t2: 0 })

  // Se não existe final criada, mostra o Setup
  if (!finalMatch) return <SetupFinalComponent />

  // Encontra o round ativo
  const activeRound = finalMatch.rounds?.find(r => r.status === 'active')

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 text-center shadow-lg">
        <Trophy className="w-12 h-12 text-black mx-auto mb-2" />
        <h2 className="text-2xl font-black text-black">THE FINAL</h2>
        <p className="text-black/80 font-bold">Primeiro a atingir 5 pontos vence!</p>
      </div>

      {/* Placar Global */}
      <Scoreboard teams={finalMatch.teams} allTeams={teams} />

      {/* Área de Gerenciamento do Round Atual */}
      <div className="bg-zinc-900 p-6 rounded-lg border border-amber-500/30 relative overflow-hidden">
        {/* Faixa decorativa */}
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>

        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-amber-500">▶</span>
          Status Atual: 
          <span className="ml-2 uppercase tracking-wider text-sm bg-zinc-800 px-3 py-1 rounded text-zinc-300">
            {activeRound 
              ? (activeRound.stage === 'cashout' ? 'Disputa de Cashout' : 'Duelo MD3 (Final Round)') 
              : (finalMatch.completed ? 'Torneio Finalizado' : 'Aguardando Início')}
          </span>
        </h3>

        {/* CENÁRIO 1: Nenhum round ativo (Início) */}
        {!activeRound && !finalMatch.completed && (
           <div className="text-center py-8">
             <p className="text-zinc-400 mb-4">Nenhum round ativo. Inicie o ciclo de cashout.</p>
             <Button onClick={() => startNewRound(finalMatch.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8">
               Iniciar Primeiro Ciclo (Cashout)
             </Button>
           </div>
        )}

        {/* CENÁRIO 2: Round de Cashout */}
        {activeRound?.stage === 'cashout' && (
           <div className="space-y-4 max-w-xl mx-auto">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded mb-6 text-sm text-blue-200">
                 ℹ️ Insira o valor total ganho por cada time nesta rodada. Os 2 maiores avançarão para a MD3.
              </div>
              
              {finalMatch.teams.map(ft => {
                 const team = teams.find(t => t.id === ft.teamId)
                 return (
                    <div key={ft.teamId} className="flex items-center gap-4">
                       <div className="w-8 h-8 relative rounded-full overflow-hidden bg-zinc-800 shrink-0">
                          {team?.logo && <Image src={team.logo} alt="" fill className="object-cover" />}
                       </div>
                       <span className="text-white font-bold flex-1 truncate">{team?.name}</span>
                       <div className="relative w-40">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                          <Input 
                             type="number" 
                             className="pl-6 bg-zinc-950 border-zinc-700 text-white font-mono"
                             placeholder="0"
                             value={cashoutInputs[ft.teamId] || ''} // <-- OBRIGA A LER DO STATE ZERADO
                             onChange={(e) => setCashoutInputs({...cashoutInputs, [ft.teamId]: Number(e.target.value)})}
                          />
                       </div>
                    </div>
                 )
              })}
              
              <Button 
                 onClick={() => {
                    submitCashoutResults(activeRound.id, cashoutInputs)
                    setCashoutInputs({}) // <-- LIMPA O STATE
                 }}
                 className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold mt-6 h-12 text-lg"
              >
                 Confirmar Cashout & Definir Duelo
              </Button>
           </div>
        )}

        {/* CENÁRIO 3: Round de MD3 (Atualizado para Score) */}
        {activeRound?.stage === 'bo3' && activeRound.results && (
           <div className="text-center">
              <p className="text-zinc-400 mb-8">
                 Insira o placar final da MD3. <br/>
                 <span className="text-amber-500 text-sm font-bold">Cada vitória conta como +1 Ponto na tabela geral.</span>
              </p>
              
              <div className="flex items-center justify-center gap-8 md:gap-16">
                 {/* Time 1 */}
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 relative rounded-full overflow-hidden bg-black border-2 border-zinc-700">
                       {(() => {
                          const t = teams.find(t => t.id === activeRound.results!.team1Id)
                          return t?.logo ? <Image src={t.logo} alt="" fill className="object-cover" /> : null
                       })()}
                    </div>
                    <div className="font-bold text-xl text-white">{teams.find(t => t.id === activeRound.results!.team1Id)?.name}</div>
                    
                    <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-2 border border-zinc-700">
                       <Button size="icon" variant="ghost" onClick={() => setBo3Score(s => ({...s, t1: Math.max(0, s.t1 - 1)}))}><Minus className="w-4 h-4"/></Button>
                       <span className="text-3xl font-black w-8 text-center text-green-500">{bo3Score.t1}</span>
                       <Button size="icon" className="bg-green-600 hover:bg-green-700" onClick={() => setBo3Score(s => ({...s, t1: Math.min(2, s.t1 + 1)}))}><Plus className="w-4 h-4"/></Button>
                    </div>
                 </div>

                 <div className="text-4xl font-black text-zinc-600 italic">VS</div>

                 {/* Time 2 */}
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 relative rounded-full overflow-hidden bg-black border-2 border-zinc-700">
                       {(() => {
                          const t = teams.find(t => t.id === activeRound.results!.team2Id)
                          return t?.logo ? <Image src={t.logo} alt="" fill className="object-cover" /> : null
                       })()}
                    </div>
                    <div className="font-bold text-xl text-white">{teams.find(t => t.id === activeRound.results!.team2Id)?.name}</div>
                    
                    <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-2 border border-zinc-700">
                       <Button size="icon" variant="ghost" onClick={() => setBo3Score(s => ({...s, t2: Math.max(0, s.t2 - 1)}))}><Minus className="w-4 h-4"/></Button>
                       <span className="text-3xl font-black w-8 text-center text-green-500">{bo3Score.t2}</span>
                       <Button size="icon" className="bg-green-600 hover:bg-green-700" onClick={() => setBo3Score(s => ({...s, t2: Math.min(2, s.t2 + 1)}))}><Plus className="w-4 h-4"/></Button>
                    </div>
                 </div>
              </div>

              <Button 
                 onClick={() => {
                     submitBo3Results(activeRound.id, activeRound.results!.team1Id, activeRound.results!.team2Id, bo3Score.t1, bo3Score.t2)
                     setBo3Score({ t1: 0, t2: 0 }) // <-- LIMPA O PLACAR
                 }}
                 // Bloqueia se o placar for inválido (md3 precisa que alguém ganhe 2 para acabar, ou pelo menos some algum ponto válido)
                 disabled={bo3Score.t1 === 0 && bo3Score.t2 === 0} 
                 className="mt-12 bg-amber-500 text-black hover:bg-amber-600 font-bold px-12 py-6 text-xl rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                 Confirmar Pontuação
              </Button>
           </div>
        )}
        
        {/* CENÁRIO 4: Fim de jogo */}
        {finalMatch.completed && (
           <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
             <Crown className="w-24 h-24 text-amber-500 mx-auto mb-4 animate-bounce" />
             <h3 className="text-4xl font-black text-white mb-2">TEMOS UM CAMPEÃO!</h3>
             <p className="text-2xl text-amber-500 font-bold">
                {teams.find(t => t.id === finalMatch.winnerId)?.name}
             </p>
           </div>
        )}
      </div>
    </div>
  )
}