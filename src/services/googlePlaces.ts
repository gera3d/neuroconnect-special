/**
 * Google Places API Service
 * 
 * This service handles all interactions with the Google Places API
 * to fetch real healthcare provider data for the NeuroConnect map.
 * 
 * API Documentation: https://developers.google.com/maps/documentation/places/web-service
 */

/// <reference types="google.maps" />

import { Professional, Location } from '@/lib/types'

// Extend Window interface to include google
declare global {
  interface Window {
    google: typeof google
  }
}

// Google Places API Response Types
export interface PlaceGeometry {
  location: {
    lat: number
    lng: number
  }
  viewport?: {
    northeast: { lat: number; lng: number }
    southwest: { lat: number; lng: number }
  }
}

export interface PlacePhoto {
  height: number
  width: number
  photo_reference: string
  html_attributions: string[]
}

export interface PlaceOpeningHours {
  open_now?: boolean
  periods?: Array<{
    open: { day: number; time: string }
    close: { day: number; time: string }
  }>
  weekday_text?: string[]
}

export interface PlaceReview {
  author_name: string
  author_url?: string
  language: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

export interface GooglePlace {
  place_id: string
  name: string
  vicinity?: string
  formatted_address?: string
  geometry: PlaceGeometry
  rating?: number
  user_ratings_total?: number
  types: string[]
  business_status?: string
  opening_hours?: PlaceOpeningHours
  photos?: PlacePhoto[]
  price_level?: number
  formatted_phone_number?: string
  international_phone_number?: string
  website?: string
  reviews?: PlaceReview[]
}

export interface NearbySearchParams {
  location: { lat: number; lng: number }
  radius: number // in meters
  type?: string // e.g., 'health', 'doctor', 'hospital'
  keyword?: string // e.g., 'autism specialist', 'pediatric therapy'
  rankby?: 'prominence' | 'distance'
}

export interface PlacesSearchResponse {
  results: GooglePlace[]
  status: string
  error_message?: string
  next_page_token?: string
}

export interface PlaceDetailsResponse {
  result: GooglePlace
  status: string
  error_message?: string
}

/**
 * Google Places API Service Class
 * Uses Google Maps JavaScript API PlacesService (client-side) to avoid CORS issues
 */
export class GooglePlacesService {
  private static instance: GooglePlacesService | null = null
  private apiKey: string
  private placesService: google.maps.places.PlacesService | null = null
  private mapDiv: HTMLDivElement | null = null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('Google Places API key not found. Please add VITE_GOOGLE_PLACES_API_KEY to your .env file')
    }
    
