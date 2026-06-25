"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Loader2, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiUrl } from "@/lib/api"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "Explain KVL with an example",
  "How does a full wave rectifier work?",
  "What is Thévenin's theorem?",
  "Explain op-amp inverting amplifier",
  "How does staircase wiring work?",
]

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isUser = message.role === "user"
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-blue-600" : "bg-neutral-800 ring-1 ring-neutral-700"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-blue-400" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-blue-600 text-white"
            : "rounded-tl-sm border border-neutral-800 bg-neutral-900 text-neutral-200"
        )}
      >
        {/* Render markdown-like formatting */}
        <FormattedContent content={message.content} />
      </div>
    </motion.div>
  )
}

function FormattedContent({ content }: { content: string }) {
  // Simple markdown rendering: bold, code, line breaks
  const lines = content.split("\n")
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
          return <p key={i} className="font-semibold text-white">{line.slice(2, -2)}</p>
        }
        if (line.startsWith("- ")) {
          return (
            <p key={i} className="flex gap-1.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
              <span dangerouslySetInnerHTML={{ __html: renderInline(line.slice(2)) }} />
            </p>
          )
        }
        if (line.startsWith("> ")) {
          return (
            <p key={i} className="border-l-2 border-blue-500/50 pl-3 text-neutral-400 italic text-xs">
              {line.slice(2)}
            </p>
          )
        }
        if (line.startsWith("#")) {
          const level = line.match(/^#+/)?.[0].length ?? 1
          return (
            <p key={i} className={cn("font-bold", level === 1 ? "text-lg text-white" : "text-base text-neutral-100")}>
              {line.replace(/^#+\s*/, "")}
            </p>
          )
        }
        if (line.trim() === "") return <div key={i} className="h-1" />
        return <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
      })}
    </div>
  )
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-neutral-300 italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-neutral-800 px-1 py-0.5 text-xs font-mono text-blue-300">$1</code>')
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex gap-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 ring-1 ring-neutral-700">
        <Bot className="h-4 w-4 text-blue-400" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-neutral-800 bg-neutral-900 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-blue-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export function AnimatedAIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => { scrollToBottom() }, [messages, isLoading])

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || isLoading) return

    const userMessage: Message = { role: "user", content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    if (textareaRef.current) textareaRef.current.style.height = "44px"

    try {
      const res = await fetch(apiUrl("/api/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      const reply: string = data.reply ?? "I couldn't generate a response. Please try again."
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    } catch (err) {
      console.error("AI chat error:", err)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please check your connection and try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = "44px"
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  return (
    <div className="flex h-full w-full flex-col bg-transparent">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pt-20 md:px-8">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 py-12 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 ring-1 ring-blue-500/20">
                <Bot className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">EEE Study Assistant</h2>
                <p className="mt-1.5 text-sm text-neutral-500">
                  Ask me anything about your 26EEE1001T experiments, circuits, and theory
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void sendMessage(s)}
                    className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-blue-500/40 hover:text-blue-300"
                  >
                    <BookOpen className="h-3 w-3" />
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} index={i} />
          ))}

          <AnimatePresence>
            {isLoading && <TypingIndicator />}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-neutral-800/60 bg-[#050508]/90 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 shadow-lg focus-within:border-blue-500/50 transition">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask about KVL, rectifiers, op-amps, wiring…"
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-neutral-600 disabled:opacity-50"
              style={{ height: "44px", maxHeight: "160px", overflowY: "auto" }}
            />
            <button
              onClick={() => void sendMessage()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition",
                input.trim() && !isLoading
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-neutral-700">
            Shift+Enter for new line · Enter to send
          </p>
        </div>
      </div>
    </div>
  )
}
