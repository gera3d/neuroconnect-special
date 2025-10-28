import { Professional } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star } from "@phosphor-icons/react"
import { motion } from "framer-motion"

interface ProfessionalCardProps {
  professional: Professional
  onClick: () => void
}

export function ProfessionalCard({ professional, onClick }: ProfessionalCardProps) {
  const getTreatmentColor = (type: string) => {
    if (type === "Alternative") return "bg-accent/20 text-accent-foreground border-accent/30"
    if (type === "Conventional") return "bg-primary/20 text-primary-foreground border-primary/30"
    return "bg-secondary text-secondary-foreground border-border"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card 
        className="p-6 cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary/30 relative overflow-hidden"
        onClick={onClick}
      >
        {professional.isRecommended && (
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-sm font-medium flex items-center gap-1 rounded-bl-lg">
            <Star weight="fill" size={16} />
            Featured Match
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xl font-semibold flex-shrink-0">
              {professional.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {professional.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {professional.credentials}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin size={16} weight="fill" className="text-primary" />
                {professional.location.city}, {professional.location.state}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {professional.specialty}
            </Badge>
            <Badge variant="outline" className={getTreatmentColor(professional.treatmentType)}>
              {professional.treatmentType}
            </Badge>
          </div>

          <p className="text-sm text-foreground line-clamp-2">
            {professional.bio}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {professional.conditions.slice(0, 3).map((condition) => (
              <Badge 
                key={condition} 
                variant="secondary"
                className="text-xs"
              >
                {condition}
              </Badge>
            ))}
            {professional.conditions.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{professional.conditions.length - 3} more
              </Badge>
            )}
          </div>

          <Button 
            className="w-full mt-2"
            variant="default"
          >
            View Full Profile
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
