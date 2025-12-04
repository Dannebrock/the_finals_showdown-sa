"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Users, ExternalLink, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  showAdminLink?: boolean
}

export function Header({ showAdminLink = true }: HeaderProps) {
  return (
    <header className="w-full bg-[#1a1a1a] border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image src="/tournament-diamond-logo.jpg" alt="The Finals SA Showdown" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight">THE FINALS SA</span>
            <span className="font-bold text-lg text-white tracking-tight">SHOWDOWN.</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-white">6-7 Dez 2025</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800">
            <Users className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-white">16 Times</span>
          </div>

          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full" asChild>
            <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Acompanhe na Twitch!</span>
              <span className="sm:hidden">Twitch</span>
            </a>
          </Button>

          {showAdminLink && (
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-full bg-transparent"
              asChild
            >
              <Link href="/admin">
                <KeyRound className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Acesso Admin</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
