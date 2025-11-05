'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-white/80 blur-backdrop"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ImageGen
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-purple-600 relative ${
                pathname === '/' ? 'text-purple-600' : 'text-muted-foreground'
              }`}
            >
              Home
              {pathname === '/' && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                />
              )}
            </Link>
            <Link
              href="/gallery"
              className={`text-sm font-medium transition-colors hover:text-purple-600 relative ${
                pathname === '/gallery' ? 'text-purple-600' : 'text-muted-foreground'
              }`}
            >
              Gallery
              {pathname === '/gallery' && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                />
              )}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              asChild
              className="gradient-primary hover:opacity-90 text-white shadow-lg shadow-purple-500/30"
            >
              <Link href="/#generate">Generate</Link>
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/40 py-4 space-y-3 overflow-hidden"
            >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              Home
            </Link>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/gallery' 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              Gallery
            </Link>
            <div className="px-4 pt-2">
              <Button
                asChild
                className="w-full gradient-primary hover:opacity-90 text-white shadow-lg shadow-purple-500/30"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/#generate">Generate</Link>
              </Button>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

