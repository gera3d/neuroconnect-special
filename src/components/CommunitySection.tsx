import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  Users,
  ChatCircle,
  Heart,
  Plus,
  ArrowUp,
  Calendar,
  MapPin,
  Sparkle,
} from "@phosphor-icons/react"
import { formatDistanceToNow } from "date-fns"

interface Post {
  id: string
  authorName: string
  authorInitials: string
  content: string
  category: string
  timestamp: number
  likes: number
  replies: number
  likedByUser?: boolean
}

interface SupportGroup {
  id: string
  name: string
  description: string
  members: number
  category: string
  nextMeeting?: string
}

const initialPosts: Post[] = [
  {
    id: "post-1",
    authorName: "Jennifer M.",
    authorInitials: "JM",
    content: "Just wanted to share a small victory - my son spoke his first full sentence today after 6 months of speech therapy! To anyone just starting this journey, don't give up. Progress happens, even when it feels slow. 💙",
    category: "Success Story",
    timestamp: Date.now() - 3600000,
    likes: 24,
    replies: 8,
  },
  {
    id: "post-2",
    authorName: "David K.",
    authorInitials: "DK",
    content: "Does anyone have recommendations for occupational therapists in the Boston area who specialize in sensory integration? Our current therapist is moving and we need to find someone new.",
    category: "Question",
    timestamp: Date.now() - 7200000,
    likes: 5,
    replies: 12,
  },
  {
    id: "post-3",
    authorName: "Maria S.",
    authorInitials: "MS",
    content: "Reminder: You're doing an amazing job, even on the hard days. Taking care of yourself isn't selfish - it's necessary. You can't pour from an empty cup. 🌟",
    category: "Support",
    timestamp: Date.now() - 14400000,
    likes: 42,
    replies: 6,
  },
  {
    id: "post-4",
    authorName: "Robert T.",
    authorInitials: "RT",
    content: "Has anyone tried combining conventional therapy with mindfulness practices for anxiety management? We're considering it for our daughter and would love to hear experiences.",
    category: "Question",
    timestamp: Date.now() - 21600000,
    likes: 9,
    replies: 15,
  },
]

const supportGroups: SupportGroup[] = [
  {
    id: "group-1",
    name: "Parents of Children with Autism",
    description: "A supportive community for parents navigating autism spectrum disorder",
    members: 1247,
    category: "Autism",
    nextMeeting: "Tuesday, 7:00 PM EST",
  },
  {
    id: "group-2",
    name: "ADHD Support Network",
    description: "Share strategies and support for families managing ADHD",
    members: 892,
    category: "ADHD",
    nextMeeting: "Thursday, 6:30 PM EST",
  },
  {
    id: "group-3",
    name: "Speech & Language Development",
    description: "Discussion and resources for speech therapy journeys",
    members: 654,
    category: "Speech",
  },
  {
    id: "group-4",
    name: "Sensory Processing Support",
    description: "Understanding and managing sensory sensitivities together",
    members: 531,
    category: "Sensory",
    nextMeeting: "Wednesday, 8:00 PM EST",
  },
]

