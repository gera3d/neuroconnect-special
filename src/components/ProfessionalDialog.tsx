import { Professional } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Star, ChatCircle, Certificate, CalendarCheck, Globe, CreditCard } from "@phosphor-icons/react"
import { toast } from "sonner"

interface ProfessionalDialogProps {
  professional: Professional | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfessionalDialog({ professional, open, onOpenChange }: ProfessionalDialogProps) {
  if (!professional) return null

  const handleContact = () => {
    toast.success(`Connection request sent to ${professional.name}!`, {
      description: "They'll receive your message and respond within 24-48 hours."
    })
    onOpenChange(false)
  }

  const getTreatmentColor = (type: string) => {
    if (type === "Alternative") return "bg-accent/20 text-accent-foreground border-accent/30"
    if (type === "Conventional") return "bg-primary/20 text-primary-foreground border-primary/30"
    return "bg-secondary text-secondary-foreground border-border"
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            weight={star <= Math.floor(rating) ? "fill" : star - 0.5 <= rating ? "fill" : "regular"}
            className={star <= rating ? "text-amber-500" : "text-gray-300"}
          />
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-5 mb-4">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-lg">
                {professional.name.split(' ').map(n => n[0]).join('')}
              </div>
              {professional.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Certificate weight="fill" size={16} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2 flex items-center gap-2">
                {professional.name}
                {professional.isVerified && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </DialogTitle>
              <p className="text-muted-foreground mb-3">{professional.credentials}</p>
              
              <div className="flex items-center gap-3 mb-4">
                {renderStars(professional.rating)}
                <span className="text-lg font-bold text-foreground">{professional.rating}</span>
                <span className="text-sm text-muted-foreground">({professional.reviewCount} reviews)</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {professional.specialty}
                </Badge>
                <Badge variant="outline" className={getTreatmentColor(professional.treatmentType)}>
                  {professional.treatmentType}
                </Badge>
                {professional.isRecommended && (
                  <Badge className="bg-accent text-white">
                    <Star weight="fill" size={14} className="mr-1" />
                    Top Match
                  </Badge>
                )}
                {professional.yearsExperience >= 10 && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                    {professional.yearsExperience}+ Years Experience
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={18} weight="fill" className="text-primary flex-shrink-0" />
                  <span>{professional.location.city}, {professional.location.state}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={18} weight="fill" className="text-primary flex-shrink-0" />
                  <span>{professional.availability}</span>
                </div>
                <div className="flex items-center gap-2">
                  {professional.acceptingNewClients ? (
                    <>
                      <CalendarCheck size={18} weight="fill" className="text-green-600 flex-shrink-0" />
                      <span className="font-medium text-green-700">Accepting New Clients</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck size={18} className="text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Waitlist Only</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              About
            </h4>
            <p className="text-foreground leading-relaxed">{professional.bio}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Treatment Philosophy
            </h4>
            <p className="text-foreground leading-relaxed italic bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
              "{professional.philosophy}"
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Specializes In
            </h4>
            <div className="flex flex-wrap gap-2">
              {professional.conditions.map((condition) => (
                <Badge 
                  key={condition} 
                  variant="secondary"
                  className="text-sm"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Globe size={18} weight="fill" className="text-primary" />
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {professional.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="text-sm">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CreditCard size={18} weight="fill" className="text-primary" />
                Insurance Accepted
              </h4>
              {professional.insuranceAccepted.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {professional.insuranceAccepted.map((insurance) => (
                    <Badge key={insurance} variant="outline" className="text-sm">
                      {insurance}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Private pay only</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-br from-muted/30 to-muted/10 p-5 rounded-lg border border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1.5 font-medium">Experience</p>
              <p className="font-semibold text-foreground text-lg">{professional.experience}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1.5 font-medium">Availability</p>
              <p className="font-semibold text-foreground text-lg">{professional.availability}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1"
              size="lg"
              onClick={handleContact}
              disabled={!professional.acceptingNewClients}
            >
              <ChatCircle size={20} weight="fill" className="mr-2" />
              {professional.acceptingNewClients ? "Send Message" : "Join Waitlist"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
