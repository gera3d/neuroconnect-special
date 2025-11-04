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
    if (type === "Alternative") return "bg-accent/15 text-accent-foreground/90 border-accent/25"
    if (type === "Conventional") return "bg-primary/12 text-primary border-primary/25"
    return "bg-secondary text-secondary-foreground border-border"
  }

  const getTierConfig = (rankNum: number) => {
    if (rankNum === 1) return { medal: "🥇", label: "Gold Tier", gradient: "from-[#FFD700] to-[#FFC700]", textColor: "text-white" }
    if (rankNum === 2) return { medal: "🥈", label: "Silver Tier", gradient: "from-[#C0C0C0] to-[#B8B8B8]", textColor: "text-white" }
    if (rankNum === 3) return { medal: "🥉", label: "Bronze Tier", gradient: "from-[#CD7F32] to-[#B87333]", textColor: "text-white" }
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
      className={`group relative p-5 cursor-pointer transition-all duration-500 hover:shadow-lg overflow-hidden h-full flex flex-col backdrop-blur-sm ${
        isFirstPlace 
          ? "border-2 border-accent/40 bg-gradient-to-br from-accent/5 via-card/95 to-card/95 shadow-md ring-2 ring-accent/20 hover:shadow-xl hover:ring-accent/30 hover:scale-[1.02]" 
          : "border-border/60 hover:border-primary/30 bg-card/95 hover:scale-[1.01]"
      }`}
      onClick={onClick}
    >
      {tierConfig ? (
        <div className={`absolute top-0 right-0 bg-gradient-to-l ${tierConfig.gradient} ${tierConfig.textColor} px-4 py-1.5 text-[11px] font-bold flex items-center gap-1.5 rounded-bl-lg shadow-lg uppercase tracking-wide`}>
          <span className="text-base">{tierConfig.medal}</span>
          {tierConfig.label}
        </div>
      ) : isFirstPlace ? (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-accent via-accent/95 to-accent/90 text-white px-4 py-1.5 text-[11px] font-bold flex items-center gap-1.5 rounded-bl-lg shadow-md uppercase tracking-wide">
          <Sparkle weight="fill" size={13} />
          Best Match
        </div>
      ) : professional.isRecommended ? (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-accent via-accent/95 to-accent/90 text-white px-3 py-1 text-[10px] font-bold flex items-center gap-1 rounded-bl-md shadow-sm uppercase tracking-wide">
          <Star weight="fill" size={11} />
          Top Match
        </div>
      ) : null}
      
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            {professional.imageUrl ? (
              <img 
                src={professional.imageUrl} 
                alt={professional.name}
                className="w-14 h-14 rounded-full object-cover shadow-sm ring-1 ring-border/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/75 flex items-center justify-center text-primary-foreground text-lg font-bold shadow-sm ring-1 ring-primary/10">
                {professional.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            {professional.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-md border-2 border-card">
                <Certificate weight="fill" size={10} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground leading-snug mb-0.5 group-hover:text-primary transition-colors">
              {professional.name}
            </h3>
            <p className="text-[11px] text-muted-foreground mb-2 leading-tight">
              {professional.credentials}
            </p>
            
            <div className="flex items-center gap-1.5 mb-1.5">
              {renderStars(professional.rating)}
              <span className="text-sm font-bold text-foreground">{professional.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({professional.reviewCount})</span>
            </div>
            
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-2">
              <MapPin size={13} weight="fill" className="text-primary/70 flex-shrink-0" />
              <span className="truncate">{professional.location.city}, {professional.location.state}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="bg-primary/8 text-primary border-primary/20 text-[11px] font-semibold px-2 py-0">
                {professional.specialty}
              </Badge>
              <Badge variant="outline" className={`${getTreatmentColor(professional.treatmentType)} text-[11px] font-medium px-2 py-0`}>
                {professional.treatmentType}
              </Badge>
              {professional.yearsExperience >= 10 && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[11px] font-medium px-2 py-0">
                  {professional.yearsExperience}+ Yrs
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isFirstPlace && (
          <div className="mb-2 px-3 py-2 bg-accent/10 border-l-3 border-accent rounded-md">
            <p className="text-[11px] font-bold text-accent-foreground/90 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Sparkle weight="fill" size={12} className="text-accent" />
              Why this match?
            </p>
            <p className="text-[12px] text-foreground/80 leading-relaxed">
              Highest rated specialist in your area with immediate availability and {professional.yearsExperience}+ years of focused experience.
            </p>
          </div>
        )}
        
        <p className="text-[13px] text-foreground/80 line-clamp-2 leading-relaxed">
          {professional.bio}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {professional.conditions.slice(0, 3).map((condition) => (
            <Badge 
              key={condition} 
              variant="secondary"
              className="text-[10px] font-medium px-2 py-0.5 bg-secondary/60"
            >
              {condition}
            </Badge>
          ))}
          {professional.conditions.length > 3 && (
            <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5 bg-secondary/60">
              +{professional.conditions.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-1.5">
            {professional.acceptingNewClients ? (
              <>
                <div className="w-2 h-2 rounded-full bg-success flex-shrink-0 animate-pulse"></div>
                <span className="text-xs font-semibold text-success">Accepting Clients</span>
              </>
            ) : (
              <>
                <Clock size={14} className="text-muted-foreground flex-shrink-0" />
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
