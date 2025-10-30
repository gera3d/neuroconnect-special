import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, ChatCircle, ThumbsUp, Clock, PlusCircle, ArrowLeft } from "@phosphor-icons/react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Post {
  id: string
  author: string
  authorInitials: string
  title: string
  preview: string
  category: string
  replies: number
  likes: number
  timestamp: number
  isNew: boolean
}

const FORUM_POSTS: Post[] = [
  {
    id: "1",
    author: "Sarah M.",
    authorInitials: "SM",
    title: "Tips for successful bedtime routine with sensory needs?",
    preview: "My 6-year-old has been struggling with bedtime for months. Looking for advice on creating a calming routine that works for sensory-sensitive kids...",
    category: "Sleep & Routines",
    replies: 24,
    likes: 18,
    timestamp: Date.now() - 3600000,
    isNew: true
  },
  {
    id: "2",
    author: "Michael R.",
    authorInitials: "MR",
    title: "Celebrating a major milestone - first full sentence!",
    preview: "After 3 years of speech therapy, my son said his first complete sentence yesterday. Want to share this joy with people who understand how huge this is...",
    category: "Celebrations",
    replies: 47,
    likes: 156,
    timestamp: Date.now() - 7200000,
    isNew: true
  },
  {
    id: "3",
    author: "Jennifer K.",
    authorInitials: "JK",
    title: "School accommodation advice for ADHD",
    preview: "Preparing for my daughter's first IEP meeting next month. What accommodations have worked well for your kids with ADHD?",
    category: "Education & IEP",
    replies: 31,
    likes: 22,
    timestamp: Date.now() - 14400000,
    isNew: false
  },
  {
    id: "4",
    author: "David L.",
    authorInitials: "DL",
    title: "Finding community activities that are inclusive",
    preview: "Looking for recommendations on sports, clubs, or activities in the Bay Area that are welcoming to neurodiverse kids...",
    category: "Activities & Community",
    replies: 15,
    likes: 12,
    timestamp: Date.now() - 21600000,
    isNew: false
  },
  {
    id: "5",
    author: "Lisa T.",
    authorInitials: "LT",
    title: "Managing meltdowns in public spaces",
    preview: "Had a difficult experience at the grocery store today. How do you all handle public meltdowns while dealing with judgment from others?",
    category: "Behavior & Support",
    replies: 38,
    likes: 45,
    timestamp: Date.now() - 28800000,
    isNew: false
  },
  {
    id: "6",
    author: "Amanda W.",
    authorInitials: "AW",
    title: "Picky eating - when to be concerned?",
    preview: "My 4-year-old eats maybe 5-6 foods total. Pediatrician says not to worry but I'm stressed. Anyone else been through this?",
    category: "Nutrition & Health",
    replies: 52,
    likes: 34,
    timestamp: Date.now() - 43200000,
    isNew: false
  }
]

interface CommunityForumProps {
  onBack?: () => void
}

export function CommunityForum({ onBack }: CommunityForumProps) {
  const [posts] = useState<Post[]>(FORUM_POSTS)
  const [filter, setFilter] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(posts.map(p => p.category)))]
  
  const filteredPosts = filter === "all" 
    ? posts 
    : posts.filter(p => p.category === filter)

  const handleNewPost = () => {
    toast.success("Feature coming soon!", {
      description: "Post creation will be available in the next update."
    })
  }

  const handleReply = (postId: string) => {
    toast.success("Opening thread...", {
      description: "Full forum functionality coming soon!"
    })
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border/60 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Users size={28} weight="fill" className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Community Forum</h1>
                <p className="text-muted-foreground">Connect with other families and share experiences</p>
              </div>
            </div>
            <Button onClick={handleNewPost} size="lg" className="hidden sm:flex">
              <PlusCircle size={18} weight="bold" className="mr-2" />
              New Post
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 mt-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setFilter(category)}
              variant={filter === category ? "default" : "outline"}
              size="sm"
            >
              {category === "all" ? "All Topics" : category}
            </Button>
          ))}
        </div>

        <Button onClick={handleNewPost} size="lg" className="w-full sm:hidden mb-4">
          <PlusCircle size={18} weight="bold" className="mr-2" />
          New Post
        </Button>

        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5 shadow-sm border-border/60 hover:shadow-md transition-all cursor-pointer">
                <div className="flex gap-4">
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/60 text-white font-bold text-sm">
                      {post.authorInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground text-base leading-tight">
                            {post.title}
                          </h3>
                          {post.isNew && (
                            <Badge className="bg-accent text-white text-xs px-1.5 py-0">
                              New
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span className="font-medium">{post.author}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTimeAgo(post.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.preview}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          <ChatCircle size={16} weight="bold" />
                          <span>{post.replies} replies</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          <ThumbsUp size={16} weight="bold" />
                          <span>{post.likes}</span>
                        </button>
                      </div>

                      <Button
                        onClick={() => handleReply(post.id)}
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex"
                      >
                        View Thread
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-8 text-center mt-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <Users size={48} weight="duotone" className="text-primary mx-auto mb-4" />
          <h3 className="font-bold text-foreground mb-2">Join the Conversation</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Share your experiences, ask questions, and connect with other families navigating similar journeys.
          </p>
          <Button onClick={handleNewPost}>
            <PlusCircle size={18} weight="bold" className="mr-2" />
            Create Your First Post
          </Button>
        </Card>
      </div>
    </div>
  )
}
