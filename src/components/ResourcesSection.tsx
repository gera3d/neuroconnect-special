import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
  BookOpen,
  MagnifyingGlass,
  ArrowRight,
  Article,
  VideoCamera,
  FileText,
  Lightbulb,
  Heart,
} from "@phosphor-icons/react"

interface Resource {
  id: string
  title: string
  description: string
  category: "article" | "video" | "guide" | "tip"
  readTime?: string
  watchTime?: string
  tags: string[]
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Understanding Autism Spectrum Disorder: A Parent's Guide",
    description: "Comprehensive guide covering the basics of ASD, early signs, and how to support your child's development.",
    category: "guide",
    readTime: "15 min",
    tags: ["Autism", "Early Intervention", "Parenting"],
  },
  {
    id: "2",
    title: "Speech Therapy Techniques You Can Practice at Home",
    description: "Learn simple, effective exercises to support your child's speech development between professional sessions.",
    category: "article",
    readTime: "8 min",
    tags: ["Speech Therapy", "Home Activities", "Language Development"],
  },
  {
    id: "3",
    title: "Sensory Processing: What Every Parent Should Know",
    description: "Understanding sensory sensitivities and how they affect daily life, plus practical coping strategies.",
    category: "article",
    readTime: "12 min",
    tags: ["Sensory Processing", "Understanding", "Coping Strategies"],
  },
  {
    id: "4",
    title: "Building a Strong IEP for Your Child",
    description: "Step-by-step guide to creating an effective Individualized Education Program that meets your child's needs.",
    category: "guide",
    readTime: "20 min",
    tags: ["Education", "IEP", "Advocacy"],
  },
  {
    id: "5",
    title: "Managing ADHD: Evidence-Based Strategies",
    description: "Research-backed approaches to helping children with ADHD thrive at home and school.",
    category: "article",
    readTime: "10 min",
    tags: ["ADHD", "Behavior Management", "Evidence-Based"],
  },
  {
    id: "6",
    title: "Creating a Sensory-Friendly Home Environment",
    description: "Practical tips for adapting your living space to support children with sensory sensitivities.",
    category: "tip",
    readTime: "6 min",
    tags: ["Sensory", "Home Environment", "Practical Tips"],
  },
  {
    id: "7",
    title: "Social Skills Development for Children on the Spectrum",
    description: "Activities and strategies to help your child build meaningful friendships and navigate social situations.",
    category: "guide",
    readTime: "18 min",
    tags: ["Social Skills", "Autism", "Peer Relationships"],
  },
  {
    id: "8",
    title: "Understanding Your Child's Therapy Progress",
    description: "How to track development, celebrate milestones, and work effectively with your therapy team.",
    category: "article",
    readTime: "9 min",
    tags: ["Therapy", "Progress Tracking", "Team Collaboration"],
  },
]

const categoryIcons = {
  article: <Article size={20} weight="bold" />,
  video: <VideoCamera size={20} weight="bold" />,
  guide: <FileText size={20} weight="bold" />,
  tip: <Lightbulb size={20} weight="bold" />,
}

const categoryColors = {
  article: "bg-primary/10 text-primary border-primary/20",
  video: "bg-accent/10 text-accent border-accent/20",
  guide: "bg-success/10 text-success border-success/20",
  tip: "bg-warning/10 text-warning border-warning/20",
}

export function ResourcesSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
            Resources & Learning
          </h1>
          <p className="text-sm text-muted-foreground">
            Expert articles, guides, and tips to support your journey
          </p>
        </div>

        <Card className="p-6 mb-6 border-border/60 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <BookOpen size={24} weight="bold" className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Curated Educational Content
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our library is carefully curated by experts to provide you with reliable,
                actionable information to support your child's development and your family's
                well-being.
              </p>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <div className="relative mb-4">
            <MagnifyingGlass
              size={20}
              weight="bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, guides, and tips..."
              className="pl-12 h-12"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger value="all" className="flex-shrink-0">
                All Resources
              </TabsTrigger>
              <TabsTrigger value="article" className="flex-shrink-0">
                <Article size={16} weight="bold" className="mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="guide" className="flex-shrink-0">
                <FileText size={16} weight="bold" className="mr-2" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="tip" className="flex-shrink-0">
                <Lightbulb size={16} weight="bold" className="mr-2" />
                Tips
              </TabsTrigger>
              <TabsTrigger value="video" className="flex-shrink-0">
                <VideoCamera size={16} weight="bold" className="mr-2" />
                Videos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredResources.length === 0 ? (
          <Card className="p-12 text-center border-border/60">
            <BookOpen size={64} weight="thin" className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground mb-2">No resources found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or browse all categories
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 border-border/60 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer h-full flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        categoryColors[resource.category]
                      }`}
                    >
                      {categoryIcons[resource.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge
                        variant="secondary"
                        className="text-[10px] mb-2 uppercase font-bold"
                      >
                        {resource.category}
                      </Badge>
                      <h3 className="font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <span className="text-xs text-muted-foreground">
                      {resource.readTime || resource.watchTime}
                    </span>
                    <Button variant="ghost" size="sm" className="group/btn">
                      Read More
                      <ArrowRight
                        size={16}
                        weight="bold"
                        className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Card className="mt-6 p-5 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="flex items-start gap-3">
            <Heart size={20} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-foreground mb-1">Stay Updated</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                New resources are added regularly. Bookmark your favorites and check back often
                for the latest evidence-based information.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
