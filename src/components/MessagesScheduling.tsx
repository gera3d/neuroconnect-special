import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChatCircle, PaperPlaneRight, CalendarCheck, Clock, CheckCircle, ArrowLeft } from "@phosphor-icons/react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Message {
  id: string
  from: "user" | "professional"
  professionalName?: string
  content: string
  timestamp: number
  read: boolean
}

interface Thread {
  id: string
  professionalName: string
  professionalCredentials: string
  lastMessage: string
  lastTimestamp: number
  unread: number
  messages: Message[]
}

const DEFAULT_THREADS: Thread[] = [
  {
    id: "1",
    professionalName: "Dr. Sarah Chen",
    professionalCredentials: "SLP-CCC",
    lastMessage: "I'd be happy to discuss your child's speech therapy needs. When would be a good time for an initial consultation?",
    lastTimestamp: Date.now() - 3600000,
    unread: 1,
    messages: [
      {
        id: "m1",
        from: "user",
        content: "Hello! I'm interested in speech therapy for my 5-year-old son who has some pronunciation difficulties.",
        timestamp: Date.now() - 7200000,
        read: true
      },
      {
        id: "m2",
        from: "professional",
        professionalName: "Dr. Sarah Chen",
        content: "I'd be happy to discuss your child's speech therapy needs. When would be a good time for an initial consultation?",
        timestamp: Date.now() - 3600000,
        read: false
      }
    ]
  }
]

interface MessagesSchedulingProps {
  onBack?: () => void
}

export function MessagesScheduling({ onBack }: MessagesSchedulingProps) {
  const [threads, setThreads] = useKV<Thread[]>("message-threads", DEFAULT_THREADS)
  const allThreads = threads || DEFAULT_THREADS
  
  const [selectedThread, setSelectedThread] = useState<string | null>(allThreads[0]?.id || null)
  const [newMessage, setNewMessage] = useState("")

  const currentThread = allThreads.find(t => t.id === selectedThread)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread) return

    setThreads((current) => {
      if (!current) return current!
      return current.map(thread =>
        thread.id === selectedThread
          ? {
              ...thread,
              lastMessage: newMessage,
              lastTimestamp: Date.now(),
              messages: [
                ...thread.messages,
                {
                  id: `m${Date.now()}`,
                  from: "user" as const,
                  content: newMessage,
                  timestamp: Date.now(),
                  read: true
                }
              ]
            }
          : thread
      )
    })

    setNewMessage("")
    toast.success("Message sent!")
  }

  const handleSchedule = () => {
    toast.success("Appointment request sent!", {
      description: `Request sent to ${currentThread?.professionalName}. They'll confirm your appointment within 24 hours.`
    })
  }

  const markAsRead = (threadId: string) => {
    setThreads((current) => {
      if (!current) return current!
      return current.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              unread: 0,
              messages: thread.messages.map(msg => ({ ...msg, read: true }))
            }
          : thread
      )
    })
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border/60 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {onBack && (
            <Button 
              onClick={onBack} 
              variant="ghost" 
              size="sm" 
              className="mb-4 -ml-2"
            >
              <ArrowLeft size={16} weight="bold" className="mr-2" />
              Back to Directory
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <ChatCircle size={28} weight="fill" className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Messages & Scheduling</h1>
              <p className="text-muted-foreground">Secure chat and appointment booking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-280px)]">
          <div className="flex flex-col bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/60">
              <h2 className="font-bold text-foreground">Conversations</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {allThreads.reduce((sum, t) => sum + t.unread, 0)} unread
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {allThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => {
                    setSelectedThread(thread.id)
                    markAsRead(thread.id)
                  }}
                  className={`w-full p-4 text-left border-b border-border/30 transition-colors ${
                    selectedThread === thread.id
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar className="flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                        {thread.professionalName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {thread.professionalName}
                        </p>
                        {thread.unread > 0 && (
                          <Badge className="ml-2 h-5 min-w-5 px-1.5 bg-primary text-white text-xs">
                            {thread.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{thread.professionalCredentials}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{thread.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
            {currentThread ? (
              <>
                <div className="p-4 border-b border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-foreground">{currentThread.professionalName}</h2>
                      <p className="text-xs text-muted-foreground">{currentThread.professionalCredentials}</p>
                    </div>
                    <Button onClick={handleSchedule} size="sm">
                      <CalendarCheck size={16} weight="bold" className="mr-2" />
                      Schedule Appointment
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentThread.messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] ${message.from === "user" ? "order-2" : "order-1"}`}>
                        {message.from === "professional" && (
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            {message.professionalName}
                          </p>
                        )}
                        <div
                          className={`p-3 rounded-lg ${
                            message.from === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <Clock size={12} className="opacity-70" />
                            <p className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit"
                              })}
                            </p>
                            {message.from === "user" && message.read && (
                              <CheckCircle size={12} weight="fill" className="opacity-70" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 border-t border-border/60">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <PaperPlaneRight size={18} weight="fill" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <ChatCircle size={64} weight="duotone" className="text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-bold text-foreground mb-2">No conversation selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
