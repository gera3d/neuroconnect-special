import { useState, useMemo } from "react"
import { FilterState, Professional } from "./lib/types"
import { mockProfessionals } from "./lib/mockData"
import { FilterSidebar } from "./components/FilterSidebar"
import { ProfessionalCard } from "./components/ProfessionalCard"
import { ProfessionalDialog } from "./components/ProfessionalDialog"
import { HelpDialog } from "./components/HelpDialog"
import { MainNav } from "./components/MainNav"
import { Toaster } from "./components/ui/sonner"
import { Button } from "./components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"
import { motion } from "framer-motion"
import { SortAscending, Sparkle } from "@phosphor-icons/react"

type SortOption = "recommended" | "rating" | "reviews" | "experience"

function App() {
  const [filters, setFilters] = useState<FilterState>({
    specialty: "All",
    treatmentType: "All",
    condition: "All",
    location: "",
    search: ""
  })

  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("recommended")

  const filteredProfessionals = useMemo(() => {
    let filtered = mockProfessionals.filter((professional) => {
      if (filters.specialty !== "All" && professional.specialty !== filters.specialty) {
        return false
      }

      if (filters.treatmentType !== "All" && professional.treatmentType !== filters.treatmentType) {
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
      search: ""
    })
  }

  const handleCardClick = (professional: Professional) => {
    setSelectedProfessional(professional)
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/60 sticky top-0 z-20 backdrop-blur-md bg-card/95 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xl font-bold shadow-md ring-1 ring-primary/20">
                🧠
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  NeuroConnect
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Find specialized support for neurodivergent needs
                </p>
              </div>
            </div>
            <MainNav onHelpClick={() => setHelpDialogOpen(true)} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-6 lg:gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          <div className="min-w-0">
            <div className="mb-5 bg-card border border-border/60 rounded-lg p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 tracking-tight">
                    {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? 's' : ''}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Browse specialists who can support your family
                  </p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <SortAscending size={18} className="text-muted-foreground hidden sm:block" weight="bold" />
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
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
              
              {filteredProfessionals.filter(p => p.acceptingNewClients).length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="font-semibold text-success">
                    {filteredProfessionals.filter(p => p.acceptingNewClients).length}
                  </span>
                  <span className="text-muted-foreground">accepting new clients</span>
                </div>
              )}
            </div>

            {filteredProfessionals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 sm:py-16 px-4"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted/50 mx-auto mb-4 flex items-center justify-center text-4xl sm:text-5xl border-2 border-border/40">
                  🔍
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  No professionals found
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                  Try adjusting your filters or search criteria to find the right specialist for your needs.
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
                    transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
                  >
                    <ProfessionalCard
                      professional={professional}
                      onClick={() => handleCardClick(professional)}
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

      <HelpDialog
        open={helpDialogOpen}
        onOpenChange={setHelpDialogOpen}
      />

      <Toaster richColors position="top-center" />
    </div>
  )
}

export default App
