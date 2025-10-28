import { Professional } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Certificate, CalendarCheck } from "@phosphor-icons/react"
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            weight={star <= Math.floor(rating) ? "fill" : star - 0.5 <= rating ? "fill" : "regular"}
            className={star <= rating ? "text-amber-500" : "text-gray-300"}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card 
        className="p-6 cursor-pointer transition-all hover:shadow-lg border hover:border-primary/40 relative overflow-hidden group"
        onClick={onClick}
      >
        {professional.isRecommended && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-accent to-accent/90 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1 rounded-bl-lg shadow-sm">
            <Star weight="fill" size={14} />
            TOP MATCH
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center text-primary-foreground text-xl font-bold shadow-md">
                {professional.name.split(' ').map(n => n[0]).join('')}
              </div>
              {professional.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  <Certificate weight="fill" size={12} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  {professional.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {professional.credentials}
              </p>
              
              <div className="flex items-center gap-2 mb-2">
                {renderStars(professional.rating)}
                <span className="text-sm font-semibold text-foreground">{professional.rating}</span>
                <span className="text-sm text-muted-foreground">({professional.reviewCount})</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={14} weight="fill" className="text-primary flex-shrink-0" />
                <span className="truncate">{professional.location.city}, {professional.location.state}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
              {professional.specialty}
            </Badge>
            <Badge variant="outline" className={`${getTreatmentColor(professional.treatmentType)} text-xs font-medium`}>
              {professional.treatmentType}
            </Badge>
            {professional.yearsExperience >= 10 && (
              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 text-xs font-medium">
                {professional.yearsExperience}+ Years
              </Badge>
            )}
          </div>

          <p className="text-sm text-foreground/90 line-clamp-2 leading-relaxed">
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
                +{professional.conditions.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              {professional.acceptingNewClients ? (
                <>
                  <CalendarCheck size={16} weight="fill" className="text-green-600" />
                  <span className="text-xs font-medium text-green-700">Accepting Clients</span>
                </>
              ) : (
                <>
                  <CalendarCheck size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Waitlist Only</span>
                </>
              )}
            </div>
            <Button 
              size="sm"
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary/10 font-medium group-hover:bg-primary/10"
            >
              View Profile →
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
