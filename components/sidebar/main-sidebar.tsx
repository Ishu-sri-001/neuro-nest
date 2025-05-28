"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAuth } from "firebase/auth"
import { getUserByUid } from "@/lib/firestore"
import type { UserData } from "@/lib/firestore"
import SignOut from "@/components/signout-button"
import { SettingsIcon, UserIcon, LogOutIcon, MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/s-sidebar"

export function MainSidebar() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
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

  const links = [
    {
      title: "Chat",
      href: "/chat",
      icon: MessageSquare,
      variant: pathname === "/chat" ? "default" : "ghost",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: SettingsIcon,
      variant: pathname === "/settings" ? "default" : "ghost",
    },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between w-full">
                <Link href="" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-purple-600 text-white">
                    <span className="text-sm font-bold">NN</span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-purple-700">Neuro Nest</span>
                  </div>
                </Link>
                <SidebarTrigger className="-ml-1" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.title}>
              <SidebarMenuButton asChild isActive={link.variant === "default"} tooltip={link.title}>
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {loading ? (
            <SidebarMenuItem>
              <div className="flex items-center gap-2 rounded-md p-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="space-y-1 group-data-[collapsible=icon]:hidden">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </SidebarMenuItem>
          ) : (
            <>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      {user.firstName?.[0] || <UserIcon className="h-4 w-4" />}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Sign Out">
                  <SignOut className="w-full justify-start bg-purple-700 hover:bg-purple-800">
                    <LogOutIcon />
                    <span>Sign Out</span>
                  </SignOut>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
