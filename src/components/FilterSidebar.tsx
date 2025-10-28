import { FilterState, Specialty, TreatmentType, Condition } from "@/lib/types"
import { Card } from "@/components/ui/card"
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
    <div className="space-y-4">
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FunnelSimple size={20} weight="fill" className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Filters</h2>
              {hasActiveFilters && (
                <p className="text-xs text-muted-foreground">{getActiveFilterCount()} active</p>
              )}
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground h-8"
            >
              <X size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
              Search
            </Label>
            <div className="relative">
              <MagnifyingGlass 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="search"
                placeholder="Name or keyword..."
                value={filters.search}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialty" className="text-sm font-medium mb-2 block">
              Specialty
            </Label>
            <Select
              value={filters.specialty}
              onValueChange={(value) => 
                onFilterChange({ ...filters, specialty: value as Specialty | "All" })
              }
            >
              <SelectTrigger id="specialty">
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
            <Label htmlFor="treatmentType" className="text-sm font-medium mb-2 block">
              Treatment Type
            </Label>
            <Select
              value={filters.treatmentType}
              onValueChange={(value) => 
                onFilterChange({ ...filters, treatmentType: value as TreatmentType | "All" })
              }
            >
              <SelectTrigger id="treatmentType">
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
            <Label htmlFor="condition" className="text-sm font-medium mb-2 block">
              Condition
            </Label>
            <Select
              value={filters.condition}
              onValueChange={(value) => 
                onFilterChange({ ...filters, condition: value as Condition | "All" })
              }
            >
              <SelectTrigger id="condition">
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
            <Label htmlFor="location" className="text-sm font-medium mb-2 block">
              Location
            </Label>
            <div className="relative">
              <MapPin 
                size={18} 
                weight="fill"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="location"
                placeholder="City or State..."
                value={filters.location}
                onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {hasActiveFilters && (
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search}
                <button
                  onClick={() => removeFilter("search")}
                  className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            {filters.specialty !== "All" && (
              <Badge variant="secondary" className="gap-1">
                {filters.specialty}
                <button
                  onClick={() => removeFilter("specialty")}
                  className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            {filters.treatmentType !== "All" && (
              <Badge variant="secondary" className="gap-1">
                {filters.treatmentType}
                <button
                  onClick={() => removeFilter("treatmentType")}
                  className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            {filters.condition !== "All" && (
              <Badge variant="secondary" className="gap-1">
                {filters.condition}
                <button
                  onClick={() => removeFilter("condition")}
                  className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="gap-1">
                {filters.location}
                <button
                  onClick={() => removeFilter("location")}
                  className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
