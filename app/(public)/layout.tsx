import type React from "react"
import Header from "@/components/header"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="mx-auto h-screen">
      <Header />
      {children}
    </div>
  )
}
