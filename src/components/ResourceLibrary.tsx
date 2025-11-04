import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen, MagnifyingGlass, Play, FileText, Headphones, BookmarkSimple, ArrowLeft, Flask, Sparkle } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface Resource {
  id: string
  title: string
  description: string
  type: "article" | "video" | "podcast" | "guide" | "study"
  category: string
  duration?: string
  readTime?: string
  author: string
  saved: boolean
  url?: string
  journal?: string
  year?: number
  participants?: number
  keyFindings?: string[]
}

const RESOURCES: Resource[] = [
  {
    id: "s1",
    title: "Early Intervention in Autism Spectrum Disorder: Long-term Outcomes",
    description: "A longitudinal study examining the effectiveness of early behavioral interventions on communication and social skills development in children diagnosed with ASD before age 3.",
    type: "study",
    category: "Autism Research",
    readTime: "Full study: 45 min",
    author: "Dr. Patricia Chen et al.",
    journal: "Journal of Developmental & Behavioral Pediatrics",
    year: 2023,
    participants: 342,
    saved: false,
    keyFindings: [
      "Children who received intensive early intervention (25+ hours/week) showed 47% greater improvement in social communication skills compared to control group",
      "Gains were maintained or improved at 2-year follow-up in 78% of participants",
      "Parent involvement correlated strongly with positive outcomes (p<0.001)",
      "Earlier intervention start (before 24 months) associated with better long-term prognosis"
    ]
  },
  {
    id: "s2",
    title: "Sensory Integration Therapy: Meta-Analysis of Clinical Effectiveness",
    description: "Comprehensive review of 87 clinical trials evaluating sensory integration interventions for children with sensory processing disorder and related conditions.",
    type: "study",
    category: "Sensory Processing",
    readTime: "Full study: 38 min",
    author: "Dr. Michael Rodriguez & Dr. Sarah Kim",
    journal: "American Journal of Occupational Therapy",
    year: 2024,
    participants: 4521,
    saved: false,
    keyFindings: [
      "Moderate to large effect sizes (d=0.62) for reducing sensory-related behaviors",
      "Greatest improvements seen in tactile and vestibular processing domains",
      "Individualized sensory diets showed superior outcomes to standardized protocols",
      "Benefits generalized to home and school environments in 68% of cases"
    ]
  },
  {
    id: "s3",
    title: "Executive Function Training in ADHD: Randomized Controlled Trial",
    description: "Multi-site study investigating the impact of computerized executive function training on academic performance and daily living skills in children with ADHD.",
    type: "study",
    category: "ADHD",
    readTime: "Full study: 32 min",
    author: "Dr. James Liu et al.",
    journal: "JAMA Pediatrics",
    year: 2023,
    participants: 256,
    saved: false,
    keyFindings: [
      "Working memory improvements of 1.2 standard deviations after 8-week intervention",
      "Academic performance gains persisted 6 months post-intervention",
      "Parent-reported improvements in organization and task completion",
      "No significant difference between medication + training vs medication alone for hyperactivity symptoms"
    ]
  },
  {
    id: "s4",
    title: "Speech and Language Development: Effects of Naturalistic Intervention",
    description: "Study comparing naturalistic developmental behavioral interventions to traditional speech therapy for late-talking toddlers.",
    type: "study",
    category: "Speech & Language",
    readTime: "Full study: 28 min",
    author: "Dr. Amanda Foster et al.",
    journal: "Journal of Speech, Language, and Hearing Research",
    year: 2024,
    participants: 198,
    saved: false,
    keyFindings: [
      "Naturalistic interventions yielded 34% faster vocabulary growth",
      "Greater generalization to spontaneous communication contexts",
      "Parent-mediated approaches showed equivalent effectiveness to clinician-delivered",
      "Toddlers with gesture use at baseline showed strongest response"
    ]
  },
  {
    id: "s5",
    title: "Mindfulness-Based Interventions for Anxiety in Neurodivergent Children",
    description: "Examining the efficacy of adapted mindfulness programs for reducing anxiety symptoms in children with autism, ADHD, and learning differences.",
    type: "study",
    category: "Mental Health",
    readTime: "Full study: 35 min",
    author: "Dr. Rachel Patel & Dr. Kevin Nguyen",
    journal: "Clinical Psychology Review",
    year: 2023,
    participants: 427,
    saved: false,
    keyFindings: [
      "42% reduction in anxiety symptoms measured by standardized scales",
      "Improvements in emotional regulation and stress tolerance",
      "Body-based practices more effective than cognitive approaches for younger children",
      "10-week programs showed superior outcomes to shorter interventions"
    ]
  },
  {
    id: "1",
    title: "Understanding Sensory Processing Disorder",
    description: "A comprehensive guide to recognizing and supporting children with sensory processing challenges in daily life.",
    type: "article",
    category: "Sensory Processing",
    readTime: "8 min read",
    author: "Dr. Emily Roberts, OT",
    saved: false
  },
  {
    id: "2",
    title: "Communication Strategies for Nonverbal Children",
    description: "Learn effective techniques and tools to help nonverbal children express their needs and feelings.",
    type: "video",
    category: "Speech & Language",
    duration: "15 min",
    author: "Sarah Martinez, SLP",
    saved: false
  },
  {
    id: "3",
    title: "Creating Calm Spaces at Home",
    description: "Practical tips for designing sensory-friendly environments that reduce overwhelm and promote regulation.",
    type: "guide",
    category: "Home Strategies",
    readTime: "12 min read",
    author: "Michael Chen, Behavioral Therapist",
    saved: false
  },
  {
    id: "4",
    title: "ADHD and Executive Function Skills",
    description: "Understanding how ADHD affects planning, organization, and time management, with strategies to help.",
    type: "podcast",
    category: "ADHD",
    duration: "32 min",
    author: "Dr. Lisa Thompson",
    saved: false
  },
  {
    id: "5",
    title: "Advocating for Your Child at School",
    description: "Navigate IEP meetings, 504 plans, and school accommodations with confidence using this step-by-step guide.",
    type: "guide",
    category: "Education",
    readTime: "15 min read",
    author: "Jennifer Walsh, Special Education Advocate",
    saved: false
  },
  {
    id: "6",
    title: "Positive Behavioral Support Strategies",
    description: "Evidence-based approaches to understanding and responding to challenging behaviors in children.",
    type: "video",
    category: "Behavior",
    duration: "22 min",
    author: "Dr. Marcus Johnson, BCBA",
    saved: false
  }
]

