import { FilterState, Specialty, TreatmentType, Condition } from "@/lib/types"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FunnelSimple, X, MagnifyingGlass, MapPin } from "@phosphor-icons/react"

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onReset: () => void
}

export function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
  const specialties: (Specialty | "All")[] = [
    "All",
    "Speech Therapy",
    "Sensory Integration",
    "Occupational Therapy",
    "Behavioral Therapy",
    "Yoga & Mindfulness",
    "Acupuncture",
    "Physical Therapy",
    "Music Therapy",
    "Art Therapy"
  ]

  const treatmentTypes: (TreatmentType | "All")[] = ["All", "Conventional", "Alternative", "Both"]

  const conditions: (Condition | "All")[] = [
    "All",
    "Autism Spectrum Disorder",
    "Dyslexia",
    "ADHD",
    "Developmental Delays",
    "Sensory Processing",
    "Anxiety",
    "Speech Delays"
  ]

  const hasActiveFilters = 
    filters.specialty !== "All" ||
    filters.treatmentType !== "All" ||
    filters.condition !== "All" ||
    filters.location !== "" ||
    filters.search !== ""

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.specialty !== "All") count++
    if (filters.treatmentType !== "All") count++
    if (filters.condition !== "All") count++
    if (filters.location !== "") count++
    if (filters.search !== "") count++
    return count
  }

  const removeFilter = (filterKey: keyof FilterState) => {
    if (filterKey === "search" || filterKey === "location") {
      onFilterChange({ ...filters, [filterKey]: "" })
    } else {
      onFilterChange({ ...filters, [filterKey]: "All" })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center ring-1 ring-primary/20 shadow-sm">
            <FunnelSimple size={16} weight="bold" className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Filters</h2>
            {hasActiveFilters && (
              <p className="text-[10px] text-muted-foreground font-medium">{getActiveFilterCount()} active</p>
            )}
          </div>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground h-7 text-xs rounded-lg px-2.5"
          >
            <X size={13} className="mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <div>
              <Label htmlFor="search" className="text-xs font-semibold mb-2 block text-foreground">
                Search
              </Label>
              <div className="relative">
                <MagnifyingGlass 
                  size={16} 
                  weight="bold"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="search"
                  placeholder="Name or keyword..."
                  value={filters.search}
                  onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                  className="pl-10 h-10 text-sm rounded-lg border-border/50 focus:border-primary/40 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialty" className="text-xs font-semibold mb-2 block text-foreground">
                Specialty
              </Label>
              <Select
                value={filters.specialty}
                onValueChange={(value) => 
                  onFilterChange({ ...filters, specialty: value as Specialty | "All" })
                }
              >
                <SelectTrigger id="specialty" className="h-10 text-sm rounded-lg border-border/50 focus:border-primary/40 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="treatmentType" className="text-xs font-semibold mb-2 block text-foreground">
                Treatment Type
              </Label>
              <Select
                value={filters.treatmentType}
                onValueChange={(value) => 
                  onFilterChange({ ...filters, treatmentType: value as TreatmentType | "All" })
                }
              >
                <SelectTrigger id="treatmentType" className="h-10 text-sm rounded-lg border-border/50 focus:border-primary/40 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {treatmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="condition" className="text-xs font-semibold mb-2 block text-foreground">
                Condition
              </Label>
              <Select
                value={filters.condition}
                onValueChange={(value) => 
                  onFilterChange({ ...filters, condition: value as Condition | "All" })
                }
              >
                <SelectTrigger id="condition" className="h-10 text-sm rounded-lg border-border/50 focus:border-primary/40 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="text-xs font-semibold mb-2 block text-foreground">
                Location
              </Label>
              <div className="relative">
                <MapPin 
                  size={16} 
                  weight="fill"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="location"
                  placeholder="City or State..."
                  value={filters.location}
                  onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                  className="pl-10 h-10 text-sm rounded-lg border-border/50 focus:border-primary/40 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="pt-3 border-t border-border/30">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active:</span>
                {filters.search && (
                  <Badge variant="secondary" className="gap-1.5 text-[11px] font-medium pr-2 bg-secondary/70 rounded-lg">
                    Search: {filters.search}
                    <button
                      onClick={() => removeFilter("search")}
                      className="ml-0.5 hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </Badge>
                )}
                {filters.specialty !== "All" && (
                  <Badge variant="secondary" className="gap-1.5 text-[11px] font-medium pr-2 bg-secondary/70 rounded-lg">
                    {filters.specialty}
                    <button
                      onClick={() => removeFilter("specialty")}
                      className="ml-0.5 hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </Badge>
                )}
                {filters.treatmentType !== "All" && (
                  <Badge variant="secondary" className="gap-1.5 text-[11px] font-medium pr-2 bg-secondary/70 rounded-lg">
                    {filters.treatmentType}
                    <button
                      onClick={() => removeFilter("treatmentType")}
                      className="ml-0.5 hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </Badge>
                )}
                {filters.condition !== "All" && (
                  <Badge variant="secondary" className="gap-1.5 text-[11px] font-medium pr-2 bg-secondary/70 rounded-lg">
                    {filters.condition}
                    <button
                      onClick={() => removeFilter("condition")}
                      className="ml-0.5 hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="secondary" className="gap-1.5 text-[11px] font-medium pr-2 bg-secondary/70 rounded-lg">
                    {filters.location}
                    <button
                      onClick={() => removeFilter("location")}
                      className="ml-0.5 hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
    </div>
  )
}
