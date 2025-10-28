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
import { MapPin, Clock, Star, Envelope, Certificate, Globe, CreditCard } from "@phosphor-icons/react"
import { toast } from "sonner"

interface ProfessionalDialogProps {
  professional: Professional | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfessionalDialog({ professional, open, onOpenChange }: ProfessionalDialogProps) {
  if (!professional) return null

  const handleContact = () => {
    if (professional.acceptingNewClients) {
      toast.success(`Message sent to ${professional.name}!`, {
        description: "They'll respond within 24-48 hours."
      })
    } else {
      toast.success(`Added to ${professional.name}'s waitlist!`, {
        description: "You'll be notified when they have availability."
      })
    }
    onOpenChange(false)
  }

  const getTreatmentColor = (type: string) => {
    if (type === "Alternative") return "bg-accent/15 text-accent-foreground/90 border-accent/25"
    if (type === "Conventional") return "bg-primary/12 text-primary border-primary/25"
    return "bg-secondary text-secondary-foreground border-border"
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            weight={star <= Math.floor(rating) ? "fill" : star - 0.5 <= rating ? "fill" : "regular"}
            className={star <= rating ? "text-amber-500" : "text-border"}
          />
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/75 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-md ring-1 ring-primary/10">
                {professional.name.split(' ').map(n => n[0]).join('')}
              </div>
              {professional.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-[3px] border-card">
                  <Certificate weight="fill" size={14} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl mb-1 flex items-center gap-2 flex-wrap">
                {professional.name}
                {professional.isVerified && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    Verified
                  </span>
                )}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mb-3">{professional.credentials}</p>
              
              <div className="flex items-center gap-2.5 mb-3">
                {renderStars(professional.rating)}
                <span className="text-lg font-bold text-foreground">{professional.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({professional.reviewCount} reviews)</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-primary/8 text-primary border-primary/20 text-xs font-semibold">
                  {professional.specialty}
                </Badge>
                <Badge variant="outline" className={`${getTreatmentColor(professional.treatmentType)} text-xs font-medium`}>
                  {professional.treatmentType}
                </Badge>
                {professional.isRecommended && (
                  <Badge className="bg-accent text-white text-xs font-bold">
                    <Star weight="fill" size={12} className="mr-1" />
                    Top Match
                  </Badge>
                )}
                {professional.yearsExperience >= 10 && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-medium">
                    {professional.yearsExperience}+ Years
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} weight="fill" className="text-primary/70 flex-shrink-0" />
                  <span className="text-xs">{professional.location.city}, {professional.location.state}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} weight="fill" className="text-primary/70 flex-shrink-0" />
                  <span className="text-xs">{professional.availability}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  {professional.acceptingNewClients ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-success flex-shrink-0 animate-pulse"></div>
                      <span className="font-semibold text-success text-xs">Accepting New Clients</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground text-xs font-medium">Waitlist Only</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div>
            <h4 className="font-bold text-foreground mb-2.5 flex items-center gap-2 text-sm">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              About
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed">{professional.bio}</p>
          </div>

          <Separator className="my-4" />

          <div>
            <h4 className="font-bold text-foreground mb-2.5 flex items-center gap-2 text-sm">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              Treatment Philosophy
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed italic bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
              "{professional.philosophy}"
            </p>
          </div>

          <Separator className="my-4" />

          <div>
            <h4 className="font-bold text-foreground mb-2.5 flex items-center gap-2 text-sm">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              Specializes In
            </h4>
            <div className="flex flex-wrap gap-2">
              {professional.conditions.map((condition) => (
                <Badge 
                  key={condition} 
                  variant="secondary"
                  className="text-xs font-medium bg-secondary/70"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h4 className="font-bold text-foreground mb-2.5 flex items-center gap-2 text-sm">
                <Globe size={16} weight="fill" className="text-primary/70" />
                Languages
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {professional.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs font-medium">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-2.5 flex items-center gap-2 text-sm">
                <CreditCard size={16} weight="fill" className="text-primary/70" />
                Insurance Accepted
              </h4>
              {professional.insuranceAccepted.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {professional.insuranceAccepted.map((insurance) => (
                    <Badge key={insurance} variant="outline" className="text-xs font-medium">
                      {insurance}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Private pay only</p>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-br from-muted/40 to-muted/20 p-5 rounded-lg border border-border/40">
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Experience</p>
              <p className="font-bold text-foreground text-base">{professional.experience}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Availability</p>
              <p className="font-bold text-foreground text-base">{professional.availability}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              className="flex-1 h-11"
              onClick={handleContact}
            >
              <Envelope size={18} weight="bold" className="mr-2" />
              {professional.acceptingNewClients ? "Send Message" : "Join Waitlist"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
