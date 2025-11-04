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
import { Sparkle } from "@phosphor-icons/react"

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
          <div className="h-[calc(100vh-140px)] flex-shrink-0"></div>
          
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl pointer-events-none">
            <div className="bg-card/98 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.08)] rounded-t-2xl border-t border-x border-border/50 pointer-events-auto">
              <div className="px-5 py-5 border-b border-border/40">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-2xl font-semibold text-foreground">
                      {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? "s" : ""}
                    </h2>
                    {filteredProfessionals.filter((p) => p.acceptingNewClients).length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                        <span className="font-medium text-success">
                          {filteredProfessionals.filter((p) => p.acceptingNewClients).length} accepting new clients
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as SortOption)}
                    >
                      <SelectTrigger className="w-[160px] h-9 text-sm rounded-lg border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">
                          <div className="flex items-center gap-2">
                            <Sparkle size={14} weight="fill" />
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
                
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={handleResetFilters}
                />
              </div>

              <div className="px-5 py-5">
                {filteredProfessionals.length === 0 ? (
                  <div className="text-center py-20 px-4">
                    <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-4xl">
                      🔍
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No professionals found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                      Try adjusting your filters to find the right specialist.
                    </p>
                    <Button onClick={handleResetFilters} variant="outline" size="sm" className="rounded-lg">
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pb-8">
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
