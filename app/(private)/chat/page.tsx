"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getAuth } from "firebase/auth"
import { getUserByUid, updateUserCredits } from "@/lib/firestore"
import type { UserData } from "@/lib/firestore"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Loader2, AlertCircle, StopCircle, RotateCcw, User, Bot, Sparkles } from "lucide-react"

export default function Chat() {
  // User state
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<number | null>(null)
  const [isLimitReached, setIsLimitReached] = useState(false)

  // UI refs
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Chat state
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    stop,
    reload,
    error,
  } = useChat({
    api: "/api/openai",
  })

  const auth = getAuth()

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window !== "undefined") {
        // Check if user is authenticated
        if (auth.currentUser) {
          const userData = await getUserByUid(auth.currentUser.uid)
          setUser(userData)
          const userCredits = userData?.credits || 0
          setCredits(userCredits)

          // Set limit reached if authenticated user has no credits
          setIsLimitReached(userCredits <= 0)
        }

        setLoading(false)
      }
    }

    fetchUserData()
  }, [auth.currentUser])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Custom submit handler to deduct credits
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (input.trim() === "") return

    // Handle authenticated users with credits
    if (user && credits !== null) {
      if (credits <= 0) {
        // No credits left
        setIsLimitReached(true)
        return
      }

      // Deduct 1 credit
      const newCredits = credits - 1
      setCredits(newCredits)

      // If this was the last credit, set limit reached
      if (newCredits <= 0) {
        setIsLimitReached(true)
      }

      // Update credits in database
      await updateUserCredits(user.uid, newCredits)
    }

    // Call the original submit handler
    originalHandleSubmit(e)
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) form.requestSubmit()
    }
  }
  const parseRawResponse = (content: string) => {
    // Remove the raw format markers and metadata
    return content
      .replace(/\d+:"([^"]+)"\s*/g, "$1") // Remove the 0:"text" format
      .replace(/e:\{.*\}\s*d:\{.*\}/g, "") // Remove the metadata
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-background rounded-lg shadow-sm border border-purple-500">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-t-lg border border-purple-500">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
            Chat with NeuroNest
          </h2>
        </div>
        {!loading && user && (
          <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/50 px-3 py-1.5 rounded-full shadow-sm">
            <div className="text-sm font-medium">
              Credits: <span className="text-purple-600 dark:text-purple-400">{credits}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 && !isLimitReached ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 p-6">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
              <Bot className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-medium">How can I help you today?</h3>
            <p className="text-sm max-w-md text-muted-foreground">
              Ask me anything about NeuroNest or AI in general. I'm here to assist you.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg transition-colors",
                  message.role === "user" ? "bg-blue-50 dark:bg-blue-900/10" : "bg-purple-50 dark:bg-purple-900/10",
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full",
                    message.role === "user"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                  )}
                >
                  {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={cn("flex-1 space-y-2 overflow-hidden")}>
                  <div className="text-sm font-medium mb-1">{message.role === "user" ? "You" : "NeuroNest AI"}</div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm dark:prose-invert max-w-none"
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        return inline ? (
                          <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre
                            className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto my-3"
                            {...(props as React.HTMLAttributes<HTMLPreElement>)}
                          >
                            <code className="text-sm">{children}</code>
                          </pre>
                        )
                      },
                      ul(props) {
                        return <ul className="list-disc pl-6 my-2" {...props} />
                      },
                      ol(props) {
                        return <ol className="list-decimal pl-6 my-2" {...props} />
                      },
                      p(props) {
                        return <p className="mb-2 last:mb-0" {...props} />
                      },
                    }}
                  >
                    {parseRawResponse(message.content)}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium">Thinking...</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => stop()}
                    className="h-8 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  >
                    <StopCircle className="h-3.5 w-3.5 mr-1" />
                    Stop
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert
                variant="destructive"
                className="mt-4 border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800"
              >
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="flex flex-col gap-2">
                  {error.message || "An error occurred connecting to the AI service"}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit mt-1 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => reload()}
                  >
                    <RotateCcw className="h-3 w-3 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {isLimitReached && (
              <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800 mt-4 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <AlertDescription className="flex flex-col gap-2">
                  <p className="font-medium text-amber-800 dark:text-amber-300">You've used all your credits</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Please upgrade your plan or purchase more credits to continue chatting
                  </p>
                  <Button
                    className="w-fit mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    onClick={() => (window.location.href = "/settings/billing")}
                  >
                    Purchase Credits
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div ref={scrollRef}></div>
          </div>
        )}
      </ScrollArea>

      {/* Chat input */}
      <div className=" p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-b-lg border border-purple-500">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="min-h-[60px] max-h-[200px] pr-12 resize-none rounded-xl border-purple-400 dark:border-gray-700  "
              disabled={isLoading || isLimitReached}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className={cn(
                "absolute right-2 bottom-2 rounded-full h-8 w-8 transition-all",
                input.trim() === ""
                  ? "bg-gray-300 dark:bg-gray-700"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
              )}
              disabled={isLoading || isLimitReached || input.trim() === ""}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>

        <div className="flex justify-between items-center mt-3">
          {auth.currentUser && credits !== null && (
            <div className="text-xs text-muted-foreground">
              {credits > 0 ? (
                <>
                  You have <span className="font-medium text-purple-600 dark:text-purple-400">{credits}</span> credit
                  {credits !== 1 ? "s" : ""} remaining
                </>
              ) : (
                <>You have no credits remaining</>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-right">
            Messages are processed using AI and may not always be accurate
          </div>
        </div>
      </div>
    </div>
  )
}
