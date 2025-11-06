/**
 * Custom React Hook for Google Places Integration
 * 
 * This hook provides an easy interface to fetch real healthcare provider
 * data from Google Places API and manage loading/error states.
 */

import { useState, useEffect, useCallback } from 'react'
import { Professional } from '@/lib/types'
import { googlePlacesService } from '@/services/googlePlaces'

export interface UseGooglePlacesOptions {
  location: { lat: number; lng: number }
  radius?: number // in meters, default 5000 (5km)
  specialty?: string
  autoFetch?: boolean // automatically fetch on mount
  enabled?: boolean // whether the hook should run
  searchType?: 'general' | 'autism' | 'adhd' | 'speech' | 'occupational' | 'developmental' | 'aba'
}

export interface UseGooglePlacesReturn {
  professionals: Professional[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  hasData: boolean
}

/**
 * Hook to fetch healthcare providers from Google Places API
 * 
 * @example
 * ```tsx
 * const { professionals, isLoading, error } = useGooglePlaces({
 *   location: { lat: 34.0195, lng: -118.4912 },
 *   radius: 5000,
 *   specialty: 'autism specialist'
 * })
 * ```
 */
export function useGooglePlaces(options: UseGooglePlacesOptions): UseGooglePlacesReturn {
  const {
    location,
    radius = 5000,
    specialty,
    autoFetch = true,
    enabled = true,
    searchType = 'general'
  } = options

  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      let results: Professional[] = []

      // Use specialized search methods based on searchType
      switch (searchType) {
        case 'autism':
          results = await googlePlacesService.searchAutismSpecialists(location, radius)
          break
        case 'adhd':
          results = await googlePlacesService.searchADHDSpecialists(location, radius)
          break
        case 'speech':
          results = await googlePlacesService.searchSpeechTherapists(location, radius)
          break
        case 'occupational':
          results = await googlePlacesService.searchOccupationalTherapists(location, radius)
          break
        case 'developmental':
          results = await googlePlacesService.searchDevelopmentalPediatricians(location, radius)
          break
        case 'aba':
          results = await googlePlacesService.searchABATherapists(location, radius)
          break
        default:
          results = await googlePlacesService.searchHealthcareProviders(
            location,
            radius,
            specialty
          )
      }

      setProfessionals(results)
      
      if (results.length === 0) {
        setError('No neurodivergent-focused healthcare providers found in this area. Try expanding your search radius.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch healthcare providers'
      setError(errorMessage)
      console.error('Error fetching professionals:', err)
    } finally {
      setIsLoading(false)
    }
  }, [location.lat, location.lng, radius, specialty, enabled, searchType])

  useEffect(() => {
    if (autoFetch && enabled) {
      fetchProfessionals()
    }
  }, [autoFetch, enabled, fetchProfessionals])

  return {
    professionals,
    isLoading,
    error,
    refetch: fetchProfessionals,
    hasData: professionals.length > 0
  }
}

/**
 * Hook to fetch user's current location using browser geolocation API
 * 
 * @example
 * ```tsx
 * const { location, isLoading, error, getLocation } = useUserLocation()
 * ```
 */
export function useUserLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasAttempted, setHasAttempted] = useState(false)

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setHasAttempted(true)
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setIsLoading(false)
        setHasAttempted(true)
      },
      (err) => {
        setError(err.message)
        setIsLoading(false)
        // Default to Santa Monica if geolocation fails
        setLocation({ lat: 34.0195, lng: -118.4912 })
        setHasAttempted(true)
      }
    )
  }, [])

  // Removed auto-fetch on mount - location should only be fetched when explicitly requested
  // useEffect(() => {
  //   if (!hasAttempted) {
  //     getLocation()
  //   }
  // }, [hasAttempted, getLocation])

  return {
    location,
    isLoading,
    error,
    getLocation
  }
}

/**
 * Hook to cache Google Places results in localStorage
 * This helps reduce API calls and costs
 * 
 * @example
 * ```tsx
 * const { cachedData, setCachedData, isCacheValid } = usePlacesCache('santa-monica-providers')
 * ```
 */
export function usePlacesCache(cacheKey: string, expirationMinutes: number = 60) {
  const [cachedData, setCachedDataState] = useState<Professional[] | null>(() => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (!cached) return null

      const { data, timestamp } = JSON.parse(cached)
      const now = Date.now()
      const expirationMs = expirationMinutes * 60 * 1000

      if (now - timestamp > expirationMs) {
        localStorage.removeItem(cacheKey)
        return null
      }

      return data
    } catch (err) {
      console.error('Error reading cache:', err)
      return null
    }
  })

  const setCachedData = useCallback((data: Professional[]) => {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry))
      setCachedDataState(data)
    } catch (err) {
      console.error('Error writing to cache:', err)
    }
  }, [cacheKey])

  const clearCache = useCallback(() => {
    localStorage.removeItem(cacheKey)
    setCachedDataState(null)
  }, [cacheKey])

  return {
    cachedData,
    setCachedData,
    clearCache,
    isCacheValid: cachedData !== null
  }
}

/**
 * Combined hook that uses caching and Google Places API
 * This is the recommended hook for most use cases
 * 
 * @example
 * ```tsx
 * const { professionals, isLoading, error, refetch } = useHealthcareProviders({
 *   location: { lat: 34.0195, lng: -118.4912 },
 *   cacheKey: 'santa-monica-providers',
 *   useCache: true
 * })
 * ```
 */
export function useHealthcareProviders(options: UseGooglePlacesOptions & {
  cacheKey?: string
  useCache?: boolean
  cacheExpirationMinutes?: number
}) {
  const {
    cacheKey = 'healthcare-providers',
    useCache = true,
    cacheExpirationMinutes = 60,
    ...placesOptions
  } = options

  const cache = usePlacesCache(cacheKey, cacheExpirationMinutes)
  
  // Determine if we should fetch from API
  const shouldFetchFromAPI = !useCache || !cache.isCacheValid

  const placesResult = useGooglePlaces({
    ...placesOptions,
    autoFetch: shouldFetchFromAPI
  })

  // Sync new API results to cache
  useEffect(() => {
    if (useCache && placesResult.professionals.length > 0 && shouldFetchFromAPI) {
      cache.setCachedData(placesResult.professionals)
    }
  }, [placesResult.professionals.length > 0 && shouldFetchFromAPI])

  // Use cached data if valid, otherwise use fresh API results
  const professionals = (useCache && cache.isCacheValid && cache.cachedData) 
    ? cache.cachedData 
    : placesResult.professionals

  const refetch = useCallback(async () => {
    cache.clearCache()
    await placesResult.refetch()
  }, [placesResult.refetch])

  return {
    professionals,
    isLoading: placesResult.isLoading,
    error: placesResult.error,
    refetch,
    hasData: professionals.length > 0
  }
}
