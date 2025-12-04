"use client"
import Link from "next/link"
import { Calendar, Users, Menu,Twitch } from "lucide-react"
import { useState } from "react"

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 py-3 md:py-4 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex h-16 w-28 sm:h-12 sm:w-42 items-center justify-center rounded-lg mt-1">            
             <img src="../logo_tf_white.png" alt="" />
          </div>

          <a
              href="https://www.twitch.tv/thefinalssa"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden w-30 h-10 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2"
            >
              <Twitch className="h-5 w-5" />
              Twitch
            </a>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-white font-medium">6-7 Dez 2025</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-4 py-2">
                <Users className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-white font-medium">16 Times</span>
              </div>
            </div>

            <a
              href="https://www.twitch.tv/thefinalssa"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2"
            >
              <Twitch className="h-5 w-5" />
              Acompanhe na Twitch!
            </a>

            <Link
              href="/admin"
              className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-zinc-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-zinc-800 space-y-3">
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1.5 text-xs">
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span className="text-white font-medium">6-7 Dez</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1.5 text-xs">
                <Users className="w-3 h-3 text-zinc-400" />
                <span className="text-white font-medium">16 Times</span>
              </div>
            </div>
            <div className="flex gap-2">
              {/* <a
                href="https://twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                </svg>
                Twitch
              </a> */}
              <Link
                href="/admin"
                className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-full font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
