import { useState, useMemo } from "react"
import { FilterState, Professional } from "./lib/types"
import { mockProfessionals } from "./lib/mockData"
import { FilterSidebar } from "./components/FilterSidebar"
import { ProfessionalCard } from "./components/ProfessionalCard"
import { ProfessionalDialog } from "./components/ProfessionalDialog"
import { Toaster } from "./components/ui/sonner"
import { motion } from "framer-motion"

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

  const filteredProfessionals = useMemo(() => {
    return mockProfessionals.filter((professional) => {
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
  }, [filters])

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
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
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
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          <div>
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {filteredProfessionals.length} Professional{filteredProfessionals.length !== 1 ? 's' : ''} Found
              </h2>
              <p className="text-muted-foreground">
                Browse specialists who can support your family's unique needs
              </p>
            </motion.div>

            {filteredProfessionals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-4xl">
                  🔍
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No professionals found
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Try adjusting your filters or search criteria to find the right specialist for your needs.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProfessionals.map((professional) => (
                  <ProfessionalCard
                    key={professional.id}
                    professional={professional}
                    onClick={() => handleCardClick(professional)}
                  />
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