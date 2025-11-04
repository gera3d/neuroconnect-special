import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ProfessionalCard } from "./ProfessionalCard"
import { ProfessionalDialog } from "./ProfessionalDialog"
import { PracticeMap } from "./PracticeMap"
import { Professional } from "@/lib/types"
import { mockProfessionals } from "@/lib/mockData"
import { motion } from "framer-motion"
import {
  Sparkle,
  ArrowRight,
  CheckCircle,
  Target,
  Brain,
  Heart,
  Star,
  TrendUp,
  MapTrifold,
} from "@phosphor-icons/react"

interface MatchingQuestion {
  id: string
  question: string
  options: string[]
}

const matchingQuestions: MatchingQuestion[] = [
  {
    id: "condition",
    question: "What is your primary area of concern?",
    options: [
      "Autism Spectrum Disorder",
      "ADHD",
      "Dyslexia",
      "Speech Delays",
      "Sensory Processing",
      "Anxiety",
      "Developmental Delays",
    ],
  },
  {
    id: "treatment",
    question: "What type of treatment approach do you prefer?",
    options: ["Conventional", "Alternative", "Open to Both"],
  },
  {
    id: "priority",
    question: "What's most important to you?",
    options: [
      "Years of Experience",
      "Specific Credentials",
      "Availability",
      "Insurance Acceptance",
      "Communication Style",
    ],
  },
  {
    id: "goals",
    question: "What are your primary goals?",
    options: [
      "Improve Communication",
      "Behavioral Management",
      "Academic Support",
      "Social Skills",
      "Emotional Regulation",
      "Motor Skills Development",
    ],
  },
]

export function MatchingSection() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const progress = ((currentStep + 1) / matchingQuestions.length) * 100

  const handleAnswer = (answer: string) => {
    const question = matchingQuestions[currentStep]
    setAnswers({ ...answers, [question.id]: answer })

    if (currentStep < matchingQuestions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 600)
    } else {
      setTimeout(() => setShowResults(true), 600)
    }
  }

  const getMatchedProfessionals = () => {
    return mockProfessionals
      .filter((p) => p.isRecommended)
      .slice(0, 3)
      .map((p, idx) => ({
        ...p,
        matchScore: 95 - idx * 5,
      }))
  }

  const resetMatching = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
  }

  if (showResults) {
    const matches = getMatchedProfessionals()

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-primary/20 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Sparkle size={28} weight="fill" className="text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">
                  Your Personalized Matches
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on your responses, we've identified the best professionals for your family's unique needs
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 border-border/60 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  <Target size={20} weight="bold" className="text-primary" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Match Quality
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">95%</p>
              </Card>

              <Card className="p-4 border-border/60 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  <Brain size={20} weight="bold" className="text-accent" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Specialists Found
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{matches.length}</p>
              </Card>

              <Card className="p-4 border-border/60 bg-card/50">
                <div className="flex items-center gap-3 mb-2">
                  <Heart size={20} weight="bold" className="text-success" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Accepting Clients
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {matches.filter((m) => m.acceptingNewClients).length}
                </p>
              </Card>
            </div>
          </div>

          <div className="mb-8 relative h-[60vh] min-h-[400px] rounded-2xl overflow-hidden border border-border/60 shadow-sm bg-card">
            <PracticeMap 
              professionals={matches} 
              rankedMode={true}
              onMarkerClick={(professional) => {
                setSelectedProfessional(professional)
                setDialogOpen(true)
              }}
              isDialogOpen={dialogOpen}
            />
            
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/60 shadow-2xl"
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-12 h-1 rounded-full bg-border"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapTrifold size={20} weight="bold" className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground">Top Matches in Santa Monica</h3>
                    <p className="text-xs text-muted-foreground">
                      Click markers for details
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border/40">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#FFD700] border border-[#DAA520]"></span>
                      1st Place
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#C0C0C0] border border-[#A8A8A8]"></span>
                      2nd Place
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#CD7F32] border border-[#B8732D]"></span>
                      3rd Place
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Top Recommendations</h2>
            <Button onClick={resetMatching} variant="outline" size="sm">
              Start Over
            </Button>
          </div>

          <div className="space-y-4">
            {matches.map((professional, index) => (
              <motion.div
                key={professional.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="relative">
                  <div className="absolute -top-3 -left-3 z-10 flex gap-2">
                    {index === 0 && (
                      <Badge className="bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black border-0 shadow-lg font-bold">
                        <span className="text-base mr-1">🥇</span>
                        1st Place
                      </Badge>
                    )}
                    {index === 1 && (
                      <Badge className="bg-gradient-to-r from-[#C0C0C0] to-[#A8A8A8] text-black border-0 shadow-lg font-bold">
                        <span className="text-base mr-1">🥈</span>
                        2nd Place
                      </Badge>
                    )}
                    {index === 2 && (
                      <Badge className="bg-gradient-to-r from-[#CD7F32] to-[#B8732D] text-white border-0 shadow-lg font-bold">
                        <span className="text-base mr-1">🥉</span>
                        3rd Place
                      </Badge>
                    )}
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg">
                      <Star size={12} weight="fill" className="mr-1" />
                      {professional.matchScore}% Match
                    </Badge>
                  </div>
                  <ProfessionalCard
                    professional={professional}
                    onClick={() => {
                      setSelectedProfessional(professional)
                      setDialogOpen(true)
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <ProfessionalDialog
          professional={selectedProfessional}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    )
  }

  const currentQuestion = matchingQuestions[currentStep]

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <TrendUp size={16} weight="bold" />
              <span className="text-xs font-bold">Smart Matching Algorithm</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
              Find Your Perfect Match
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Answer a few questions and we'll connect you with professionals who best fit your family's needs
            </p>
          </div>

          <Card className="p-6 sm:p-8 border-border/60 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground">
                  Question {currentStep + 1} of {matchingQuestions.length}
                </span>
                <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Separator className="my-6" />

            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                  onClick={() => handleAnswer(option)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border border-border/60 bg-card hover:bg-accent/5 hover:border-primary/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-md group text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                    <CheckCircle
                      size={20}
                      weight="bold"
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground flex-1">{option}</span>
                  <ArrowRight
                    size={18}
                    weight="bold"
                    className="text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1"
                  />
                </motion.button>
              ))}
            </div>
          </Card>

          {currentStep > 0 && (
            <div className="mt-4 text-center">
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Back to Previous Question
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
