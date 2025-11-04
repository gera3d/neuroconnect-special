import { useState, useMemo } from "react"
import { FilterState, Professional } from "@/lib/types"
import { mockProfessionals } from "@/lib/mockData"
import { FilterSidebar } from "./FilterSidebar"
import { ProfessionalCard } from "./ProfessionalCard"
import { ProfessionalDialog } from "./ProfessionalDialog"
import { PracticeMap } from "./PracticeMap"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { motion } from "framer-motion"
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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {filteredProfessionals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="mb-6 overflow-hidden border-border/60 shadow-sm">
              <motion.div 
                className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <MapTrifold size={20} weight="bold" className="text-primary" />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="text-lg font-bold text-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      Top Professionals in Your Area
                    </motion.h3>
                    <motion.p 
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <span className="inline-flex items-center gap-2 mr-3">
                        <span className="w-3 h-3 rounded-full bg-[#FFD700] border border-[#DAA520]"></span>
                        1st Place
                      </span>
                      <span className="inline-flex items-center gap-2 mr-3">
                        <span className="w-3 h-3 rounded-full bg-[#C0C0C0] border border-[#A8A8A8]"></span>
                        2nd Place
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#CD7F32] border border-[#B8732D]"></span>
                        3rd Place
                      </span>
                    </motion.p>
                  </div>
                </div>
              </motion.div>
              <PracticeMap 
                professionals={topProfessionals}
                rankedMode={true}
                onMarkerClick={handleCardClick}
                isDialogOpen={dialogOpen}
              />
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-6 lg:gap-8">
          <motion.aside 
            className="lg:sticky lg:top-24 lg:self-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </motion.aside>

          <div className="min-w-0">
            <motion.div 
              className="mb-5 bg-card border border-border/60 rounded-lg p-4 sm:p-5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 tracking-tight">
                    {filteredProfessionals.length} Professional
                    {filteredProfessionals.length !== 1 ? "s" : ""}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
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

              {filteredProfessionals.filter((p) => p.acceptingNewClients).length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="font-semibold text-success">
                    {filteredProfessionals.filter((p) => p.acceptingNewClients).length}
                  </span>
                  <span className="text-muted-foreground">accepting new clients</span>
                </div>
              )}
            </motion.div>

            {filteredProfessionals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-center py-12 sm:py-16 px-4"
              >
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
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-5">
                {filteredProfessionals.map((professional, index) => (
                  <motion.div
                    key={professional.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.45 + Math.min(index * 0.06, 0.6),
                      ease: [0.25, 0.4, 0.25, 1]
                    }}
                  >
                    <ProfessionalCard
                      professional={professional}
                      onClick={() => handleCardClick(professional)}
                      isFirstPlace={index === 0}
                    />
                  </motion.div>
                ))}
              </div>
            )}
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
