import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-serif text-lg font-bold text-foreground">NexusAI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link href="/startup" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Startups</Link>
          <Link href="/investor" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Investors</Link>
          <Link href="/auth" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sign In</Link>
        </div>
        <p className="text-sm text-muted-foreground">
          {"© 2026 NexusAI. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
