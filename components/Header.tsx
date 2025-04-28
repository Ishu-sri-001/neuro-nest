"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Brain, Menu } from "lucide-react"

const Header = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Contact Us", href: "#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Nav Links */}
        <div className="flex items-center gap-8 ml-8">
          <Link className="flex items-center space-x-2" href="/">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">NeuroNest</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-10">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                className={
                  pathname === item.href 
                    ? "text-primary font-semibold px-2 py-1 rounded-md transition-colors" 
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/50 px-2 py-1 rounded-md transition-colors"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sign In Button */}
        <div className="flex items-center">
          <Button variant="default" className="hidden md:flex" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          
          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>NeuroNest</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-foreground/70 hover:text-foreground hover:bg-accent/50 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t">
                  <Button className="w-full" asChild>
                    <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header