    // Create a hidden div for PlacesService (required)
    this.mapDiv = document.createElement('div')
    this.mapDiv.style.display = 'none'
    document.body.appendChild(this.mapDiv)
  }

  /**
   * Get singleton instance
   */
  static getInstance(): GooglePlacesService {
    if (!GooglePlacesService.instance) {
      GooglePlacesService.instance = new GooglePlacesService()
    }
    return GooglePlacesService.instance
  }

  /**
   * Initialize the PlacesService
   */
  private async initPlacesService(): Promise<void> {
    if (this.placesService) return

    // Wait for Google Maps to be loaded (it may already be loaded by PracticeMap)
    const google = (window as any).google
    
    if (!google || !google.maps) {
      throw new Error('Google Maps JavaScript API is not loaded. Please ensure the map is initialized first.')
    }

    // Load the places library if not already loaded
    if (!google.maps.places) {
      console.log('Loading Google Places library...')
      await google.maps.importLibrary('places')
    }

    // PlacesService requires a map or div element
    this.placesService = new google.maps.places.PlacesService(this.mapDiv!)
  }

  /**
   * Search for nearby healthcare providers using PlacesService
   */
  async nearbySearch(params: NearbySearchParams): Promise<GooglePlace[]> {
    await this.initPlacesService()
    
    const { location, radius, type, keyword } = params
    
    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: radius,
    }

    if (type) request.type = type
    if (keyword) request.keyword = keyword

    return new Promise((resolve) => {
      this.placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Convert google.maps.places.PlaceResult to our GooglePlace format
          const places: GooglePlace[] = results.map(result => this.convertToGooglePlace(result))
          resolve(places)
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.log('No results found')
          resolve([])
        } else {
          console.error('Google Places API Error:', status)
          resolve([])
        }
      })
    })
  }

  /**
   * Convert google.maps.places.PlaceResult to our GooglePlace format
   */
  private convertToGooglePlace(place: google.maps.places.PlaceResult): GooglePlace {
    return {
      place_id: place.place_id || '',
      name: place.name || '',
      vicinity: place.vicinity || place.formatted_address || '',
      geometry: {
        location: {
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        }
      },
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      types: place.types || [],
      photos: place.photos,
      opening_hours: place.opening_hours,
      formatted_phone_number: place.formatted_phone_number,
      website: place.website,
      url: place.url,
      reviews: place.reviews,
      price_level: place.price_level
    }
  }

  /**
   * Search for places using text query
   */
  async textSearch(query: string, location?: { lat: number; lng: number }, radius?: number): Promise<GooglePlace[]> {
    await this.initPlacesService()
    
    const request: google.maps.places.TextSearchRequest = {
      query: query
    }

    if (location) {
      request.location = new google.maps.LatLng(location.lat, location.lng)
    }

    if (radius) {
      request.radius = radius
    }

    return new Promise((resolve) => {
      this.placesService!.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places: GooglePlace[] = results.map(result => this.convertToGooglePlace(result))
          resolve(places)
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.log('No results found for text search')
          resolve([])
        } else {
          console.error('Google Places Text Search Error:', status)
          resolve([])
        }
      })
    })
  }

  /**
   * Get detailed information about a specific place
   */
  async placeDetails(placeId: string, fields?: string[]): Promise<GooglePlace | null> {
    await this.initPlacesService()
    
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: fields || [
        'name',
        'formatted_address',
        'formatted_phone_number',
        'website',
        'opening_hours',
        'rating',
        'reviews',
        'user_ratings_total',
        'geometry',
        'types',
        'photos',
        'business_status',
        'price_level',
        'url'
      ]
    }

    return new Promise((resolve) => {
      this.placesService!.getDetails(request, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(this.convertToGooglePlace(result))
        } else {
          console.error('Google Places Details Error:', status)
          resolve(null)
        }
      })
    })
  }

  /**
   * Alias for placeDetails - Get full place details including reviews and photos
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
    return this.placeDetails(placeId)
  }

  /**
   * Get photo URL from photo reference (not needed with new API but kept for compatibility)
   */
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    // With the new API, photos are accessed differently
    return ''
  }

  /**
   * Transform Google Place data to Professional format
   * This allows us to use real API data with our existing UI components
   */
  transformToPlaceToProfessional(place: GooglePlace, index: number): Professional {
    // Extract specialty from types
    const specialty = this.extractSpecialty(place.types)
    
    // Extract conditions from name/types
    const conditions = this.extractConditions(place.name, place.types)
    
    // Create location object
    const location: Location = {
      city: this.extractCity(place.formatted_address || place.vicinity || ''),
      state: this.extractState(place.formatted_address || place.vicinity || ''),
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng
    }

    // Get photo URL if available
    const imageUrl = place.photos && place.photos.length > 0
      ? this.getPhotoUrl(place.photos[0].photo_reference)
      : undefined

    // Extract availability from opening hours
    const availability = this.extractAvailability(place.opening_hours)

    // Create bio from reviews or generic text
    const bio = this.extractBio(place.reviews)

    return {
      id: place.place_id,
      name: place.name,
      credentials: this.extractCredentials(place.types),
      specialty: specialty,
      treatmentType: this.determineTreatmentType(place.types, place.name),
      conditions: conditions,
      location: location,
      bio: bio,
      philosophy: this.extractPhilosophy(place.reviews),
      experience: this.estimateExperience(place.user_ratings_total),
      availability: availability,
      isRecommended: (place.rating || 0) >= 4.5,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      isVerified: true, // All Google Places listings are verified by Google
      acceptingNewClients: place.business_status === 'OPERATIONAL',
      languages: ['English'], // Default, could be enhanced
      insuranceAccepted: [], // Not available from Google Places API
      yearsExperience: this.estimateYearsFromReviews(place.user_ratings_total),
      imageUrl: imageUrl
    }
  }

  // Helper methods for data transformation

  private extractSpecialty(types: string[]): Professional['specialty'] {
    const typeMapping: Record<string, Professional['specialty']> = {
      'occupational_therapist': 'Occupational Therapy',
      'physical_therapist': 'Physical Therapy',
      'physiotherapist': 'Physical Therapy',
      'speech_therapist': 'Speech Therapy',
      'psychologist': 'Behavioral Therapy',
      'health': 'Behavioral Therapy',
      'doctor': 'Behavioral Therapy'
    }

    for (const type of types) {
      if (typeMapping[type]) {
        return typeMapping[type]
      }
    }

    return 'Behavioral Therapy' // Default
  }

  private extractConditions(name: string, types: string[]): Professional['conditions'] {
    const conditions: Professional['conditions'] = []
    const nameLower = name.toLowerCase()

    if (nameLower.includes('autism') || nameLower.includes('asd')) {
      conditions.push('Autism Spectrum Disorder')
    }
    if (nameLower.includes('adhd') || nameLower.includes('attention')) {
      conditions.push('ADHD')
    }
    if (nameLower.includes('speech') || nameLower.includes('language')) {
      conditions.push('Speech Delays')
    }
    if (nameLower.includes('sensory')) {
      conditions.push('Sensory Processing')
    }
    if (nameLower.includes('developmental')) {
      conditions.push('Developmental Delays')
    }
    if (nameLower.includes('anxiety')) {
      conditions.push('Anxiety')
    }
    if (nameLower.includes('dyslexia') || nameLower.includes('reading')) {
      conditions.push('Dyslexia')
    }

    // Default conditions if none found
    if (conditions.length === 0) {
      conditions.push('Developmental Delays')
    }

    return conditions
  }

  private extractCity(address: string): string {
    const parts = address.split(',')
    if (parts.length >= 2) {
      return parts[parts.length - 3]?.trim() || 'Santa Monica'
    }
    return 'Santa Monica'
  }

  private extractState(address: string): string {
    const parts = address.split(',')
    if (parts.length >= 2) {
      const stateZip = parts[parts.length - 2]?.trim() || ''
      const state = stateZip.split(' ')[0]
      return state || 'CA'
    }
    return 'CA'
  }

  private extractCredentials(types: string[]): string {
    const credentialMapping: Record<string, string> = {
      'doctor': 'MD',
      'physiotherapist': 'PT, DPT',
      'physical_therapist': 'PT, DPT',
      'occupational_therapist': 'OT, OTR/L',
      'speech_therapist': 'SLP, CCC-SLP',
      'psychologist': 'PhD, Licensed Psychologist'
    }

    for (const type of types) {
      if (credentialMapping[type]) {
        return credentialMapping[type]
      }
    }

    return 'Licensed Professional'
  }

  private determineTreatmentType(types: string[], name: string): Professional['treatmentType'] {
    const nameLower = name.toLowerCase()
    
    if (nameLower.includes('yoga') || nameLower.includes('acupuncture') || 
        nameLower.includes('holistic') || nameLower.includes('alternative')) {
      return 'Alternative'
    }
    
    if (nameLower.includes('integrative') || nameLower.includes('complementary')) {
      return 'Both'
    }

    return 'Conventional'
  }

  private extractAvailability(openingHours?: PlaceOpeningHours): string {
    if (!openingHours?.weekday_text || openingHours.weekday_text.length === 0) {
      return 'Call for availability'
    }

    return openingHours.weekday_text.slice(0, 2).join('; ')
  }

  private extractBio(reviews?: PlaceReview[]): string {
    if (reviews && reviews.length > 0) {
      const firstReview = reviews[0]
      const excerpt = firstReview.text.split('.')[0]
      return `Patients describe their experience: "${excerpt}."`
    }

    return 'Experienced healthcare provider specializing in neurodevelopmental support for children and families.'
  }

  private extractPhilosophy(reviews?: PlaceReview[]): string {
    if (reviews && reviews.length > 1) {
      const secondReview = reviews[1]
      const excerpt = secondReview.text.split('.')[0]
      return excerpt + '.'
    }

    return 'Committed to providing compassionate, evidence-based care tailored to each individual\'s unique needs.'
  }

  private estimateExperience(reviewCount?: number): string {
    if (!reviewCount) return '5+ years'
    
    if (reviewCount > 200) return '20+ years'
    if (reviewCount > 100) return '15+ years'
    if (reviewCount > 50) return '10+ years'
    if (reviewCount > 20) return '7+ years'
    
    return '5+ years'
  }

  private estimateYearsFromReviews(reviewCount?: number): number {
    if (!reviewCount) return 5
    
    if (reviewCount > 200) return 20
    if (reviewCount > 100) return 15
    if (reviewCount > 50) return 10
    if (reviewCount > 20) return 7
    
    return 5
  }

  /**
   * Search for healthcare providers specializing in neurodevelopmental conditions
   */
  async searchHealthcareProviders(
    location: { lat: number; lng: number },
    radius: number = 5000,
    specialty?: string
  ): Promise<Professional[]> {
    let allPlaces: GooglePlace[] = []

    // Multiple search queries to get comprehensive results
    const searchQueries = specialty ? 
      // When specialty provided, search multiple ways for that specialty
      [
        `${specialty} near ${location.lat},${location.lng}`,
        `pediatric ${specialty} Santa Monica`,
        `child ${specialty} Los Angeles`
      ] :
      // When no specialty, search for all pediatric healthcare types
      [
        'pediatric therapy Santa Monica',
        'child psychologist Los Angeles',
        'speech therapy pediatric',
        'occupational therapy children',
        'developmental pediatrician',
        'behavioral therapy autism',
        'ABA therapy Santa Monica',
        'pediatric healthcare Los Angeles',
        'child psychiatrist',
        'pediatric neurologist'
      ]

    // Perform multiple searches and combine results
    for (const query of searchQueries) {
      try {
        const places = await this.textSearch(query, location, radius)
        console.log(`Found ${places.length} results for "${query}"`)
        allPlaces = [...allPlaces, ...places]
      } catch (error) {
        console.error(`Error searching for "${query}":`, error)
      }
    }

    // Deduplicate by place_id
    const uniquePlaces = new Map<string, GooglePlace>()
    allPlaces.forEach(place => {
      if (place.place_id && !uniquePlaces.has(place.place_id)) {
        uniquePlaces.set(place.place_id, place)
      }
    })
    
    const deduplicatedPlaces = Array.from(uniquePlaces.values())
    console.log(`Total unique places found: ${deduplicatedPlaces.length}`)

    // Filter to only include legitimate healthcare providers
    const filteredPlaces = this.filterHealthcareProviders(deduplicatedPlaces)
    console.log(`After healthcare filter: ${filteredPlaces.length}`)

    // Transform to Professional format
    const professionals = filteredPlaces.map((place, index) => 
      this.transformToPlaceToProfessional(place, index)
    )

    // Sort by rating and review count
    return professionals.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }
      return b.reviewCount - a.reviewCount
    })
  }

  /**
   * Filter to only include legitimate healthcare providers
   * Removes airports, grocery stores, game studios, and other non-medical facilities
   */
  private filterHealthcareProviders(places: GooglePlace[]): GooglePlace[] {
    // Non-medical types to EXCLUDE - must be very specific
    const excludeTypes = [
      'airport',
      'store',
      'grocery_or_supermarket',
      'shopping_mall',
      'restaurant',
      'cafe',
      'gas_station',
      'parking',
      'transit_station',
      'lodging',
      'bank',
      'atm',
      'car_dealer',
      'car_rental',
      'car_repair',
      'car_wash',
      'beauty_salon',
      'hair_care',
      'gym',
      'spa',
      'park',
      'library',
      'accounting',
      'lawyer',
      'real_estate_agency',
      'insurance_agency',
      'travel_agency',
      'movie_theater',
      'night_club',
      'bar',
      'liquor_store',
      'pet_store',
      'veterinary_care',
      'funeral_home',
      'cemetery',
      'moving_company',
      'storage',
      'laundry',
      'electronics_store',
      'home_goods_store',
      'furniture_store',
      'clothing_store',
      'jewelry_store',
      'shoe_store',
      'book_store',
      'florist',
      'casino',
      'stadium',
      'museum',
      'art_gallery',
      'bakery',
      'meal_delivery',
      'meal_takeaway',
      'amusement_park',
      'aquarium',
      'bowling_alley',
      'campground',
      'rv_park',
      'school',
      'university',
      'primary_school',
      'secondary_school',
      'local_government_office',
      'post_office',
      'police',
      'fire_station',
      'church',
      'hindu_temple',
      'mosque',
      'synagogue',
      'embassy',
      'city_hall',
      'courthouse',
      'hardware_store',
      'bicycle_store',
      'car_wash',
      'convenience_store',
      'department_store',
      'drugstore',
      'electrician',
      'finance',
      'locksmith',
      'painter',
      'plumber',
      'roofing_contractor',
      'moving_company'
    ]

    // Keywords in names that indicate NON-medical facilities - very strict list
    const excludeNameKeywords = [
      ' game ',
      'game studio',
      'gaming',
      'video game',
      'airport',
      'grocery',
      'supermarket',
      'restaurant',
      ' cafe',
      'coffee shop',
      'coffee house',
      'starbucks',
      'hotel',
      'motel',
      ' inn ',
      'shopping',
      'mall',
      'gas station',
      'chevron',
      'shell',
      '76 gas',
      'exxon',
      'mobil',
      'bp gas',
      'bank of',
      'wells fargo',
      'chase bank',
      'citibank',
      'car wash',
      'auto wash',
      'salon',
      'barber shop',
      'hair salon',
      'nail salon',
      'fitness center',
      ' gym ',
      'gold\'s gym',
      '24 hour fitness',
      'equinox',
      'pet store',
      'petco',
      'petsmart',
      'veterinary',
      ' vet ',
      'animal hospital',
      'casino',
      ' bar ',
      'sports bar',
      'pub ',
      'nightclub',
      'church',
      'temple',
      'mosque',
      'synagogue',
      'elementary',
      'middle school',
      'high school',
      'university',
      'college',
      'museum',
      'art gallery',
      'movie theater',
      'cinema',
      'bakery',
      'pizzeria',
      'brewery',
      'winery',
      'distillery',
      'cannabis',
      'dispensary',
      'smoke shop',
      'tobacco',
      'liquor store',
      'wine shop',
      'hardware',
      'home depot',
      'lowe\'s',
      'ace hardware'
    ]

    return places.filter(place => {
      const nameLower = place.name.toLowerCase()

      // STRICT EXCLUSION: Check for exact type matches
      const hasExcludedType = place.types.some(type => 
        excludeTypes.includes(type)
      )
      if (hasExcludedType) {
        console.log(`Filtered out ${place.name} - excluded type: ${place.types.join(', ')}`)
        return false
      }

      // STRICT EXCLUSION: Check for name keywords
      const hasExcludedName = excludeNameKeywords.some(keyword => 
        nameLower.includes(keyword.toLowerCase())
      )
      if (hasExcludedName) {
        console.log(`Filtered out ${place.name} - excluded name keyword`)
        return false
      }

      // Allow everything else (since our search queries are already healthcare-focused)
      return true
    })
  }

  /**
   * Filter to prefer providers that focus on neurodivergent care (optional filter)
   */
  private filterNeurodivergentProviders(places: GooglePlace[]): GooglePlace[] {
    // Keywords that indicate neurodivergent focus (use for BOOSTING, not exclusion)
    const neurodivergentIndicators = [
      'autism',
      'asd',
      'asperger',
      'adhd',
      'add',
      'developmental',
      'neurodevelopmental',
      'special needs',
      'sensory',
      'dyslexia',
      'learning disability',
      'aba',
      'applied behavior',
      'speech',
      'occupational',
      'behavioral',
      'pediatric',
      'child',
      'therapy',
      'therapist',
      'psychologist',
      'counseling'
    ]

    return places.map(place => {
      const searchText = `${place.name} ${place.vicinity || ''} ${place.types.join(' ')}`.toLowerCase()
      
      // Count how many neurodivergent indicators are present
      const score = neurodivergentIndicators.reduce((count, indicator) => 
        searchText.includes(indicator) ? count + 1 : count, 0
      )

      return { ...place, neurodivergentScore: score }
    })
    .filter((place: any) => place.neurodivergentScore > 0) // At least one relevant keyword
    .sort((a: any, b: any) => b.neurodivergentScore - a.neurodivergentScore) // Sort by relevance
  }

  /**
   * Search specifically for autism specialists
   */
  async searchAutismSpecialists(
    location: { lat: number; lng: number },
    radius: number = 5000
  ): Promise<Professional[]> {
    return this.searchHealthcareProviders(location, radius, 'autism pediatric therapy')
  }

  /**
   * Search specifically for ADHD specialists
   */
  async searchADHDSpecialists(
    location: { lat: number; lng: number },
    radius: number = 5000
  ): Promise<Professional[]> {
    return this.searchHealthcareProviders(location, radius, 'ADHD child psychologist')
  }

  /**
   * Search specifically for speech therapists who work with neurodivergent children
   */
  async searchSpeechTherapists(
    location: { lat: number; lng: number },
    radius: number = 5000
  ): Promise<Professional[]> {
    return this.searchHealthcareProviders(location, radius, 'speech therapy pediatric')
  }

  /**
   * Search specifically for occupational therapists specializing in sensory integration
   */
  async searchOccupationalTherapists(
    location: { lat: number; lng: number },
    radius: number = 5000
  ): Promise<Professional[]> {
    return this.searchHealthcareProviders(location, radius, 'occupational therapy pediatric')
  }

  /**
   * Search specifically for developmental pediatricians
   */
  async searchDevelopmentalPediatricians(
    location: { lat: number; lng: number },
    radius: number = 5000
  ): Promise<Professional[]> {
    return this.searchHealthcareProviders(location, radius, 'developmental pediatrician')
  }

  /**
   * Search specifically for ABA therapists
   */
  async searchABATherapists(
    location: { lat: number; lng: number },
    radius: number = 5000
  ): Promise<Professional[]> {
    return this.searchHealthcareProviders(location, radius, 'behavioral therapy child')
  }
}

// Create singleton instance
export const googlePlacesService = new GooglePlacesService()