export function CommunitySection() {
  const [posts, setPosts] = useKV<Post[]>("community-posts", initialPosts)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState("General")
  const [showNewPost, setShowNewPost] = useState(false)

  const handleLikePost = (postId: string) => {
    if (!posts) return
    
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              likedByUser: !post.likedByUser,
            }
          : post
      )
    )
  }

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: "You",
      authorInitials: "YO",
      content: newPostContent,
      category: newPostCategory,
      timestamp: Date.now(),
      likes: 0,
      replies: 0,
    }

    setPosts([newPost, ...(posts || [])])
    setNewPostContent("")
    setNewPostCategory("General")
    setShowNewPost(false)
    toast.success("Post shared with the community")
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Community</h1>
          <p className="text-sm text-muted-foreground">
            Connect with other families and share your experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6">
            <Card className="p-6 border-border/60 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Users size={24} weight="bold" className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-2">Welcome to Our Community</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A safe, supportive space to share experiences, ask questions, and find
                    encouragement from families on similar journeys.
                  </p>
                </div>
              </div>
            </Card>

            {!showNewPost ? (
              <Button onClick={() => setShowNewPost(true)} className="w-full" size="lg">
                <Plus size={18} weight="bold" className="mr-2" />
                Share Your Story or Ask a Question
              </Button>
            ) : (
              <Card className="p-5 border-border/60">
                <h3 className="font-bold text-foreground mb-4">Create a Post</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["General", "Question", "Success Story", "Support", "Advice"].map(
                        (category) => (
                          <Button
                            key={category}
                            onClick={() => setNewPostCategory(category)}
                            variant={newPostCategory === category ? "default" : "outline"}
                            size="sm"
                          >
                            {category}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                  <Textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your thoughts, experiences, or questions with the community..."
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                      Post to Community
                    </Button>
                    <Button onClick={() => setShowNewPost(false)} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-4">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="stories">Success Stories</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {posts?.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    <Card className="p-5 border-border/60">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/20 text-primary font-bold">
                            {post.authorInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-sm text-foreground">
                              {post.authorName}
                            </h3>
                            <Badge variant="secondary" className="text-[10px]">
                              {post.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-foreground leading-relaxed mb-4">
                        {post.content}
                      </p>

                      <Separator className="my-4" />

                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => handleLikePost(post.id)}
                          variant="ghost"
                          size="sm"
                          className={post.likedByUser ? "text-accent" : ""}
                        >
                          <Heart
                            size={16}
                            weight={post.likedByUser ? "fill" : "bold"}
                            className="mr-2"
                          />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ChatCircle size={16} weight="bold" className="mr-2" />
                          {post.replies}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="questions" className="space-y-4">
                {posts
                  ?.filter((p) => p.category === "Question")
                  .map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-5 border-border/60">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary/20 text-primary font-bold">
                              {post.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-foreground mb-1">
                              {post.authorName}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed mb-4">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleLikePost(post.id)}
                            variant="ghost"
                            size="sm"
                            className={post.likedByUser ? "text-accent" : ""}
                          >
                            <Heart
                              size={16}
                              weight={post.likedByUser ? "fill" : "bold"}
                              className="mr-2"
                            />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ChatCircle size={16} weight="bold" className="mr-2" />
                            {post.replies}
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </TabsContent>

              <TabsContent value="stories" className="space-y-4">
                {posts
                  ?.filter((p) => p.category === "Success Story")
                  .map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-5 border-border/60 bg-gradient-to-br from-success/5 to-background">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-success/20 text-success font-bold">
                              {post.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-sm text-foreground">
                                {post.authorName}
                              </h3>
                              <Badge className="bg-success/20 text-success border-success/30 text-[10px]">
                                {post.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed mb-4">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleLikePost(post.id)}
                            variant="ghost"
                            size="sm"
                            className={post.likedByUser ? "text-accent" : ""}
                          >
                            <Heart
                              size={16}
                              weight={post.likedByUser ? "fill" : "bold"}
                              className="mr-2"
                            />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ChatCircle size={16} weight="bold" className="mr-2" />
                            {post.replies}
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </TabsContent>

              <TabsContent value="support" className="space-y-4">
                {posts
                  ?.filter((p) => p.category === "Support")
                  .map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-5 border-border/60 bg-gradient-to-br from-accent/5 to-background">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-accent/20 text-accent font-bold">
                              {post.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-foreground mb-1">
                              {post.authorName}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed mb-4">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleLikePost(post.id)}
                            variant="ghost"
                            size="sm"
                            className={post.likedByUser ? "text-accent" : ""}
                          >
                            <Heart
                              size={16}
                              weight={post.likedByUser ? "fill" : "bold"}
                              className="mr-2"
                            />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ChatCircle size={16} weight="bold" className="mr-2" />
                            {post.replies}
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-5 border-border/60">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkle size={18} weight="fill" className="text-primary" />
                Support Groups
              </h3>
              <div className="space-y-3">
                {supportGroups.map((group) => (
                  <Card key={group.id} className="p-4 border-border/40 bg-muted/30">
                    <h4 className="font-semibold text-sm text-foreground mb-2">{group.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{group.members.toLocaleString()} members</span>
                      {group.nextMeeting && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} weight="bold" />
                          <span className="text-xs">{group.nextMeeting}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Join Group
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-5 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5">
              <h3 className="font-bold text-foreground mb-2">Community Guidelines</h3>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Be respectful and supportive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Protect privacy - don't share personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>No medical advice - share experiences only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Report inappropriate content</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
