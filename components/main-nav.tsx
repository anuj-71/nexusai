'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface MainNavProps {
  isStartup: boolean
  userName?: string
}

export function MainNav({ isStartup, userName }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navItems = isStartup
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/discovery', label: 'Discover' },
        { href: '/matches', label: 'Matches' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/messages', label: 'Messages' },
        { href: '/profile/startup', label: 'Profile' },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/discovery', label: 'Discover' },
        { href: '/matches', label: 'Matches' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/messages', label: 'Messages' },
        { href: '/profile/investor', label: 'Profile' },
      ]

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-background border-b border-border" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-bold text-foreground">
            NexusAI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? `${isStartup ? 'text-accent' : 'text-primary'}`
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{userName || 'User'}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
                aria-label="Logout"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="md:hidden mt-4 space-y-3 border-t border-border pt-4"
            id="mobile-menu"
            role="menu"
          >
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? `${isStartup ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                role="menuitem"
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2"
              role="menuitem"
              aria-label="Logout"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
