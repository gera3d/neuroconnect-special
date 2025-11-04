import { useEffect, useRef, useState } from "react"
import { Professional } from "@/lib/types"

interface PracticeMapProps {
  professionals: Professional[]
  onMarkerClick?: (professional: Professional) => void
  rankedMode?: boolean
}

const GOOGLE_MAPS_API_KEY = "AIzaSyCgIykNzRHRxx_QIUlhQ6eLQL3bGwlQsvU"

export function PracticeMap({ professionals, onMarkerClick, rankedMode = false }: PracticeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return

      try {
        if (!window.google) {
          const script = document.createElement("script")
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker&v=weekly`
          script.async = true
          script.defer = true
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve()
            script.onerror = () => reject(new Error("Failed to load Google Maps"))
            document.head.appendChild(script)
          })
        }

        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary

        const center = { lat: 34.0195, lng: -118.4912 }

        const map = new Map(mapRef.current!, {
          center,
          zoom: 13,
          mapId: "neuroconnect_map",
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        googleMapRef.current = map

        markersRef.current.forEach(marker => {
          marker.map = null
        })
        markersRef.current = []

        const bounds = new google.maps.LatLngBounds()

        professionals.forEach((professional, index) => {
          const position = {
            lat: professional.location.lat,
            lng: professional.location.lng,
          }

          let pinBackground: google.maps.marker.PinElement

          if (rankedMode && index < 3) {
            const rankColors = [
              { background: "#FFD700", border: "#DAA520", glyph: "1", scale: 1.5 },
              { background: "#C0C0C0", border: "#A8A8A8", glyph: "2", scale: 1.3 },
              { background: "#CD7F32", border: "#B8732D", glyph: "3", scale: 1.2 },
            ]
            
            const rankConfig = rankColors[index]
            pinBackground = new PinElement({
              background: rankConfig.background,
              borderColor: rankConfig.border,
              glyphColor: "#000000",
              glyph: rankConfig.glyph,
              scale: rankConfig.scale,
            })
          } else {
            pinBackground = new PinElement({
              background: professional.isRecommended ? "#4169E1" : "#6B7280",
              borderColor: professional.isRecommended ? "#1E40AF" : "#4B5563",
              glyphColor: "#FFFFFF",
              scale: professional.isRecommended ? 1.2 : 1,
            })
          }

          const marker = new AdvancedMarkerElement({
            map,
            position,
            content: pinBackground.element,
            title: professional.name,
          })

          marker.addListener("click", () => {
            if (onMarkerClick) {
              onMarkerClick(professional)
            }
          })

          markersRef.current.push(marker)
          bounds.extend(position)
        })

        if (professionals.length > 0) {
          map.fitBounds(bounds, 60)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        setError("Failed to load map")
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      markersRef.current.forEach(marker => {
        marker.map = null
      })
      markersRef.current = []
    }
  }, [professionals, onMarkerClick])

  if (error) {
    return (
      <div className="w-full h-[500px] rounded-lg border border-border bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-border/60 shadow-sm">
      {isLoading && (
        <div className="absolute inset-0 bg-muted/30 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
