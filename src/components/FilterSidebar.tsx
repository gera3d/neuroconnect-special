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
import { X, MagnifyingGlass, MapPin } from "@phosphor-icons/react"

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

  const removeFilter = (filterKey: keyof FilterState) => {
    if (filterKey === "search" || filterKey === "location") {
      onFilterChange({ ...filters, [filterKey]: "" })
    } else {
      onFilterChange({ ...filters, [filterKey]: "All" })
    }
  }

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Label htmlFor="search" className="text-xs font-medium mb-1.5 block text-muted-foreground">
            Search
          </Label>
          <div className="relative">
            <MagnifyingGlass 
              size={16} 
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="search"
              placeholder="Name or keyword..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-9 h-9 text-sm rounded-lg"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="specialty" className="text-xs font-medium mb-1.5 block text-muted-foreground">
            Specialty
          </Label>
          <Select
            value={filters.specialty}
            onValueChange={(value) => 
              onFilterChange({ ...filters, specialty: value as Specialty | "All" })
            }
          >
            <SelectTrigger id="specialty" className="h-9 text-sm rounded-lg">
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
          <Label htmlFor="treatmentType" className="text-xs font-medium mb-1.5 block text-muted-foreground">
            Treatment Type
          </Label>
          <Select
            value={filters.treatmentType}
            onValueChange={(value) => 
              onFilterChange({ ...filters, treatmentType: value as TreatmentType | "All" })
            }
          >
            <SelectTrigger id="treatmentType" className="h-9 text-sm rounded-lg">
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
          <Label htmlFor="condition" className="text-xs font-medium mb-1.5 block text-muted-foreground">
            Condition
          </Label>
          <Select
            value={filters.condition}
            onValueChange={(value) => 
              onFilterChange({ ...filters, condition: value as Condition | "All" })
            }
          >
            <SelectTrigger id="condition" className="h-9 text-sm rounded-lg">
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
          <Label htmlFor="location" className="text-xs font-medium mb-1.5 block text-muted-foreground">
            Location
          </Label>
          <div className="relative">
            <MapPin 
              size={16} 
              weight="fill"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="location"
              placeholder="City or State..."
              value={filters.location}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              className="pl-9 h-9 text-sm rounded-lg"
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1 text-xs font-medium pr-1.5 rounded-md">
              {filters.search}
              <button
                onClick={() => removeFilter("search")}
                className="ml-0.5 hover:bg-foreground/10 rounded-sm p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          {filters.specialty !== "All" && (
            <Badge variant="secondary" className="gap-1 text-xs font-medium pr-1.5 rounded-md">
              {filters.specialty}
              <button
                onClick={() => removeFilter("specialty")}
                className="ml-0.5 hover:bg-foreground/10 rounded-sm p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          {filters.treatmentType !== "All" && (
            <Badge variant="secondary" className="gap-1 text-xs font-medium pr-1.5 rounded-md">
              {filters.treatmentType}
              <button
                onClick={() => removeFilter("treatmentType")}
                className="ml-0.5 hover:bg-foreground/10 rounded-sm p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          {filters.condition !== "All" && (
            <Badge variant="secondary" className="gap-1 text-xs font-medium pr-1.5 rounded-md">
              {filters.condition}
              <button
                onClick={() => removeFilter("condition")}
                className="ml-0.5 hover:bg-foreground/10 rounded-sm p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="gap-1 text-xs font-medium pr-1.5 rounded-md">
              {filters.location}
              <button
                onClick={() => removeFilter("location")}
                className="ml-0.5 hover:bg-foreground/10 rounded-sm p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs px-2 rounded-md"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
