"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAuth } from "firebase/auth"
import { getUserByUid } from "@/lib/firestore"
import { UserData } from "@/lib/firestore"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SignOut from "@/components/signout-button"
import { 
  HomeIcon, 
  SettingsIcon, 
  UserIcon, 
  LogOutIcon, 
  BellIcon,
  BarChartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Menu
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"

export function MainSidebar() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const auth = getAuth()
  const pathname = usePathname()

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userData = await getUserByUid(auth.currentUser.uid)
        setUser(userData)
      }
      setLoading(false)
    }

    fetchUserData()
  }, [auth.currentUser])

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "group relative flex h-full flex-col border-r bg-background p-2 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between px-2">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold">Neuro Nest</span>
            </Link>
          )}
          {isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-md">
                  <Menu className="h-6 w-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Neuro Nest</TooltipContent>
            </Tooltip>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-9 w-9"
          >
            {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-2 py-4">
          <Nav isCollapsed={isCollapsed} links={[
            {
              title: "Dashboard",
              href: "/dashboard",
              icon: <HomeIcon className="h-4 w-4" />,
              variant: pathname === "/dashboard" ? "default" : "ghost",
            },
            {
              title: "Analytics",
              href: "/analytics",
              icon: <BarChartIcon className="h-4 w-4" />,
              variant: pathname === "/analytics" ? "default" : "ghost",
            },
            {
              title: "Notifications",
              href: "/notifications",
              icon: <BellIcon className="h-4 w-4" />,
              variant: pathname === "/notifications" ? "default" : "ghost",
            },
            {
              title: "Settings",
              href: "/settings",
              icon: <SettingsIcon className="h-4 w-4" />,
              variant: pathname === "/settings" ? "default" : "ghost",
            },
          ]} />
        </div>

        <div className="mt-auto">
          {loading ? (
            <div className={cn(
              "flex items-center gap-2 rounded-md p-2",
              isCollapsed ? "justify-center" : ""
            )}>
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              {!isCollapsed && (
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {user && (
                <div className={cn(
                  "flex items-center gap-2 rounded-md p-2",
                  isCollapsed ? "justify-center" : ""
                )}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    {user.firstName?.[0] || <UserIcon className="h-4 w-4" />}
                  </div>
                  {!isCollapsed && (
                    <div className="truncate">
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="w-full max-w-[160px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  )}
                  {isCollapsed && user.firstName && (
                    <Tooltip>
                      <TooltipTrigger className="cursor-default" />
                      <TooltipContent side="right">
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  {isCollapsed ? (
                    <SignOut 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 mx-auto"
                    >
                      <LogOutIcon className="h-4 w-4" />
                    </SignOut>
                  ) : (
                    <SignOut 
                      // variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Sign Out
                    </SignOut>
                  )}
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Sign out</TooltipContent>}
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    href: string
    icon: React.ReactNode
    variant: "default" | "ghost"
  }[]
}

function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-1 py-2 data-[collapsed=true]:py-2"
    >
      {links.map((link, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Link
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                link.variant === "default" ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                isCollapsed ? "justify-center px-2" : ""
              )}
            >
              {link.icon}
              {!isCollapsed && <span>{link.title}</span>}
            </Link>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">{link.title}</TooltipContent>}
        </Tooltip>
      ))}
    </div>
  )
}