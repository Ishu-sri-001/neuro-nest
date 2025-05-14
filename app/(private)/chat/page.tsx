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
import { Send, Loader2, AlertCircle, LogIn, StopCircle, RotateCcw, User, Bot } from "lucide-react"

// Storage key for guest users
const GUEST_MESSAGE_LIMIT = 2
const STORAGE_KEY = "neuronest_guest_message_count"

export default function Chat() {
  // User state
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<number | null>(null)

  // Guest user tracking
  const [guestMessageCount, setGuestMessageCount] = useState(0)
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
    // Remove the streamProtocol option or set it to the default
    // streamProtocol: "text",
  })

  const auth = getAuth()

  // Load user data and guest message count
  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window !== "undefined") {
        // Check if user is authenticated
        if (auth.currentUser) {
          const userData = await getUserByUid(auth.currentUser.uid)
          setUser(userData)
          const userCredits = userData?.credits || 0
          setCredits(userCredits)

          // Only set limit reached if authenticated user has no credits
          setIsLimitReached(userCredits <= 0)
        } else {
          // For guest users, check local storage
          const storedCount = localStorage.getItem(STORAGE_KEY)
          const count = storedCount ? Number.parseInt(storedCount, 10) : 0
          setGuestMessageCount(count)
          setIsLimitReached(count >= GUEST_MESSAGE_LIMIT)
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

  // Custom submit handler to track message count and deduct credits
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (input.trim() === "") return

    // Handle guest users
    if (!auth.currentUser) {
      if (isLimitReached) {
        return
      }

      // Increment the message count for unauthenticated users
      const newCount = guestMessageCount + 1
      setGuestMessageCount(newCount)

      // Store the updated count in localStorage
      localStorage.setItem(STORAGE_KEY, newCount.toString())

      // Check if limit is now reached
      if (newCount >= GUEST_MESSAGE_LIMIT) {
        setIsLimitReached(true)
      }
    }
    // Handle authenticated users with credits
    else if (user && credits !== null) {
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

  // Redirect to login page
  const redirectToLogin = () => {
    window.location.href = "/auth/signin"
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  // Add this function to your component
  const parseRawResponse = (content: string) => {
    // Remove the raw format markers and metadata
    return content
      .replace(/\d+:"([^"]+)"\s*/g, "$1") // Remove the 0:"text" format
      .replace(/e:\{.*\}\s*d:\{.*\}/g, "") // Remove the metadata
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-semibold">Chat with NeuroNest</h2>
        {!loading && user && (
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Credits: <span className="font-medium">{credits}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 && !isLimitReached ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-muted-foreground">
            <Bot className="h-12 w-12 mb-2 opacity-50" />
            <h3 className="text-lg font-medium">How can I help you today?</h3>
            <p className="text-sm max-w-md">
              Ask me anything about NeuroNest or AI in general. I'm here to assist you.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn("flex items-start gap-3", message.role === "user" ? "justify-start" : "justify-start")}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border",
                    message.role === "user" ? "bg-background" : "bg-primary/10 border-primary/20",
                  )}
                >
                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn("flex-1 space-y-2 overflow-hidden")}>
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
                            className="bg-muted p-2 rounded-md overflow-x-auto"
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
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => stop()}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <StopCircle className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex flex-col gap-2">
                  {error.message || "An error occurred connecting to the AI service"}
                  <Button variant="outline" size="sm" className="w-fit" onClick={() => reload()}>
                    <RotateCcw className="h-3 w-3 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {isLimitReached && (
              <Alert className="bg-amber-50 border-amber-200 mt-4">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <AlertDescription className="flex flex-col gap-2">
                  {auth.currentUser ? (
                    <>
                      <p className="font-medium text-amber-800">You've used all your credits</p>
                      <p className="text-sm text-amber-700">
                        Please upgrade your plan or purchase more credits to continue chatting
                      </p>
                      <Button className="w-fit mt-1" onClick={() => (window.location.href = "/settings/billing")}>
                        Purchase Credits
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-amber-800">You've reached the guest message limit</p>
                      <p className="text-sm text-amber-700">Please log in to continue chatting with NeuroNest</p>
                      <Button onClick={redirectToLogin} className="w-fit mt-1 gap-2">
                        <LogIn className="size-4" />
                        Login to continue
                      </Button>
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {!isLimitReached && !auth.currentUser && guestMessageCount > 0 && (
              <div className="text-xs text-muted-foreground text-center mt-4">
                {GUEST_MESSAGE_LIMIT - guestMessageCount} free{" "}
                {GUEST_MESSAGE_LIMIT - guestMessageCount === 1 ? "message" : "messages"} remaining
              </div>
            )}

            <div ref={scrollRef}></div>
          </div>
        )}
      </ScrollArea>

      {/* Chat input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="min-h-[60px] max-h-[200px] pr-12 resize-none"
              disabled={isLoading || isLimitReached}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 bottom-2"
              disabled={isLoading || isLimitReached || input.trim() === ""}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>

        {auth.currentUser && credits !== null && (
          <div className="text-xs text-muted-foreground mt-2">
            {credits > 0 ? (
              <>
                You have <span className="font-medium">{credits}</span> credit{credits !== 1 ? "s" : ""} remaining
              </>
            ) : (
              <>You have no credits remaining</>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center mt-2">
          Messages are processed using AI and may not always be accurate
        </div>
      </div>
    </div>
  )
}
