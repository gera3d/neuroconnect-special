import { useState } from "react"
import { useKV } from "@github/spark/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  UserCircle,
  Baby,
  Calendar,
  MapPin,
  Heart,
  FloppyDisk,
  PencilSimple,
  Plus,
  X,
  CheckCircle,
} from "@phosphor-icons/react"

interface ChildProfile {
  name: string
  age: string
  dateOfBirth: string
  primaryCondition: string
  additionalConditions: string[]
  currentTherapies: string[]
  goals: string[]
  notes: string
}

interface FamilyInfo {
  parentName: string
  email: string
  phone: string
  city: string
  state: string
  preferredContactMethod: string
}

export function ProfileSection() {
  const [childProfile, setChildProfile] = useKV<ChildProfile>("child-profile", {
    name: "",
    age: "",
    dateOfBirth: "",
    primaryCondition: "",
    additionalConditions: [],
    currentTherapies: [],
    goals: [],
    notes: "",
  })

  const [familyInfo, setFamilyInfo] = useKV<FamilyInfo>("family-info", {
    parentName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    preferredContactMethod: "email",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [newCondition, setNewCondition] = useState("")
  const [newTherapy, setNewTherapy] = useState("")
  const [newGoal, setNewGoal] = useState("")

  const handleSave = () => {
    setIsEditing(false)
    toast.success("Profile saved successfully", {
      description: "Your family profile has been updated",
    })
  }

  const addCondition = () => {
    if (newCondition.trim() && childProfile) {
      setChildProfile({
        ...childProfile,
        additionalConditions: [...childProfile.additionalConditions, newCondition.trim()],
      })
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    if (childProfile) {
      setChildProfile({
        ...childProfile,
        additionalConditions: childProfile.additionalConditions.filter((_, i) => i !== index),
      })
    }
  }

  const addTherapy = () => {
    if (newTherapy.trim() && childProfile) {
      setChildProfile({
        ...childProfile,
        currentTherapies: [...childProfile.currentTherapies, newTherapy.trim()],
      })
      setNewTherapy("")
    }
  }

  const removeTherapy = (index: number) => {
    if (childProfile) {
      setChildProfile({
        ...childProfile,
        currentTherapies: childProfile.currentTherapies.filter((_, i) => i !== index),
      })
    }
  }

  const addGoal = () => {
    if (newGoal.trim() && childProfile) {
      setChildProfile({
        ...childProfile,
        goals: [...childProfile.goals, newGoal.trim()],
      })
      setNewGoal("")
    }
  }

  const removeGoal = (index: number) => {
    if (childProfile) {
      setChildProfile({
        ...childProfile,
        goals: childProfile.goals.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
              Family Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your child's information to get personalized recommendations
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <PencilSimple size={16} weight="bold" className="mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm">
                <FloppyDisk size={16} weight="bold" className="mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-border/60">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {childProfile?.name ? childProfile.name[0].toUpperCase() : <Baby size={28} weight="bold" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                  <UserCircle size={24} weight="bold" className="text-primary" />
                  Child Information
                </h2>
                <p className="text-xs text-muted-foreground">
                  Basic details about your child
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="child-name">Child's Name</Label>
                <Input
                  id="child-name"
                  value={childProfile?.name || ""}
                  onChange={(e) =>
                    childProfile && setChildProfile({ ...childProfile, name: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Enter child's name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="child-age">Age</Label>
                <Input
                  id="child-age"
                  value={childProfile?.age || ""}
                  onChange={(e) =>
                    childProfile && setChildProfile({ ...childProfile, age: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="e.g., 5 years old"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="child-dob">Date of Birth</Label>
                <Input
                  id="child-dob"
                  type="date"
                  value={childProfile?.dateOfBirth || ""}
                  onChange={(e) =>
                    childProfile && setChildProfile({ ...childProfile, dateOfBirth: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-condition">Primary Condition</Label>
                <Select
                  value={childProfile?.primaryCondition || ""}
                  onValueChange={(value) =>
                    childProfile && setChildProfile({ ...childProfile, primaryCondition: value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger id="primary-condition">
                    <SelectValue placeholder="Select primary condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Autism Spectrum Disorder">Autism Spectrum Disorder</SelectItem>
                    <SelectItem value="ADHD">ADHD</SelectItem>
                    <SelectItem value="Dyslexia">Dyslexia</SelectItem>
                    <SelectItem value="Speech Delays">Speech Delays</SelectItem>
                    <SelectItem value="Sensory Processing">Sensory Processing</SelectItem>
                    <SelectItem value="Anxiety">Anxiety</SelectItem>
                    <SelectItem value="Developmental Delays">Developmental Delays</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Additional Conditions</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCondition()}
                    disabled={!isEditing}
                    placeholder="Add another condition"
                  />
                  <Button onClick={addCondition} disabled={!isEditing} size="sm">
                    <Plus size={16} weight="bold" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {childProfile?.additionalConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="gap-1.5 pr-1">
                      {condition}
                      {isEditing && (
                        <button
                          onClick={() => removeCondition(index)}
                          className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5"
                        >
                          <X size={12} weight="bold" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Current Therapies</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newTherapy}
                    onChange={(e) => setNewTherapy(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTherapy()}
                    disabled={!isEditing}
                    placeholder="Add a therapy"
                  />
                  <Button onClick={addTherapy} disabled={!isEditing} size="sm">
                    <Plus size={16} weight="bold" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {childProfile?.currentTherapies.map((therapy, index) => (
                    <Badge key={index} variant="secondary" className="gap-1.5 pr-1 bg-primary/10 text-primary border-primary/20">
                      {therapy}
                      {isEditing && (
                        <button
                          onClick={() => removeTherapy(index)}
                          className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5"
                        >
                          <X size={12} weight="bold" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Goals & Objectives</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addGoal()}
                    disabled={!isEditing}
                    placeholder="Add a goal"
                  />
                  <Button onClick={addGoal} disabled={!isEditing} size="sm">
                    <Plus size={16} weight="bold" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {childProfile?.goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 bg-accent/5 rounded-lg border border-border/40"
                    >
                      <CheckCircle size={18} weight="bold" className="text-accent flex-shrink-0 mt-0.5" />
                      <span className="flex-1 text-sm text-foreground">{goal}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeGoal(index)}
                          className="hover:bg-destructive/20 rounded-sm p-1"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={childProfile?.notes || ""}
                onChange={(e) =>
                  childProfile && setChildProfile({ ...childProfile, notes: e.target.value })
                }
                disabled={!isEditing}
                placeholder="Any additional information about your child's needs, preferences, or challenges..."
                rows={4}
              />
            </div>
          </Card>

          <Card className="p-6 border-border/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                <Heart size={24} weight="bold" className="text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Parent/Guardian Information
                </h2>
                <p className="text-xs text-muted-foreground">
                  Your contact details for professional communication
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent-name">Full Name</Label>
                <Input
                  id="parent-name"
                  value={familyInfo?.parentName || ""}
                  onChange={(e) =>
                    familyInfo && setFamilyInfo({ ...familyInfo, parentName: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={familyInfo?.email || ""}
                  onChange={(e) =>
                    familyInfo && setFamilyInfo({ ...familyInfo, email: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={familyInfo?.phone || ""}
                  onChange={(e) =>
                    familyInfo && setFamilyInfo({ ...familyInfo, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred-contact">Preferred Contact Method</Label>
                <Select
                  value={familyInfo?.preferredContactMethod || "email"}
                  onValueChange={(value) =>
                    familyInfo && setFamilyInfo({ ...familyInfo, preferredContactMethod: value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger id="preferred-contact">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="text">Text Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={familyInfo?.city || ""}
                  onChange={(e) =>
                    familyInfo && setFamilyInfo({ ...familyInfo, city: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Your city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={familyInfo?.state || ""}
                  onChange={(e) =>
                    familyInfo && setFamilyInfo({ ...familyInfo, state: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="CA, NY, TX, etc."
                />
              </div>
            </div>
          </Card>

          {!isEditing && (
            <Card className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="flex items-start gap-3">
                <MapPin size={20} weight="bold" className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-1">
                    Profile Completeness
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A complete profile helps us match you with the best professionals for your family's needs. 
                    {!childProfile?.name && " Add your child's information to get started."}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  )
}
