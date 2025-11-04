import { Professional } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Certificate, Clock, Sparkle } from "@phosphor-icons/react"

interface ProfessionalCardProps {
  professional: Professional
  onClick: () => void
  isFirstPlace?: boolean
  rank?: number
}

export function ProfessionalCard({ professional, onClick, isFirstPlace = false, rank }: ProfessionalCardProps) {
  const getTreatmentColor = (type: string) => {
    if (type === "Alternative") return "bg-accent/12 text-accent-foreground/90 border-accent/20"
    if (type === "Conventional") return "bg-primary/10 text-primary border-primary/20"
    return "bg-secondary text-secondary-foreground border-border"
  }

  const getTierConfig = (rankNum: number) => {
    if (rankNum === 1) return { label: "Top Match", gradient: "from-primary via-primary/95 to-primary/90", textColor: "text-white", icon: <Sparkle weight="fill" size={14} /> }
    if (rankNum === 2) return { label: "Great Match", gradient: "from-accent via-accent/95 to-accent/90", textColor: "text-white", icon: <Star weight="fill" size={13} /> }
    if (rankNum === 3) return { label: "Good Match", gradient: "from-primary/80 via-primary/75 to-primary/70", textColor: "text-white", icon: <Star weight="fill" size={13} /> }
    return null
  }

  const tierConfig = rank ? getTierConfig(rank) : null

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            weight={star <= Math.floor(rating) ? "fill" : star - 0.5 <= rating ? "fill" : "regular"}
            className={star <= rating ? "text-amber-500" : "text-border"}
          />
        ))}
      </div>
    )
  }

  return (
    <Card 
      className={`group relative p-6 cursor-pointer transition-all duration-500 hover:shadow-xl overflow-hidden h-full flex flex-col ${
        isFirstPlace 
          ? "border-2 border-primary/30 bg-gradient-to-br from-primary/[0.03] via-card to-card shadow-lg ring-2 ring-primary/10 hover:shadow-2xl hover:ring-primary/20 hover:scale-[1.02] hover:border-primary/40" 
          : "border border-border/50 hover:border-primary/25 bg-card hover:scale-[1.01] hover:shadow-lg"
      }`}
      onClick={onClick}
      style={{
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {tierConfig ? (
        <div className={`absolute top-0 right-0 bg-gradient-to-l ${tierConfig.gradient} ${tierConfig.textColor} px-4 py-1.5 text-[11px] font-bold flex items-center gap-1.5 rounded-bl-xl shadow-lg uppercase tracking-wide border-l border-b border-white/20`}>
          {tierConfig.icon}
          {tierConfig.label}
        </div>
      ) : isFirstPlace ? (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-primary via-primary/95 to-primary/90 text-white px-4 py-1.5 text-[11px] font-bold flex items-center gap-1.5 rounded-bl-xl shadow-lg uppercase tracking-wide border-l border-b border-white/20">
          <Sparkle weight="fill" size={13} />
          Best Match
        </div>
      ) : professional.isRecommended ? (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-accent via-accent/95 to-accent/90 text-white px-3.5 py-1 text-[10px] font-bold flex items-center gap-1 rounded-bl-lg shadow-md uppercase tracking-wide border-l border-b border-white/15">
          <Star weight="fill" size={11} />
          Top Match
        </div>
      ) : null}
      
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            {professional.imageUrl ? (
              <img 
                src={professional.imageUrl} 
                alt={professional.name}
                className="w-16 h-16 rounded-xl object-cover shadow-md ring-2 ring-border/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-lg font-bold shadow-md ring-2 ring-primary/15">
                {professional.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            {professional.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-primary/90 rounded-full flex items-center justify-center shadow-lg border-2 border-card">
                <Certificate weight="fill" size={11} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-bold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
              {professional.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-2.5 leading-tight">
              {professional.credentials}
            </p>
            
            <div className="flex items-center gap-1.5 mb-2">
              {renderStars(professional.rating)}
              <span className="text-sm font-bold text-foreground">{professional.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({professional.reviewCount})</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2.5">
              <MapPin size={14} weight="fill" className="text-primary/60 flex-shrink-0" />
              <span className="truncate">{professional.location.city}, {professional.location.state}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="bg-primary/[0.07] text-primary border-primary/20 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                {professional.specialty}
              </Badge>
              <Badge variant="outline" className={`${getTreatmentColor(professional.treatmentType)} text-[11px] font-medium px-2.5 py-0.5 rounded-md`}>
                {professional.treatmentType}
              </Badge>
              {professional.yearsExperience >= 10 && (
                <Badge variant="outline" className="bg-accent/[0.08] text-accent border-accent/20 text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                  {professional.yearsExperience}+ Yrs
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isFirstPlace && (
          <div className="mb-2 px-4 py-2.5 bg-primary/[0.06] border-l-4 border-primary rounded-lg">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Sparkle weight="fill" size={13} className="text-primary" />
              Why this match?
            </p>
            <p className="text-xs text-foreground/75 leading-relaxed">
              Highest rated specialist in your area with immediate availability and {professional.yearsExperience}+ years of focused experience.
            </p>
          </div>
        )}
        
        <p className="text-[13px] text-foreground/75 line-clamp-2 leading-relaxed">
          {professional.bio}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {professional.conditions.slice(0, 3).map((condition) => (
            <Badge 
              key={condition} 
              variant="secondary"
              className="text-[10px] font-medium px-2.5 py-0.5 bg-secondary/70 rounded-md"
            >
              {condition}
            </Badge>
          ))}
          {professional.conditions.length > 3 && (
            <Badge variant="secondary" className="text-[10px] font-medium px-2.5 py-0.5 bg-secondary/70 rounded-md">
              +{professional.conditions.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-border/30 mt-auto">
          <div className="flex items-center gap-1.5">
            {professional.acceptingNewClients ? (
              <>
                <div className="w-2 h-2 rounded-full bg-success flex-shrink-0 shadow-sm shadow-success/40 animate-pulse"></div>
                <span className="text-xs font-semibold text-success">Accepting Clients</span>
              </>
            ) : (
              <>
                <Clock size={15} weight="bold" className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">Waitlist</span>
              </>
            )}
          </div>
          <div className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1">
            View Profile
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
