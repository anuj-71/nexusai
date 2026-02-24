"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">NexusAI</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/startup" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Startups
          </Link>
          <Link href="/investor" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Investors
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Sign in
            </Button>
          </Link>
          <Link href="/auth">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
