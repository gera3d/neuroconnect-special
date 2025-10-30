import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { UserCircle, PencilSimple, CheckCircle, ArrowLeft } from "@phosphor-icons/react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import type { Condition } from "@/lib/types"

const CONDITIONS: Condition[] = [
  "Autism Spectrum Disorder",
  "Dyslexia",
  "ADHD",
  "Developmental Delays",
  "Sensory Processing",
  "Anxiety",
  "Speech Delays"
]

interface FamilyMember {
  id: string
  name: string
  age: string
  conditions: Condition[]
  notes: string
}

interface ProfileData {
  members: FamilyMember[]
  parentName: string
  email: string
  phone: string
}

const DEFAULT_PROFILE: ProfileData = {
  members: [],
  parentName: "",
  email: "",
  phone: ""
}

interface FamilyProfileProps {
  onBack?: () => void
}

export function FamilyProfile({ onBack }: FamilyProfileProps) {
  const [profile, setProfile] = useKV<ProfileData>("family-profile", DEFAULT_PROFILE)
  const prefs = profile || DEFAULT_PROFILE

  const handleSave = () => {
    toast.success("Family profile saved!", {
      description: "Your information has been securely stored."
    })
  }

  const handleToggleCondition = (memberId: string, condition: Condition) => {
    setProfile((current) => {
      if (!current) return current!
      return {
        ...current,
        members: current.members.map(member =>
          member.id === memberId
            ? {
                ...member,
                conditions: member.conditions.includes(condition)
                  ? member.conditions.filter(c => c !== condition)
                  : [...member.conditions, condition]
              }
            : member
        )
      }
    })
  }

  const handleAddMember = () => {
    setProfile((current) => {
      if (!current) return current!
      return {
        ...current,
        members: [
          ...current.members,
          {
            id: Date.now().toString(),
            name: "",
            age: "",
            conditions: [],
            notes: ""
          }
        ]
      }
    })
  }

  const handleUpdateMember = (memberId: string, field: keyof FamilyMember, value: string) => {
    setProfile((current) => {
      if (!current) return current!
      return {
        ...current,
        members: current.members.map(member =>
          member.id === memberId
            ? { ...member, [field]: value }
            : member
        )
      }
    })
  }

  const handleRemoveMember = (memberId: string) => {
    setProfile((current) => {
      if (!current) return current!
      return {
        ...current,
        members: current.members.filter(member => member.id !== memberId)
      }
    })
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border/60 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
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
              <UserCircle size={28} weight="fill" className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Family Profile</h1>
              <p className="text-muted-foreground">Manage your family's needs and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 mt-8 space-y-6">
        <Card className="p-6 shadow-sm border-border/60">
          <h2 className="text-xl font-bold text-foreground mb-4">Parent/Guardian Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parent-name">Full Name</Label>
              <Input
                id="parent-name"
                value={prefs.parentName}
                onChange={(e) => setProfile((current) => {
                  if (!current) return current!
                  return { ...current, parentName: e.target.value }
                })}
                placeholder="Your name"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={prefs.email}
                onChange={(e) => setProfile((current) => {
                  if (!current) return current!
                  return { ...current, email: e.target.value }
                })}
                placeholder="your@email.com"
                className="mt-1.5"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={prefs.phone}
                onChange={(e) => setProfile((current) => {
                  if (!current) return current!
                  return { ...current, phone: e.target.value }
                })}
                placeholder="(555) 123-4567"
                className="mt-1.5"
              />
            </div>
          </div>
        </Card>

        <Separator />

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Family Members</h2>
          <Button onClick={handleAddMember} variant="outline">
            <PencilSimple size={16} weight="bold" className="mr-2" />
            Add Member
          </Button>
        </div>

        {prefs.members.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl">
              👨‍👩‍👧‍👦
            </div>
            <h3 className="font-bold text-foreground mb-2">No family members yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add family members to track their needs and conditions</p>
            <Button onClick={handleAddMember}>
              <PencilSimple size={16} weight="bold" className="mr-2" />
              Add First Member
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {prefs.members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 shadow-sm border-border/60">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-foreground">Family Member {index + 1}</h3>
                    <Button
                      onClick={() => handleRemoveMember(member.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`name-${member.id}`}>Name</Label>
                      <Input
                        id={`name-${member.id}`}
                        value={member.name}
                        onChange={(e) => handleUpdateMember(member.id, "name", e.target.value)}
                        placeholder="Child's name"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`age-${member.id}`}>Age</Label>
                      <Input
                        id={`age-${member.id}`}
                        value={member.age}
                        onChange={(e) => handleUpdateMember(member.id, "age", e.target.value)}
                        placeholder="Age or birthdate"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="mb-2 block">Conditions/Diagnoses</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CONDITIONS.map((condition) => (
                        <button
                          key={condition}
                          onClick={() => handleToggleCondition(member.id, condition)}
                          className={`p-3 rounded-lg border transition-all text-left text-sm ${
                            member.conditions.includes(condition)
                              ? "border-primary bg-primary/5"
                              : "border-border/40 hover:border-primary/50 hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-foreground">{condition}</span>
                            {member.conditions.includes(condition) && (
                              <CheckCircle size={16} weight="fill" className="text-primary" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`notes-${member.id}`}>Additional Notes</Label>
                    <textarea
                      id={`notes-${member.id}`}
                      value={member.notes}
                      onChange={(e) => handleUpdateMember(member.id, "notes", e.target.value)}
                      placeholder="Any specific needs, preferences, or important details..."
                      className="w-full mt-1.5 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                    />
                  </div>

                  {member.conditions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/40">
                      <p className="text-xs text-muted-foreground mb-2">Selected conditions:</p>
                      <div className="flex flex-wrap gap-2">
                        {member.conditions.map((condition) => (
                          <Badge key={condition} variant="secondary">{condition}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <CheckCircle size={18} weight="fill" className="mr-2" />
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
