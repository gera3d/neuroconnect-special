import { useState, useMemo } from "react"
import { FilterState, Professional } from "@/lib/types"
import { mockProfessionals } from "@/lib/mockData"
import { FilterSidebar } from "./FilterSidebar"
import { ProfessionalCard } from "./ProfessionalCard"
import { ProfessionalDialog } from "./ProfessionalDialog"
import { PracticeMap } from "./PracticeMap"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { SortAscending, Sparkle, MapTrifold } from "@phosphor-icons/react"

type SortOption = "recommended" | "rating" | "reviews" | "experience"

export function DirectorySection() {
  const [filters, setFilters] = useState<FilterState>({
    specialty: "All",
    treatmentType: "All",
    condition: "All",
    location: "",
    search: "",
  })

  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedProfessionalRank, setSelectedProfessionalRank] = useState<number | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("recommended")

  const filteredProfessionals = useMemo(() => {
    let filtered = mockProfessionals.filter((professional) => {
      if (filters.specialty !== "All" && professional.specialty !== filters.specialty) {
        return false
      }

      if (
        filters.treatmentType !== "All" &&
        professional.treatmentType !== filters.treatmentType
      ) {
        return false
      }

      if (filters.condition !== "All" && !professional.conditions.includes(filters.condition)) {
        return false
      }

      if (filters.location) {
        const locationSearch = filters.location.toLowerCase()
        const locationMatch =
          professional.location.city.toLowerCase().includes(locationSearch) ||
          professional.location.state.toLowerCase().includes(locationSearch)
        if (!locationMatch) return false
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchMatch =
          professional.name.toLowerCase().includes(searchLower) ||
          professional.specialty.toLowerCase().includes(searchLower) ||
          professional.bio.toLowerCase().includes(searchLower)
        if (!searchMatch) return false
      }

      return true
    })

    filtered.sort((a, b) => {
      if (sortBy === "recommended") {
        if (a.isRecommended && !b.isRecommended) return -1
        if (!a.isRecommended && b.isRecommended) return 1
        return b.rating - a.rating
      } else if (sortBy === "rating") {
        return b.rating - a.rating
      } else if (sortBy === "reviews") {
        return b.reviewCount - a.reviewCount
      } else if (sortBy === "experience") {
        return b.yearsExperience - a.yearsExperience
      }
      return 0
    })

    return filtered
  }, [filters, sortBy])

  const handleResetFilters = () => {
    setFilters({
      specialty: "All",
      treatmentType: "All",
      condition: "All",
      location: "",
      search: "",
    })
  }

  const handleCardClick = (professional: Professional, rank?: number) => {
    setSelectedProfessional(professional)
    setSelectedProfessionalRank(rank)
    setDialogOpen(true)
  }

  return (
    <>
      <main className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PracticeMap 
            professionals={filteredProfessionals}
            rankedMode={true}
            onMarkerClick={handleCardClick}
            isDialogOpen={dialogOpen}
          />
        </div>

        <div 
          className="absolute inset-0 z-10 overflow-y-auto scroll-smooth pointer-events-none"
        >
          <div className="h-[calc(100vh-160px)] flex-shrink-0"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pointer-events-none">
            <div className="bg-card backdrop-blur-xl shadow-[0_-12px_48px_rgba(0,0,0,0.12)] rounded-t-3xl border-t border-x border-border/40 pointer-events-auto">
              <div className="bg-gradient-to-b from-primary/[0.03] via-primary/[0.015] to-transparent backdrop-blur-sm border-b border-border/30 px-6 py-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/15 shadow-sm">
                    <MapTrifold size={24} weight="duotone" className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h3 className="text-xl font-bold text-foreground tracking-tight">
                          {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? "s" : ""} Found
                        </h3>
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <SortAscending
                            size={19}
                            className="text-muted-foreground hidden sm:block"
                            weight="bold"
                          />
                          <Select
                            value={sortBy}
                            onValueChange={(value) => setSortBy(value as SortOption)}
                          >
                            <SelectTrigger className="w-[180px] h-9 rounded-lg border-border/50 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="recommended">
                                <div className="flex items-center gap-2">
                                  <Sparkle size={15} weight="fill" />
                                  Best Match
                                </div>
                              </SelectItem>
                              <SelectItem value="rating">Highest Rated</SelectItem>
                              <SelectItem value="reviews">Most Reviews</SelectItem>
                              <SelectItem value="experience">Most Experience</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {filteredProfessionals.length > 0 && (
                        <p className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/40"></span>
                            <span className="font-medium">Top Match</span>
                          </span>
                          {filteredProfessionals.filter((p) => p.acceptingNewClients).length > 0 && (
                            <>
                              <span className="text-muted-foreground/30">•</span>
                              <span className="inline-flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-success shadow-sm shadow-success/40 animate-pulse"></div>
                                <span className="font-semibold text-success">
                                  {filteredProfessionals.filter((p) => p.acceptingNewClients).length}
                                </span>
                                <span>accepting clients</span>
                              </span>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                    
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={setFilters}
                      onReset={handleResetFilters}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">

                {filteredProfessionals.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-card rounded-xl border border-border/50 shadow-sm">
                    <div className="w-24 h-24 rounded-2xl bg-muted/40 mx-auto mb-5 flex items-center justify-center text-5xl border-2 border-border/30">
                      🔍
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      No professionals found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                      Try adjusting your filters or search criteria to find the right specialist for
                      your needs.
                    </p>
                    <Button onClick={handleResetFilters} variant="outline" size="sm" className="rounded-lg">
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 pb-12">
                    {filteredProfessionals.map((professional, index) => (
                      <ProfessionalCard
                        key={professional.id}
                        professional={professional}
                        onClick={() => handleCardClick(professional, index < 3 ? index + 1 : undefined)}
                        isFirstPlace={index === 0}
                        rank={index < 3 ? index + 1 : undefined}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

      <ProfessionalDialog
        professional={selectedProfessional}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rank={selectedProfessionalRank}
      />
    </>
  )
}
