/**
 * Live Map Demo Component
 * 
 * This component demonstrates how to use the Google Places API integration
 * with the existing PracticeMap component. It can be toggled between
 * mock data and real Google Places data.
 */

import { useState, useCallback, useMemo } from 'react'
import { PracticeMap } from './PracticeMap'
import { Professional } from '@/lib/types'
import { mockProfessionals } from '@/lib/mockData'
import { useHealthcareProviders, useUserLocation } from '@/hooks/use-google-places'
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
  Filter
} from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'

export function LiveMapDemo() {
  const [useLiveData, setUseLiveData] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState({ 
    lat: 34.0195, 
    lng: -118.4912 
  })
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [searchType, setSearchType] = useState<'general' | 'autism' | 'adhd' | 'speech' | 'occupational' | 'developmental' | 'aba'>('general')
  
  // Get user's current location
  const { 
    location: userLocation, 
    isLoading: locationLoading, 
    getLocation 
  } = useUserLocation()

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

  const handleUseMyLocation = useCallback(() => {
    if (userLocation) {
      setSelectedLocation(userLocation)
      if (useLiveData) {
        refetch()
      }
    } else {
      getLocation()
    }
  }, [userLocation, useLiveData, refetch, getLocation])

  const handleRefreshData = useCallback(() => {
    refetch()
  }, [refetch])

  const handleToggleLiveData = useCallback((checked: boolean) => {
    setUseLiveData(checked)
  }, [])

  const handleSearchTypeChange = useCallback((value: string) => {
    setSearchType(value as typeof searchType)
  }, [])

  const isLoading = (useLiveData && dataLoading) || locationLoading

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20 space-y-3 max-w-sm">
        {/* Data Source Toggle */}
        <Card className="p-4 bg-card/95 backdrop-blur-lg shadow-lg border-border">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="live-data" className="flex items-center gap-2 text-sm font-medium">
                {useLiveData ? (
                  <>
                    <Sparkles className="w-4 h-4 text-primary" />
                    Live Google Places Data
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-muted-foreground" />
                    Mock Demo Data
                  </>
                )}
              </Label>
              <Switch
                id="live-data"
                checked={useLiveData}
                onCheckedChange={handleToggleLiveData}
              />
            </div>

            {useLiveData && (
              <>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-start gap-2 mb-3">
                    <Filter className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium mb-2">Neurodivergent Specialty:</div>
                      <Select value={searchType} onValueChange={handleSearchTypeChange}>
                        <SelectTrigger className="w-full h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">All Pediatric Therapy</SelectItem>
                          <SelectItem value="autism">Autism Focus</SelectItem>
                          <SelectItem value="adhd">ADHD Focus</SelectItem>
                          <SelectItem value="speech">Speech Therapy</SelectItem>
                          <SelectItem value="occupational">Occupational Therapy</SelectItem>
                          <SelectItem value="developmental">Developmental Pediatrics</SelectItem>
                          <SelectItem value="aba">Behavioral Therapy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Search Center:</div>
                      <div className="font-mono">
                        {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-8 text-xs"
                      onClick={handleUseMyLocation}
                      disabled={locationLoading}
                    >
                      <Crosshair className="w-3 h-3 mr-1" />
                      {locationLoading ? 'Locating...' : 'My Location'}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-8 text-xs"
                      onClick={handleRefreshData}
                      disabled={dataLoading}
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${dataLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="text-xs space-y-1 pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Providers found:</span>
                    <span className="font-medium">{professionals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Search radius:</span>
                    <span className="font-medium">10 km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Focus:</span>
                    <span className="font-medium">Pediatric Healthcare</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Error Display */}
        {error && useLiveData && (
          <Alert variant="destructive" className="bg-destructive/10 backdrop-blur-lg">
            <AlertDescription className="text-xs">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        {!useLiveData && (
          <Alert className="bg-blue-500/10 border-blue-500/20 backdrop-blur-lg">
            <AlertDescription className="text-xs text-blue-900 dark:text-blue-100">
              Toggle on "Live Google Places Data" to see real pediatric healthcare providers. Filter by specialty to narrow results.
            </AlertDescription>
          </Alert>
        )}

        {/* Selected Professional Info */}
        {selectedProfessional && (
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
        )}
      </div>

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
        />
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
        <Card className="p-3 bg-card/90 backdrop-blur-lg shadow-lg border-border mx-auto max-w-2xl pointer-events-auto">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>{professionals.length} Providers</span>
              </div>
              {useLiveData && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Live Data</span>
                </div>
              )}
            </div>
            <div className="text-muted-foreground">
              Click markers for details
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
