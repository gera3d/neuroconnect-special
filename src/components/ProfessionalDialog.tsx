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
import { MapPin, Clock, Star, ChatCircle } from "@phosphor-icons/react"
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-semibold flex-shrink-0">
              {professional.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{professional.name}</DialogTitle>
              <p className="text-muted-foreground mb-3">{professional.credentials}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {professional.specialty}
                </Badge>
                <Badge variant="outline" className={getTreatmentColor(professional.treatmentType)}>
                  {professional.treatmentType}
                </Badge>
                {professional.isRecommended && (
                  <Badge className="bg-accent text-accent-foreground">
                    <Star weight="fill" size={14} className="mr-1" />
                    Featured Match
                  </Badge>
                )}
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={18} weight="fill" className="text-primary" />
                  {professional.location.city}, {professional.location.state}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={18} weight="fill" className="text-primary" />
                  {professional.availability}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-2">About</h4>
            <p className="text-foreground leading-relaxed">{professional.bio}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-foreground mb-2">Treatment Philosophy</h4>
            <p className="text-foreground leading-relaxed italic">{professional.philosophy}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-foreground mb-3">Specializes In</h4>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Experience</p>
              <p className="font-medium text-foreground">{professional.experience}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Availability</p>
              <p className="font-medium text-foreground">{professional.availability}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1"
              size="lg"
              onClick={handleContact}
            >
              <ChatCircle size={20} weight="fill" className="mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
