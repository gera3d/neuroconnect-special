import { useState, useMemo } from "react"
import { FilterState, Professional } from "./lib/types"
import { mockProfessionals } from "./lib/mockData"
import { FilterSidebar } from "./components/FilterSidebar"
import { ProfessionalCard } from "./components/ProfessionalCard"
import { ProfessionalDialog } from "./components/ProfessionalDialog"
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
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              🌈
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                NeuroConnect
              </h1>
              <p className="text-sm text-muted-foreground">
                Find specialized support for neurodivergent needs
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          <div>
            <div className="mb-6 bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? 's' : ''} Found
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Browse specialists who can support your family's unique needs
                  </p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <SortAscending size={20} className="text-muted-foreground" />
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[180px]">
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
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-green-700">
                    {filteredProfessionals.filter(p => p.acceptingNewClients).length}
                  </span> accepting new clients
                </div>
              )}
            </div>

            {filteredProfessionals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-5xl">
                  🔍
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No professionals found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search criteria to find the right specialist for your needs.
                </p>
                <Button onClick={handleResetFilters} variant="outline">
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredProfessionals.map((professional, index) => (
                  <motion.div
                    key={professional.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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

      <Toaster />
    </div>
  )
}

export default App
