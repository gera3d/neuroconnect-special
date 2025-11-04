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

  const handleCardClick = (professional: Professional) => {
    setSelectedProfessional(professional)
    setDialogOpen(true)
  }

  const topProfessionals = useMemo(() => {
    return filteredProfessionals.slice(0, 3)
  }, [filteredProfessionals])

  return (
    <>
      <main className="relative min-h-screen">
        <div className="fixed inset-0 top-[73px] z-0">
          <PracticeMap 
            professionals={topProfessionals}
            rankedMode={true}
            onMarkerClick={handleCardClick}
            isDialogOpen={dialogOpen}
          />
        </div>

        <div className="relative z-10 pt-[60vh]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="bg-background/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.12)] rounded-t-2xl border-t border-x border-border/60">
              <div className="bg-gradient-to-b from-background to-background/80 backdrop-blur-sm border-b border-border/60 px-6 py-4">
                {filteredProfessionals.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapTrifold size={20} weight="bold" className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? "s" : ""} Found
                      </h3>
                      <p className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#FFD700] border border-[#DAA520]"></span>
                          1st
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#C0C0C0] border border-[#A8A8A8]"></span>
                          2nd
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#CD7F32] border border-[#B8732D]"></span>
                          3rd
                        </span>
                        {filteredProfessionals.filter((p) => p.acceptingNewClients).length > 0 && (
                          <>
                            <span className="text-muted-foreground/40">•</span>
                            <span className="inline-flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                              <span className="font-semibold text-success">
                                {filteredProfessionals.filter((p) => p.acceptingNewClients).length}
                              </span>
                              <span>accepting new clients</span>
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] gap-6">
                  <aside>
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={setFilters}
                      onReset={handleResetFilters}
                    />
                  </aside>

                  <div className="min-w-0">
                    <div className="mb-4 bg-card border border-border/60 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="min-w-0">
                          <p className="text-sm text-muted-foreground">
                            Browse specialists who can support your family
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <SortAscending
                            size={18}
                            className="text-muted-foreground hidden sm:block"
                            weight="bold"
                          />
                          <Select
                            value={sortBy}
                            onValueChange={(value) => setSortBy(value as SortOption)}
                          >
                            <SelectTrigger className="w-full sm:w-[170px] h-9">
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
                    </div>

                    {filteredProfessionals.length === 0 ? (
                      <div className="text-center py-12 sm:py-16 px-4 bg-card rounded-lg border border-border/60">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted/50 mx-auto mb-4 flex items-center justify-center text-4xl sm:text-5xl border-2 border-border/40">
                          🔍
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                          No professionals found
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                          Try adjusting your filters or search criteria to find the right specialist for
                          your needs.
                        </p>
                        <Button onClick={handleResetFilters} variant="outline" size="sm">
                          Clear All Filters
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 pb-12">
                        {filteredProfessionals.map((professional, index) => (
                          <ProfessionalCard
                            key={professional.id}
                            professional={professional}
                            onClick={() => handleCardClick(professional)}
                            isFirstPlace={index === 0}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ProfessionalDialog
        professional={selectedProfessional}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