interface ResourceLibraryProps {
  onBack?: () => void
}

export function ResourceLibrary({ onBack }: ResourceLibraryProps) {
  const [search, setSearch] = useState("")
  const [resources] = useState<Resource[]>(RESOURCES)
  const [filter, setFilter] = useState<"all" | "article" | "video" | "podcast" | "guide" | "study">("all")
  const [selectedStudy, setSelectedStudy] = useState<Resource | null>(null)
  const [studyDialogOpen, setStudyDialogOpen] = useState(false)
  const [aiSummary, setAiSummary] = useState<string>("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase()) ||
                         resource.description.toLowerCase().includes(search.toLowerCase()) ||
                         resource.category.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || resource.type === filter
    return matchesSearch && matchesFilter
  })

  const studyResources = filteredResources.filter(r => r.type === "study")
  const otherResources = filteredResources.filter(r => r.type !== "study")

  const handleGenerateSummary = async (study: Resource) => {
    if (!study.keyFindings) return
    
    setIsGeneratingSummary(true)
    try {
      const keyFindingsText = study.keyFindings.join('\n')
      const promptText = `You are a medical research summarizer helping parents understand scientific studies about child development and therapy.

Study Title: ${study.title}
Journal: ${study.journal || "N/A"}
Year: ${study.year || "N/A"}
Participants: ${study.participants || "N/A"}
Description: ${study.description}

Key Findings:
${keyFindingsText}

Generate a clear, compassionate, parent-friendly summary that:
1. Explains what this study means in simple terms
2. Highlights the most important takeaways for parents
3. Provides practical implications for supporting their child
4. Uses encouraging, supportive language
5. Keeps it under 200 words

Do not use technical jargon. Write as if you're talking to a concerned parent who wants to understand how this research can help their child.`

      const summary = await window.spark.llm(promptText, "gpt-4o-mini")
      setAiSummary(summary)
      toast.success("Summary generated!")
    } catch (error) {
      toast.error("Failed to generate summary. Please try again.")
      console.error("Summary generation error:", error)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleStudyClick = (study: Resource) => {
    setSelectedStudy(study)
    setStudyDialogOpen(true)
    setAiSummary("")
  }

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "study":
        return <Flask size={20} weight="duotone" className="text-accent" />
      case "article":
        return <FileText size={20} weight="duotone" className="text-primary" />
      case "video":
        return <Play size={20} weight="fill" className="text-primary" />
      case "podcast":
        return <Headphones size={20} weight="duotone" className="text-primary" />
      case "guide":
        return <BookOpen size={20} weight="duotone" className="text-primary" />
    }
  }

  const getTypeLabel = (type: Resource["type"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <BookOpen size={28} weight="fill" className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Resource Library</h1>
              <p className="text-muted-foreground">Evidence-based research, guides, and educational content</p>
            </div>
          </div>

          <div className="relative">
            <MagnifyingGlass size={20} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="pl-10 bg-background/80 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-8">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="study">
              <Flask size={16} weight="bold" className="mr-2" />
              Research Studies
            </TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="podcast">Podcasts</TabsTrigger>
            <TabsTrigger value="guide">Guides</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredResources.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl">
              🔍
            </div>
            <h3 className="font-bold text-foreground mb-2">No resources found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {studyResources.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full border border-accent/30">
                    <Flask size={18} weight="fill" className="text-accent" />
                    <span className="text-sm font-bold text-accent-foreground">Research Studies</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {studyResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className="p-5 shadow-sm border-accent/40 hover:shadow-lg hover:border-accent/60 transition-all cursor-pointer bg-gradient-to-br from-accent/5 to-transparent"
                        onClick={() => handleStudyClick(resource)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-md">
                            <Flask size={24} weight="fill" className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge className="bg-accent text-accent-foreground text-xs font-semibold">
                                    Clinical Study
                                  </Badge>
                                  {resource.year && (
                                    <Badge variant="outline" className="text-xs">
                                      {resource.year}
                                    </Badge>
                                  )}
                                  {resource.participants && (
                                    <Badge variant="outline" className="text-xs">
                                      n={resource.participants}
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-bold text-foreground text-base leading-tight mb-1">
                                  {resource.title}
                                </h3>
                                {resource.journal && (
                                  <p className="text-xs text-muted-foreground italic mb-2">
                                    {resource.journal}
                                  </p>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 gap-1.5 bg-accent/10 hover:bg-accent/20 text-accent-foreground flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleStudyClick(resource)
                                }}
                              >
                                <Sparkle size={16} weight="fill" />
                                <span className="text-xs font-semibold">AI Summary</span>
                              </Button>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                              {resource.description}
                            </p>

                            {resource.keyFindings && resource.keyFindings.length > 0 && (
                              <div className="bg-background/60 rounded-lg p-3 border border-border/40">
                                <p className="text-xs font-semibold text-foreground mb-2">Key Findings:</p>
                                <ul className="space-y-1.5">
                                  {resource.keyFindings.slice(0, 2).map((finding, idx) => (
                                    <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                                      <span className="text-accent mt-0.5">•</span>
                                      <span className="flex-1">{finding}</span>
                                    </li>
                                  ))}
                                </ul>
                                {resource.keyFindings.length > 2 && (
                                  <p className="text-xs text-accent font-medium mt-2">
                                    + {resource.keyFindings.length - 2} more findings
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-border/40">
                              <Badge variant="secondary" className="text-xs">
                                {resource.category}
                              </Badge>
                              {resource.readTime && (
                                <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                              )}
                              <span className="text-xs text-muted-foreground ml-auto">{resource.author}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {otherResources.length > 0 && (
              <section>
                {studyResources.length > 0 && (
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">Other Resources</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {otherResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-5 shadow-sm border-border/60 hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {getTypeIcon(resource.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(resource.type)}
                              </Badge>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <BookmarkSimple size={16} weight="bold" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <h3 className="font-bold text-foreground mb-2 text-base leading-tight">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">
                          {resource.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
                          <Badge variant="secondary" className="text-xs">
                            {resource.category}
                          </Badge>
                          {resource.readTime && (
                            <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                          )}
                          {resource.duration && (
                            <span className="text-xs text-muted-foreground">{resource.duration}</span>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">{resource.author}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <Dialog open={studyDialogOpen} onOpenChange={setStudyDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedStudy && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                    <Flask size={24} weight="fill" className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className="bg-accent text-accent-foreground">Clinical Study</Badge>
                      {selectedStudy.year && (
                        <Badge variant="outline">{selectedStudy.year}</Badge>
                      )}
                      {selectedStudy.participants && (
                        <Badge variant="outline">n={selectedStudy.participants}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <DialogTitle className="text-xl leading-tight pr-8">
                  {selectedStudy.title}
                </DialogTitle>
                {selectedStudy.journal && (
                  <DialogDescription className="text-sm italic">
                    Published in {selectedStudy.journal}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-5 pt-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Study Overview</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedStudy.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Authors</h4>
                  <p className="text-sm text-muted-foreground">{selectedStudy.author}</p>
                </div>

                {selectedStudy.keyFindings && selectedStudy.keyFindings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Key Findings</h4>
                    <ul className="space-y-2.5">
                      {selectedStudy.keyFindings.map((finding, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-3 leading-relaxed">
                          <span className="text-accent font-bold mt-0.5 flex-shrink-0">{idx + 1}.</span>
                          <span className="flex-1">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-border pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Sparkle size={18} weight="fill" className="text-accent" />
                      AI-Generated Parent Summary
                    </h4>
                    {!aiSummary && (
                      <Button
                        onClick={() => handleGenerateSummary(selectedStudy)}
                        disabled={isGeneratingSummary}
                        size="sm"
                        className="gap-2"
                      >
                        {isGeneratingSummary ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkle size={16} weight="fill" />
                            Generate Summary
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {aiSummary ? (
                    <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/30">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {aiSummary}
                      </p>
                      <Button
                        onClick={() => handleGenerateSummary(selectedStudy)}
                        disabled={isGeneratingSummary}
                        variant="ghost"
                        size="sm"
                        className="mt-3 text-xs"
                      >
                        Regenerate Summary
                      </Button>
                    </div>
                  ) : !isGeneratingSummary && (
                    <div className="bg-muted/50 rounded-lg p-6 text-center border border-dashed border-border">
                      <Sparkle size={32} weight="duotone" className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click "Generate Summary" to get an AI-powered, parent-friendly explanation of this study's findings
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
