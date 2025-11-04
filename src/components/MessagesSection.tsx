import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  ChatCircle,
  PaperPlaneRight,
  MagnifyingGlass,
  CheckCircle,
  DotsThree,
  Clock,
  Star,
} from "@phosphor-icons/react"
import { mockProfessionals } from "@/lib/mockData"
import { format } from "date-fns"

interface Message {
  id: string
  text: string
  timestamp: number
  fromUser: boolean
}

interface Conversation {
  id: string
  professionalId: string
  professionalName: string
  lastMessage: string
  lastMessageTime: number
  messages: Message[]
  unread: number
}

export function MessagesSection() {
  const [conversations, setConversations] = useKV<Conversation[]>("conversations", [
    {
      id: "conv-1",
      professionalId: "prof-1",
      professionalName: "Dr. Sarah Mitchell",
      lastMessage: "I'd be happy to schedule a consultation with you.",
      lastMessageTime: Date.now() - 3600000,
      unread: 2,
      messages: [
        {
          id: "msg-1",
          text: "Hello! I saw your profile and I'm interested in learning more about your speech therapy services for my child.",
          timestamp: Date.now() - 7200000,
          fromUser: true,
        },
        {
          id: "msg-2",
          text: "Hi! Thank you for reaching out. I'd love to help. Can you tell me a bit more about your child's specific needs?",
          timestamp: Date.now() - 5400000,
          fromUser: false,
        },
        {
          id: "msg-3",
          text: "My son is 5 years old and has been experiencing some delays in speech development. We're looking for someone who specializes in early childhood.",
          timestamp: Date.now() - 4800000,
          fromUser: true,
        },
        {
          id: "msg-4",
          text: "I'd be happy to schedule a consultation with you.",
          timestamp: Date.now() - 3600000,
          fromUser: false,
        },
      ],
    },
    {
      id: "conv-2",
      professionalId: "prof-2",
      professionalName: "Michael Rodriguez",
      lastMessage: "Looking forward to our session next week!",
      lastMessageTime: Date.now() - 86400000,
      unread: 0,
      messages: [
        {
          id: "msg-5",
          text: "Thank you for the great session yesterday!",
          timestamp: Date.now() - 172800000,
          fromUser: true,
        },
        {
          id: "msg-6",
          text: "Looking forward to our session next week!",
          timestamp: Date.now() - 86400000,
          fromUser: false,
        },
      ],
    },
  ])

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations && conversations.length > 0 ? conversations[0] : null
  )
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !conversations) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage.trim(),
      timestamp: Date.now(),
      fromUser: true,
    }

    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversation.id
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: message.text,
            lastMessageTime: message.timestamp,
          }
        : conv
    )

    setConversations(updatedConversations)
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: message.text,
      lastMessageTime: message.timestamp,
    })
    setNewMessage("")

    setTimeout(() => {
      const autoReply: Message = {
        id: `msg-${Date.now()}-reply`,
        text: "Thank you for your message. I'll get back to you as soon as possible!",
        timestamp: Date.now(),
        fromUser: false,
      }

      const furtherUpdated = updatedConversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message, autoReply],
              lastMessage: autoReply.text,
              lastMessageTime: autoReply.timestamp,
            }
          : conv
      )

      setConversations(furtherUpdated)
      if (selectedConversation) {
        setSelectedConversation({
          ...selectedConversation,
          messages: [...selectedConversation.messages, message, autoReply],
          lastMessage: autoReply.text,
          lastMessageTime: autoReply.timestamp,
        })
      }
    }, 2000)

    toast.success("Message sent")
  }

  const filteredConversations =
    conversations?.filter((conv) =>
      conv.professionalName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground">
            Communicate directly with professionals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 h-[calc(100vh-280px)] min-h-[600px]">
          <Card className="p-0 border-border/60 flex flex-col">
            <div className="p-4 border-b border-border/60">
              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  weight="bold"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <ChatCircle size={48} weight="thin" className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start a conversation with a professional
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`
                        w-full p-3 rounded-lg text-left transition-all
                        ${
                          selectedConversation?.id === conv.id
                            ? "bg-primary/10 border-primary/30"
                            : "hover:bg-muted/50"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className="bg-primary/20 text-primary font-bold">
                            {conv.professionalName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {conv.professionalName}
                            </h3>
                            {conv.unread > 0 && (
                              <Badge className="bg-primary text-white border-0 h-5 px-1.5 text-[10px]">
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {format(conv.lastMessageTime, "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          <Card className="p-0 border-border/60 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {selectedConversation.professionalName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-bold text-foreground">
                        {selectedConversation.professionalName}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-success">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span>Online</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <DotsThree size={20} weight="bold" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                        className={`flex ${msg.fromUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`
                            max-w-[75%] rounded-lg p-3
                            ${
                              msg.fromUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }
                          `}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p
                            className={`text-[10px] mt-2 flex items-center gap-1 ${
                              msg.fromUser ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            <Clock size={10} weight="bold" />
                            {format(msg.timestamp, "h:mm a")}
                            {msg.fromUser && (
                              <CheckCircle size={10} weight="fill" className="ml-1" />
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border/60">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Type your message..."
                      rows={2}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      size="sm"
                      className="self-end"
                    >
                      <PaperPlaneRight size={18} weight="bold" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <ChatCircle size={64} weight="thin" className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card className="mt-4 p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Star size={20} weight="fill" className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-foreground mb-1">
                Communication Guidelines
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Keep conversations professional and focused on your child's care. Response times may vary depending on the professional's availability.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
