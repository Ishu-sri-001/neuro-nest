"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { X, MessageCircle, Send, Loader2, ArrowDownCircle, AlertCircle } from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "ai/react"

import LandingSections from "@/components/landing-section"

// Simple function to log to both console and UI
const debugLog = (message: string, data?: any) => {
  const logMessage = data ? `${message}: ${JSON.stringify(data, null, 2)}` : message
  console.log(logMessage)
  return logMessage
}

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showChatIcon, setShowChatIcon] = useState(false)
  // const [debugMessages, setDebugMessages] = useState<string[]>([])
  const chatIconRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Use a direct fetch approach as a fallback
  const [directMessage, setDirectMessage] = useState("")
  const [directResponse, setDirectResponse] = useState("")
  const [directLoading, setDirectLoading] = useState(false)
  const [directError, setDirectError] = useState("")

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error } = useChat({
    api: "/api/gemini",
    streamProtocol: "text", // Important: Tell useChat to expect plain text
  })

  // Direct API test function
  const testDirectApi = async () => {
    setDirectLoading(true)
    setDirectError("")
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: directMessage || "Hello, how are you?" }],
        }),
      })

      const data = await response.text()
      setDirectResponse(data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setDirectError(errorMsg)
    } finally {
      setDirectLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true)
      } else {
        setShowChatIcon(false)
        setIsChatOpen(false)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LandingSections />
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button ref={chatIconRef} onClick={toggleChat} size="icon" className="rounded-full size-14 p-2 shadow-lg">
              {!isChatOpen ? <MessageCircle className="size-12" /> : <ArrowDownCircle className="size-12" />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-[95%] md:w-[500px]"
          >
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold">Chat with NeuroNest</CardTitle>
                <Button onClick={toggleChat} size="sm" variant="ghost" className="px-2 py-0">
                  <X className="size-5" />
                  <span className="sr-only">Close Chat</span>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {messages?.length === 0 && (
                    <div className="w-full mt-32 text-gray-500 flex items-center justify-center gap-3">
                      No messages yet
                    </div>
                  )}

                  {messages?.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block p-2 rounded-lg ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              return inline ? (
                                <code className="bg-gray-200 px-1 rounded" {...props}>
                                  {children}
                                </code>
                              ) : (
                                <pre
                                  className="bg-gray-200 p-2 rounded"
                                  {...(props as React.HTMLAttributes<HTMLPreElement>)}
                                >
                                  <code>{children}</code>
                                </pre>
                              )
                            },
                            ul(props) {
                              return <ul className="list-disc ml-4" {...props} />
                            },
                            ol(props) {
                              return <ol className="list-decimal ml-4" {...props} />
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="w-full items-center flex justify-center gap-3">
                      <Loader2 className="animate-spin h-5 w-5 text-primary" />
                      <Button className="underline" type="button" onClick={() => stop()}>
                        Abort
                      </Button>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {error.message || "An error occurred connecting to the AI service"}
                        <Button variant="outline" className="mt-2 w-full" type="button" onClick={() => reload()}>
                          Retry
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div ref={scrollRef}></div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1"
                    placeholder="Type your message here..."
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="size-4" />
                  </Button>
                </form>

                {/* Direct API Test section (commented out)
                <div className="w-full border-t pt-4">
                  <p className="text-sm font-medium mb-2">Direct API Test</p>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={directMessage}
                      onChange={(e) => setDirectMessage(e.target.value)}
                      placeholder="Test message"
                      className="flex-1"
                    />
                    <Button onClick={testDirectApi} disabled={directLoading} size="sm">
                      {directLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
                    </Button>
                  </div>
                  {directError && <div className="text-red-500 text-xs mt-1">{directError}</div>}
                  {directResponse && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-[100px]">
                      {directResponse}
                    </div>
                  )}
                </div>
                */}
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
