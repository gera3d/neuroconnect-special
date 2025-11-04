import { Professional } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Certificate, Sparkle } from "@phosphor-icons/react"

interface ProfessionalCardProps {
  professional: Professional
  onClick: () => void
  isFirstPlace?: boolean
  rank?: number
}

export function ProfessionalCard({ professional, onClick, isFirstPlace = false, rank }: ProfessionalCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            weight={star <= Math.floor(rating) ? "fill" : star - 0.5 <= rating ? "fill" : "regular"}
            className={star <= rating ? "text-amber-500" : "text-border"}
          />
        ))}
      </div>
    )
  }

  const getBadgeVariant = () => {
    if (rank === 1) return "bg-primary text-primary-foreground"
    if (rank === 2) return "bg-accent text-accent-foreground"
    if (rank === 3) return "bg-primary/80 text-primary-foreground"
    return null
  }

  const badgeVariant = getBadgeVariant()

  return (
    <Card 
      className={`group relative p-5 cursor-pointer transition-all duration-300 overflow-hidden h-full flex flex-col border ${
        isFirstPlace 
          ? "border-primary/40 bg-gradient-to-br from-primary/[0.02] to-transparent shadow-md hover:shadow-lg hover:border-primary/60" 
          : "border-border hover:border-primary/30 bg-card hover:shadow-md"
      }`}
      onClick={onClick}
    >
      {badgeVariant && (
        <div className={`absolute top-0 right-0 ${badgeVariant} px-3 py-1 text-[10px] font-semibold flex items-center gap-1 rounded-bl-lg uppercase tracking-wide`}>
          {rank === 1 && <Sparkle weight="fill" size={11} />}
          {rank === 1 && "Best Match"}
          {rank === 2 && "Great Match"}
          {rank === 3 && "Good Match"}
        </div>
      )}
      
      <div className="flex flex-col gap-3.5 flex-1">
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            {professional.imageUrl ? (
              <img 
                src={professional.imageUrl} 
                alt={professional.name}
                className="w-14 h-14 rounded-lg object-cover border border-border/50"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary text-base font-semibold border border-primary/20">
                {professional.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            {professional.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-card">
                <Certificate weight="fill" size={10} className="text-primary-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground leading-snug mb-0.5 group-hover:text-primary transition-colors">
              {professional.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              {professional.credentials}
            </p>
            
            <div className="flex items-center gap-1.5 mb-2">
              {renderStars(professional.rating)}
              <span className="text-sm font-semibold text-foreground">{professional.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({professional.reviewCount})</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={13} weight="fill" className="text-primary/70 flex-shrink-0" />
              <span className="truncate">{professional.location.city}, {professional.location.state}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed">
          {professional.bio}
        </p>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="bg-primary/[0.08] text-primary border-primary/25 text-xs font-medium px-2 py-0.5 rounded-md">
            {professional.specialty}
          </Badge>
          {professional.yearsExperience >= 10 && (
            <Badge variant="outline" className="bg-accent/[0.08] text-accent border-accent/25 text-xs font-medium px-2 py-0.5 rounded-md">
              {professional.yearsExperience}+ Years
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {professional.conditions.slice(0, 3).map((condition) => (
            <Badge 
              key={condition} 
              variant="secondary"
              className="text-[11px] font-normal px-2 py-0 bg-secondary/80 rounded-md"
            >
              {condition}
            </Badge>
          ))}
          {professional.conditions.length > 3 && (
            <Badge variant="secondary" className="text-[11px] font-normal px-2 py-0 bg-secondary/80 rounded-md">
              +{professional.conditions.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-1.5">
            {professional.acceptingNewClients ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0 animate-pulse"></div>
                <span className="text-xs font-medium text-success">Accepting Clients</span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground font-medium">Waitlist</span>
            )}
          </div>
          <div className="text-xs font-medium text-primary group-hover:underline">
            View Profile →
          </div>
        </div>
      </div>
    </Card>
  )
}
