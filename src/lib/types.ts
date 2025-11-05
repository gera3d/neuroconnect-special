export type Specialty = 
  | "Speech Therapy"
  | "Sensory Integration"
  | "Occupational Therapy"
  | "Behavioral Therapy"
  | "Yoga & Mindfulness"
  | "Acupuncture"
  | "Physical Therapy"
  | "Music Therapy"
  | "Art Therapy"
  | "Play Therapy"
  | "Family Therapy"
  | "Educational Therapy"
  | "Nutrition"

export type TreatmentType = "Conventional" | "Alternative" | "Both"

export type Condition = 
  | "Autism Spectrum Disorder"
  | "Dyslexia"
  | "ADHD"
  | "Developmental Delays"
  | "Sensory Processing"
  | "Anxiety"
  | "Speech Delays"

export type Location = {
  city: string
  state: string
  lat: number
  lng: number
}

export interface Professional {
  id: string
  name: string
  credentials: string
  specialty: Specialty
  treatmentType: TreatmentType
  conditions: Condition[]
  location: Location
  bio: string
  philosophy: string
  experience: string
  availability: string
  isRecommended?: boolean
  rating: number
  reviewCount: number
  isVerified: boolean
  acceptingNewClients: boolean
  languages: string[]
  insuranceAccepted: string[]
  yearsExperience: number
  imageUrl?: string
}

export interface FilterState {
  specialty: Specialty | "All"
  treatmentType: TreatmentType | "All"
  condition: Condition | "All"
  location: string
  search: string
}

export interface GooglePlace {
  place_id: string
  name: string
  vicinity?: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  user_ratings_total?: number
  types: string[]
  photos?: google.maps.places.PlacePhoto[]
  opening_hours?: google.maps.places.PlaceOpeningHours
  formatted_phone_number?: string
  website?: string
  url?: string
  reviews?: google.maps.places.PlaceReview[]
  price_level?: number
}
