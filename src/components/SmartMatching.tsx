import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkle, CheckCircle, User, MapPin, Target, Clock } from "@phosphor-icons/react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import type { Specialty, Condition } from "@/lib/types"

interface MatchingPreferences {
  primaryNeeds: Specialty[]
  conditions: Condition[]
  location: string
  urgency: "immediate" | "month" | "flexible"
  treatmentPreference: "conventional" | "alternative" | "open"
  completed?: boolean
}

const SPECIALTIES: Specialty[] = [
  "Speech Therapy",
  "Sensory Integration",
  "Occupational Therapy",
  "Behavioral Therapy",
  "Yoga & Mindfulness",
  "Acupuncture",
  "Physical Therapy",
  "Music Therapy",
  "Art Therapy"
]

const CONDITIONS: Condition[] = [
  "Autism Spectrum Disorder",
  "Dyslexia",
  "ADHD",
  "Developmental Delays",
  "Sensory Processing",
  "Anxiety",
  "Speech Delays"
]

const DEFAULT_PREFERENCES: MatchingPreferences = {
  primaryNeeds: [],
  conditions: [],
  location: "",
  urgency: "flexible",
  treatmentPreference: "open"
}

interface SmartMatchingProps {
  onComplete?: () => void
}

export function SmartMatching({ onComplete }: SmartMatchingProps) {
  const [preferences, setPreferences] = useKV<MatchingPreferences>("matching-preferences", DEFAULT_PREFERENCES)
  
  const [step, setStep] = useState(1)
  const totalSteps = 4
  
  const prefs = preferences || DEFAULT_PREFERENCES

  const handleToggleNeed = (need: Specialty) => {
    setPreferences((current) => {
      if (!current) return current!
      return {
        ...current,
        primaryNeeds: current.primaryNeeds.includes(need)
          ? current.primaryNeeds.filter(n => n !== need)
          : [...current.primaryNeeds, need]
      }
    })
  }

  const handleToggleCondition = (condition: Condition) => {
    setPreferences((current) => {
      if (!current) return current!
      return {
        ...current,
        conditions: current.conditions.includes(condition)
          ? current.conditions.filter(c => c !== condition)
          : [...current.conditions, condition]
      }
    })
  }

  const handleComplete = () => {
    setPreferences((current) => {
      if (!current) return current!
      return { ...current, completed: true }
    })
    
    toast.success("Matching preferences saved!", {
      description: "We'll use these to recommend the best professionals for your needs."
    })
    
    setTimeout(() => {
      onComplete?.()
    }, 1000)
  }

  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border/60 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Sparkle size={28} weight="fill" className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Smart Matching</h1>
              <p className="text-muted-foreground">Get personalized professional recommendations</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 mt-8">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-6 shadow-sm border-border/60">
              <div className="flex items-start gap-3 mb-5">
                <Target size={24} weight="duotone" className="text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">What support are you looking for?</h2>
                  <p className="text-sm text-muted-foreground">Select all specialties that apply (you can choose multiple)</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIALTIES.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => handleToggleNeed(specialty)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      prefs.primaryNeeds.includes(specialty)
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/40 hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{specialty}</span>
                      {prefs.primaryNeeds.includes(specialty) && (
                        <CheckCircle size={20} weight="fill" className="text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setStep(2)}
                disabled={prefs.primaryNeeds.length === 0}
                size="lg"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-6 shadow-sm border-border/60">
              <div className="flex items-start gap-3 mb-5">
                <User size={24} weight="duotone" className="text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">What conditions or challenges?</h2>
                  <p className="text-sm text-muted-foreground">Help us match you with specialists who have relevant experience</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => handleToggleCondition(condition)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      prefs.conditions.includes(condition)
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/40 hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{condition}</span>
                      {prefs.conditions.includes(condition) && (
                        <CheckCircle size={20} weight="fill" className="text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-between gap-3">
              <Button onClick={() => setStep(1)} variant="outline" size="lg">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={prefs.conditions.length === 0}
                size="lg"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-6 shadow-sm border-border/60">
              <div className="flex items-start gap-3 mb-5">
                <MapPin size={24} weight="duotone" className="text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Location preferences</h2>
                  <p className="text-sm text-muted-foreground">Where are you looking for support?</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    placeholder="City or State"
                    value={prefs.location}
                    onChange={(e) => setPreferences((current) => {
                      if (!current) return current!
                      return { ...current, location: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Treatment Preference
                  </label>
                  <Select
                    value={prefs.treatmentPreference}
                    onValueChange={(value: any) => setPreferences((current) => {
                      if (!current) return current!
                      return { ...current, treatmentPreference: value }
                    })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conventional">Conventional Only</SelectItem>
                      <SelectItem value="alternative">Alternative Only</SelectItem>
                      <SelectItem value="open">Open to Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <div className="flex justify-between gap-3">
              <Button onClick={() => setStep(2)} variant="outline" size="lg">
                Back
              </Button>
              <Button onClick={() => setStep(4)} size="lg">
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-6 shadow-sm border-border/60">
              <div className="flex items-start gap-3 mb-5">
                <Clock size={24} weight="duotone" className="text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">When do you need support?</h2>
                  <p className="text-sm text-muted-foreground">This helps us prioritize professionals with availability</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => setPreferences((current) => {
                    if (!current) return current!
                    return { ...current, urgency: "immediate" }
                  })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    prefs.urgency === "immediate"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/40 hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">As soon as possible</p>
                      <p className="text-sm text-muted-foreground">Need support within 1-2 weeks</p>
                    </div>
                    {prefs.urgency === "immediate" && (
                      <CheckCircle size={20} weight="fill" className="text-primary" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPreferences((current) => {
                    if (!current) return current!
                    return { ...current, urgency: "month" }
                  })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    prefs.urgency === "month"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/40 hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Within a month</p>
                      <p className="text-sm text-muted-foreground">Can wait 2-4 weeks</p>
                    </div>
                    {prefs.urgency === "month" && (
                      <CheckCircle size={20} weight="fill" className="text-primary" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPreferences((current) => {
                    if (!current) return current!
                    return { ...current, urgency: "flexible" }
                  })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    prefs.urgency === "flexible"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/40 hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Flexible timing</p>
                      <p className="text-sm text-muted-foreground">Just browsing options</p>
                    </div>
                    {prefs.urgency === "flexible" && (
                      <CheckCircle size={20} weight="fill" className="text-primary" />
                    )}
                  </div>
                </button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
              <h3 className="font-bold text-foreground mb-3">Your Matching Profile Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Looking for:</p>
                  <div className="flex flex-wrap gap-2">
                    {prefs.primaryNeeds.map((need) => (
                      <Badge key={need} variant="secondary">{need}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Conditions:</p>
                  <div className="flex flex-wrap gap-2">
                    {prefs.conditions.map((condition) => (
                      <Badge key={condition} variant="secondary">{condition}</Badge>
                    ))}
                  </div>
                </div>
                {prefs.location && (
                  <div>
                    <p className="text-muted-foreground">Location: <span className="text-foreground font-medium">{prefs.location}</span></p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Urgency: <span className="text-foreground font-medium capitalize">{prefs.urgency === "month" ? "Within a month" : prefs.urgency}</span></p>
                </div>
              </div>
            </Card>

            <div className="flex justify-between gap-3">
              <Button onClick={() => setStep(3)} variant="outline" size="lg">
                Back
              </Button>
              <Button onClick={handleComplete} size="lg">
                <Sparkle size={18} weight="fill" className="mr-2" />
                Save Preferences
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
