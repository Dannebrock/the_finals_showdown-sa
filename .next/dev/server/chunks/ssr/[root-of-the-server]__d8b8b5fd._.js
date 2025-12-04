module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/tournament-bracke/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/tournament-bracke/node_modules/@supabase/supabase-js/dist/module/index.js [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://rmrkfpuwzrdwukyxaczc.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcmtmcHV3enJkd3VreXhhY3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzI3NjQsImV4cCI6MjA4MDM0ODc2NH0.2y7NJ2u4Q9FTqNGqkC17NJvdUzCgXoIkQ52i0SX9D-o");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
}),
"[project]/tournament-bracke/components/tournament-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TournamentProvider",
    ()=>TournamentProvider,
    "useTournament",
    ()=>useTournament
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tournament-bracke/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tournament-bracke/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tournament-bracke/lib/supabase.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const TournamentContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const PROGRESSION_MAP = {
    G1: {
        upperWinner: "G9",
        upperLoser: "G5",
        lowerWinner: "G5"
    },
    G2: {
        upperWinner: "G9",
        upperLoser: "G5",
        lowerWinner: "G5"
    },
    G3: {
        upperWinner: "G10",
        upperLoser: "G6",
        lowerWinner: "G6"
    },
    G4: {
        upperWinner: "G10",
        upperLoser: "G6",
        lowerWinner: "G6"
    }
};
function TournamentProvider({ children }) {
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentDay, setCurrentDay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        teams: [],
        groups: [],
        bo3Matches: [],
        finalMatch: null,
        currentDay: 1
    });
    // --- BUSCAR DADOS DO BANCO ---
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            setLoading(true);
            // 1. Buscar Times
            const { data: teamsData } = await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("teams").select("*").order("name");
            // 2. Buscar Grupos e Times nos Grupos
            const { data: groupsData } = await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("groups").select(`
          *,
          group_teams (
            team_id, position, cashout, status,
            teams (name, logo_url)
          )
        `).order("id");
            // 3. Buscar Partidas Bo3
            const { data: bo3Data } = await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("bo3_matches").select("*");
            // 4. Buscar Final
            const { data: finalData } = await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("final_match").select(`*, final_teams(*)`).single();
            // --- TRANSFORMAÇÃO DE DADOS (SQL -> APP) ---
            const formattedTeams = (teamsData || []).map((t)=>({
                    id: t.id,
                    name: t.name,
                    logo: t.logo_url
                }));
            const formattedGroups = (groupsData || []).map((g)=>({
                    id: g.id,
                    name: g.name,
                    phase: g.phase,
                    day: g.day,
                    type: g.type,
                    locked: g.is_locked,
                    teams: (g.group_teams || []).map((gt)=>({
                            teamId: gt.team_id,
                            position: gt.position,
                            cashout: gt.cashout,
                            status: gt.status,
                            name: gt.teams?.name || "Unknown",
                            logo: gt.teams?.logo_url || null
                        }))
                }));
            const formattedBo3 = (bo3Data || []).map((b)=>({
                    id: b.id,
                    phase: b.phase,
                    day: b.day,
                    team1Id: b.team1_id,
                    team2Id: b.team2_id,
                    team1Wins: b.team1_wins,
                    team2Wins: b.team2_wins,
                    winnerId: b.winner_id,
                    completed: b.completed,
                    sourceGroupId: b.source_group,
                    matchType: b.match_order === 1 ? "upper" : "lower"
                }));
            let formattedFinal = null;
            if (finalData) {
                formattedFinal = {
                    id: finalData.id,
                    winnerId: finalData.winner_id,
                    completed: finalData.completed,
                    teams: (finalData.final_teams || []).map((ft)=>({
                            teamId: ft.team_id,
                            points: ft.points
                        }))
                };
            }
            setState((prev)=>({
                    ...prev,
                    teams: formattedTeams,
                    groups: formattedGroups,
                    bo3Matches: formattedBo3,
                    finalMatch: formattedFinal
                }));
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally{
            setLoading(false);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchData();
    }, [
        fetchData
    ]);
    // --- HELPERS ---
    const getTeamById = (id)=>{
        return state.teams.find((t)=>t.id === id);
    };
    // --- ACTIONS ---
    const addTeam = async (team)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("teams").insert({
            name: team.name,
            logo_url: team.logo
        });
        fetchData();
    };
    const deleteTeam = async (teamId)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("teams").delete().eq("id", teamId);
        fetchData();
    };
    // Função auxiliar interna para mover times (evita duplicação)
    const moveTeamToGroup = async (groupId, teamId)=>{
        // 1. Verifica se o time já está lá
        const { data: existing } = await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("group_teams").select("*").match({
            group_id: groupId,
            team_id: teamId
        }).single();
        if (existing) return; // Já foi movido, não faz nada
        // 2. Insere no novo grupo
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("group_teams").insert({
            group_id: groupId,
            team_id: teamId,
            position: 0,
            status: 'playing'
        });
        console.log(`Time ${teamId} movido para ${groupId}`);
    };
    const addTeamToGroup = async (groupId, teamId, position)=>{
        await moveTeamToGroup(groupId, teamId);
        fetchData();
    };
    const removeTeamFromGroup = async (groupId, teamId)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("group_teams").delete().match({
            group_id: groupId,
            team_id: teamId
        });
        fetchData();
    };
    const updateTeamCashout = async (groupId, teamId, cashout)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("group_teams").update({
            cashout
        }).match({
            group_id: groupId,
            team_id: teamId
        });
        // Atualização otimista
        const newGroups = state.groups.map((g)=>{
            if (g.id !== groupId) return g;
            return {
                ...g,
                teams: g.teams.map((t)=>t.teamId === teamId ? {
                        ...t,
                        cashout
                    } : t)
            };
        });
        setState((prev)=>({
                ...prev,
                groups: newGroups
            }));
    };
    const updateTeamStatus = async (groupId, teamId, status)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("group_teams").update({
            status
        }).match({
            group_id: groupId,
            team_id: teamId
        });
        fetchData();
    };
    const lockGroupAndCreateBo3 = async (groupId)=>{
        const group = state.groups.find((g)=>g.id === groupId);
        if (!group) return;
        const sortedTeams = [
            ...group.teams
        ].sort((a, b)=>b.cashout - a.cashout);
        if (sortedTeams.length < 4) {
            alert("Precisa de 4 times para fechar o grupo.");
            return;
        }
        const { error: lockError } = await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("groups").update({
            is_locked: true
        }).eq("id", groupId);
        if (lockError) return;
        // 1º vs 2º (Upper - Match Order 1)
        const match1 = {
            phase: group.phase,
            day: group.day,
            team1_id: sortedTeams[0].teamId,
            team2_id: sortedTeams[1].teamId,
            source_group: groupId,
            match_order: 1
        };
        // 3º vs 4º (Lower - Match Order 2)
        const match2 = {
            phase: group.phase,
            day: group.day,
            team1_id: sortedTeams[2].teamId,
            team2_id: sortedTeams[3].teamId,
            source_group: groupId,
            match_order: 2
        };
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("bo3_matches").insert([
            match1,
            match2
        ]);
        fetchData();
    };
    const updateGroup = async (groupId, data)=>{
        const updateData = {};
        if (data.locked !== undefined) updateData.is_locked = data.locked;
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("groups").update(updateData).eq("id", groupId);
        fetchData();
    };
    // --- ATUALIZAÇÃO DE BO3 COM A LÓGICA DE PROGRESSÃO ---
    const updateBo3Match = async (matchId, data)=>{
        const updateData = {};
        if (data.team1Wins !== undefined) updateData.team1_wins = data.team1Wins;
        if (data.team2Wins !== undefined) updateData.team2_wins = data.team2Wins;
        let currentMatch = state.bo3Matches.find((m)=>m.id === matchId);
        // Fallback DB lookup
        if (!currentMatch) {
            const { data: dbMatch } = await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('bo3_matches').select('*').eq('id', matchId).single();
            if (dbMatch) {
                currentMatch = {
                    id: dbMatch.id,
                    team1Id: dbMatch.team1_id,
                    team2Id: dbMatch.team2_id,
                    team1Wins: dbMatch.team1_wins,
                    team2Wins: dbMatch.team2_wins,
                    winnerId: dbMatch.winner_id,
                    completed: dbMatch.completed,
                    sourceGroupId: dbMatch.source_group,
                    matchType: dbMatch.match_order === 1 ? "upper" : "lower",
                    phase: dbMatch.phase,
                    day: dbMatch.day
                };
            }
        }
        let winnerId = null;
        let loserId = null;
        let isCompleted = false;
        if (currentMatch) {
            const t1Wins = data.team1Wins ?? currentMatch.team1Wins;
            const t2Wins = data.team2Wins ?? currentMatch.team2Wins;
            if (t1Wins === 2) {
                winnerId = currentMatch.team1Id;
                loserId = currentMatch.team2Id;
                updateData.winner_id = winnerId;
                updateData.completed = true;
                isCompleted = true;
            } else if (t2Wins === 2) {
                winnerId = currentMatch.team2Id;
                loserId = currentMatch.team1Id;
                updateData.winner_id = winnerId;
                updateData.completed = true;
                isCompleted = true;
            }
            // --- PROGRESSÃO AUTOMÁTICA ---
            if (isCompleted && winnerId && loserId && currentMatch.sourceGroupId) {
                const sourceG = currentMatch.sourceGroupId;
                const type = currentMatch.matchType // "upper" ou "lower"
                ;
                const targets = PROGRESSION_MAP[sourceG];
                if (targets) {
                    // REGRA: UPPER MATCH (1º vs 2º)
                    if (type === "upper") {
                        // VENCEDOR -> Vai para Domingo (G9 ou G10)
                        await moveTeamToGroup(targets.upperWinner, winnerId);
                        // PERDEDOR -> Tem segunda chance no Elimination (G5 ou G6)
                        await moveTeamToGroup(targets.upperLoser, loserId);
                    } else if (type === "lower") {
                        // VENCEDOR -> Vai para Elimination (G5 ou G6)
                        await moveTeamToGroup(targets.lowerWinner, winnerId);
                    // PERDEDOR -> Está eliminado (Não fazemos nada, ele não é movido pra lugar nenhum)
                    }
                }
            }
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("bo3_matches").update(updateData).eq("id", matchId);
        fetchData();
    };
    const initFinalMatch = async (teamIds)=>{
        const { data: final, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("final_match").insert({
            completed: false
        }).select().single();
        if (error || !final) return;
        const teamInserts = teamIds.map((tid)=>({
                final_id: final.id,
                team_id: tid,
                points: 0
            }));
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("final_teams").insert(teamInserts);
        fetchData();
    };
    const updateFinalPoints = async (teamId, points)=>{
        if (!state.finalMatch) return;
        await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("final_teams").update({
            points
        }).match({
            final_id: state.finalMatch.id,
            team_id: teamId
        });
        if (points >= 5) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("final_match").update({
                completed: true,
                winner_id: teamId
            }).eq("id", state.finalMatch.id);
        }
        fetchData();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TournamentContext.Provider, {
        value: {
            state: {
                ...state,
                currentDay
            },
            loading,
            refreshData: fetchData,
            setCurrentDay,
            getTeamById,
            addTeam,
            deleteTeam,
            addTeamToGroup,
            removeTeamFromGroup,
            updateTeamCashout,
            updateTeamStatus,
            lockGroupAndCreateBo3,
            updateGroup,
            updateBo3Match,
            initFinalMatch,
            updateFinalPoints
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/tournament-bracke/components/tournament-context.tsx",
        lineNumber: 398,
        columnNumber: 5
    }, this);
}
const useTournament = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tournament$2d$bracke$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(TournamentContext);
    if (context === undefined) {
        throw new Error("useTournament must be used within a TournamentProvider");
    }
    return context;
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d8b8b5fd._.js.map