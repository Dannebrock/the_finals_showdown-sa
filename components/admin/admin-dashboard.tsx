"use client"

import Link from "next/link"
import { useState } from "react"
import { logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Home, LogOut, Users, Grid3X3, Swords, Trophy } from "lucide-react"
import { TeamManagement } from "./team-management"
import { GroupManagement } from "./group-management"
import { Bo3Management } from "./bo3-management"
import { FinalManagement } from "./final-management"

interface AdminDashboardProps {
  onLogout: () => void
}

type Tab = "teams" | "groups" | "bo3" | "final"

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("teams")

  const handleLogout = () => {
    logout()
    onLogout()
  }

  const tabs = [
    { id: "teams" as Tab, label: "Times", icon: Users },
    { id: "groups" as Tab, label: "Grupos & Cashout", icon: Grid3X3 },
    { id: "bo3" as Tab, label: "Best of 3", icon: Swords },
    { id: "final" as Tab, label: "Final", icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="w-full bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex h-16 w-24 sm:h-12 sm:w-42 items-center justify-center rounded-lg mt-1">            
             <img src="../logo_tf_white.png" alt="" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-md text-red-600 text-sm font-medium items-center flex ml-3">
              <span className="font-bold">Admin</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
              asChild
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Ver Site
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
  <div className="container mx-auto px-4 py-2 sm:py-0"> {/* Adicionei padding vertical no mobile */}
    
    <nav className="grid grid-cols-2 gap-2 sm:flex sm:gap-1"> {/* AQUI: Grid de 2 colunas no mobile, Flex no PC */}
      
      {tabs.map((tab) => (
        <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center justify-center sm:justify-start gap-2 
                    px-3 py-3 sm:px-6 sm:py-4 
                    text-xs sm:text-sm font-medium rounded-lg sm:rounded-none transition-all
                    ${
                      activeTab === tab.id
                        ? "text-black bg-amber-500 sm:bg-transparent sm:text-amber-500 sm:border-b-2 sm:border-amber-500" // Mobile: Botão Sólido / PC: Borda embaixo
                        : "text-zinc-400 bg-zinc-800/50 sm:bg-transparent hover:text-white hover:bg-zinc-800"
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
              
            </nav>
          </div>
        </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "teams" && <TeamManagement />}
        {activeTab === "groups" && <GroupManagement />}
        {activeTab === "bo3" && <Bo3Management />}
        {activeTab === "final" && <FinalManagement />}
      </main>
    </div>
  )
}
