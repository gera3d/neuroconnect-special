/**
 * Live Map Demo Component
 * 
 * This component demonstrates how to use the Google Places API integration
 * with the existing PracticeMap component. It can be toggled between
 * mock data and real Google Places data.
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { PracticeMap } from './PracticeMap'
import { Professional } from '@/lib/types'
import { mockProfessionals } from '@/lib/mockData'
import { useHealthcareProviders, useUserLocation } from '@/hooks/use-google-places'
import { useVapi } from '@/hooks/use-vapi'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { 
  MapPin, 
  Sparkles, 
  Database, 
  Crosshair,
  RefreshCw,
  Filter,
  Phone
} from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

// Major cities with their coordinates
const MAJOR_CITIES = [
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
  { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
  { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
  { name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652 },
  { name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936 },
  { name: 'San Diego, CA', lat: 32.7157, lng: -117.1611 },
  { name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
  { name: 'San Jose, CA', lat: 37.3382, lng: -121.8863 },
  { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
  { name: 'Jacksonville, FL', lat: 30.3322, lng: -81.6557 },
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
  { name: 'Columbus, OH', lat: 39.9612, lng: -82.9988 },
  { name: 'Fort Worth, TX', lat: 32.7555, lng: -97.3308 },
  { name: 'Indianapolis, IN', lat: 39.7684, lng: -86.1581 },
  { name: 'Charlotte, NC', lat: 35.2271, lng: -80.8431 },
  { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
  { name: 'Denver, CO', lat: 39.7392, lng: -104.9903 },
  { name: 'Boston, MA', lat: 42.3601, lng: -71.0589 },
]

export function LiveMapDemo() {
  const [useLiveData, setUseLiveData] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState({ 
    lat: 34.0195, 
    lng: -118.4912 
  })
  const [selectedCity, setSelectedCity] = useState<string>('custom')
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [searchType, setSearchType] = useState<'general' | 'autism' | 'adhd' | 'speech' | 'occupational' | 'developmental' | 'aba'>('general')
  
  // Get user's current location
  const { 
    location: userLocation, 
    isLoading: locationLoading, 
    getLocation 
  } = useUserLocation()

  // Vapi voice assistant
  const { isCallActive, isSpeaking, callStatus, startCall, endCall } = useVapi()

  // Fetch real healthcare providers from Google Places API
  const { 
    professionals: liveProfessionals, 
    isLoading: dataLoading, 
    error,
    refetch 
  } = useHealthcareProviders({
    location: selectedLocation,
    radius: 10000, // Increased to 10km for more results
    searchType: searchType,
    cacheKey: `providers-${searchType}-${selectedLocation.lat}-${selectedLocation.lng}`,
    useCache: true,
    cacheExpirationMinutes: 60,
    enabled: useLiveData
  })

  // Use either live data or mock data based on toggle
  // Memoize to prevent unnecessary re-renders of PracticeMap
  const professionals = useMemo(() => {
    return useLiveData ? liveProfessionals : mockProfessionals
  }, [useLiveData, liveProfessionals])

  const handleMarkerClick = useCallback((professional: Professional, rank?: number) => {
    setSelectedProfessional(professional)
    console.log('Selected professional:', professional.name, rank ? `Rank: ${rank}` : '')
  }, [])

  // Update selected location when user location is fetched
  useEffect(() => {
    if (userLocation && locationLoading === false) {
      setSelectedLocation(userLocation)
      setSelectedCity('my-location')
    }
  }, [userLocation, locationLoading])

  const handleUseMyLocation = useCallback(() => {
    getLocation()
  }, [getLocation])

  const handleCityChange = useCallback((value: string) => {
    setSelectedCity(value)
    if (value === 'my-location') {
      getLocation()
    } else if (value !== 'custom') {
      const city = MAJOR_CITIES.find(c => c.name === value)
      if (city) {
        setSelectedLocation({ lat: city.lat, lng: city.lng })
      }
    }
  }, [getLocation])

  const handleRefreshData = useCallback(() => {
    refetch()
  }, [refetch])

  const handleToggleLiveData = useCallback((checked: boolean) => {
    setUseLiveData(checked)
  }, [])

  const handleSearchTypeChange = useCallback((value: string) => {
    setSearchType(value as typeof searchType)
  }, [])

  const handleAIAssistantClick = useCallback(() => {
    // Check if it's desktop (width > 768px)
    if (window.innerWidth > 768) {
      // Use Vapi on desktop
      if (isCallActive) {
        endCall()
      } else {
        startCall()
      }
    } else {
      // Use phone call on mobile
      window.location.href = 'tel:5617577914'
    }
  }, [isCallActive, startCall, endCall])

  const isLoading = (useLiveData && dataLoading) || locationLoading

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <Card className="p-6 bg-card shadow-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-primary" />
              <div>
                <div className="font-medium">
                  {locationLoading ? 'Getting your location...' : 'Loading providers...'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Please wait
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Map */}
      <div className="w-full h-full">
        <PracticeMap
          professionals={professionals}
          onMarkerClick={handleMarkerClick}
          rankedMode={true}
          center={selectedLocation}
        />
      </div>

      {/* Bottom Control Panel - Integrated Filters */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
        <Card className="bg-card/95 backdrop-blur-lg shadow-xl border-border mx-auto max-w-5xl pointer-events-auto">
          <div className="p-4 space-y-4">
            {/* Header Row - Data Source & Summary */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${useLiveData ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="font-semibold text-sm">{professionals.length} Providers</span>
                </div>
                {useLiveData && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>Live Data</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Label htmlFor="live-data-toggle" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                  {useLiveData ? (
                    <>
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="hidden sm:inline">Live Data</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 text-muted-foreground" />
                      <span className="hidden sm:inline">Demo Data</span>
                    </>
                  )}
                </Label>
                <Switch
                  id="live-data-toggle"
                  checked={useLiveData}
                  onCheckedChange={handleToggleLiveData}
                />
              </div>
            </div>

            {/* Filter Controls */}
            {useLiveData && (
              <>
                {/* AI Assistant Helper */}
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isCallActive ? 'bg-primary/20 animate-pulse' : 'bg-primary/10'
                      }`}>
                        <Phone className={`w-4 h-4 ${isCallActive ? 'text-primary animate-pulse' : 'text-primary'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {isCallActive ? 'AI Assistant Active' : 'Not sure what you need?'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isCallActive 
                            ? (isSpeaking ? 'AI is speaking...' : 'Listening...')
                            : 'Talk to our AI assistant for personalized help'
                          }
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleAIAssistantClick}
                      disabled={callStatus === 'connecting' || callStatus === 'ending'}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap shadow-sm transition-all ${
                        isCallActive 
                          ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {callStatus === 'connecting' && 'Connecting...'}
                        {callStatus === 'active' && 'End Call'}
                        {callStatus === 'ending' && 'Ending...'}
                        {callStatus === 'idle' && (window.innerWidth > 768 ? 'Talk to AI' : '(561) 757-7914')}
                      </span>
                      <span className="sm:hidden">
                        {isCallActive ? 'End' : 'Call'}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">or search manually</span>
                  </div>
                </div>

                {/* Manual Search Controls */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Specialty Filter */}
                <div className="md:col-span-3">
                  <Label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Filter className="w-3 h-3" />
                    Specialty Focus
                  </Label>
                  <Select value={searchType} onValueChange={handleSearchTypeChange}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">All Healthcare</SelectItem>
                      <SelectItem value="autism">Autism Focus</SelectItem>
                      <SelectItem value="adhd">ADHD Focus</SelectItem>
                      <SelectItem value="speech">Speech Therapy</SelectItem>
                      <SelectItem value="occupational">Occupational Therapy</SelectItem>
                      <SelectItem value="developmental">Developmental Support</SelectItem>
                      <SelectItem value="aba">Behavioral Therapy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* City Selector */}
                <div className="md:col-span-3">
                  <Label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    Location
                  </Label>
                  <Select value={selectedCity} onValueChange={handleCityChange}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="my-location">📍 My Location</SelectItem>
                      <SelectItem value="custom" disabled>Custom Location</SelectItem>
                      {MAJOR_CITIES.map(city => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Coordinates Display */}
                <div className="md:col-span-3">
                  <Label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    Coordinates
                  </Label>
                  <div className="h-9 px-3 py-2 bg-muted rounded-md flex items-center">
                    <span className="text-xs font-mono text-muted-foreground truncate">
                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="md:col-span-3 flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Actions
                    </Label>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full h-9"
                      onClick={handleRefreshData}
                      disabled={dataLoading}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${dataLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>
              </>
            )}

            {/* Info Row - Search Stats */}
            {useLiveData && (
              <div className="flex items-center gap-6 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Radius:</span>
                  <span>10 km</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Focus:</span>
                  <span>Healthcare Providers</span>
                </div>
                <div className="flex-1 text-right">
                  <span>Click markers for provider details</span>
                </div>
              </div>
            )}

            {/* Demo Mode Info */}
            {!useLiveData && (
              <div className="text-xs text-center text-muted-foreground pt-2 border-t border-border/50">
                Toggle "Live Data" to see real healthcare providers from Google Places
              </div>
            )}

            {/* Error Display */}
            {error && useLiveData && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      </div>

      {/* Selected Professional Info - Top Right */}
      {selectedProfessional && (
        <div className="absolute top-4 right-4 z-20 max-w-sm">
          <Card className="p-3 bg-card/95 backdrop-blur-lg shadow-lg border-border">
            <div className="text-xs">
              <div className="font-semibold text-sm mb-1">
                {selectedProfessional.name}
              </div>
              <div className="text-muted-foreground mb-2">
                {selectedProfessional.credentials}
              </div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{selectedProfessional.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({selectedProfessional.reviewCount} reviews)
                </span>
              </div>
              {useLiveData && (
                <div className="text-[10px] text-muted-foreground italic">
                  Source: Google Places API
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
