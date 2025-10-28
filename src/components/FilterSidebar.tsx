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
import { FunnelSimple, X } from "@phosphor-icons/react"

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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FunnelSimple size={24} weight="fill" className="text-primary" />
          <h2 className="text-xl font-semibold">Filter Professionals</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={16} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="search" className="text-sm font-medium mb-2 block">
            Search by Name
          </Label>
          <Input
            id="search"
            placeholder="Search professionals..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
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
            Location (City or State)
          </Label>
          <Input
            id="location"
            placeholder="e.g., Washington, DC"
            value={filters.location}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
          />
        </div>
      </div>
    </Card>
  )
}
