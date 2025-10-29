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
