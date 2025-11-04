import { useEffect, useRef, useState } from "react"
import { Professional } from "@/lib/types"

interface PracticeMapProps {
  professionals: Professional[]
  onMarkerClick?: (professional: Professional) => void
  rankedMode?: boolean
  isDialogOpen?: boolean
}

const GOOGLE_MAPS_API_KEY = "AIzaSyCgIykNzRHRxx_QIUlhQ6eLQL3bGwlQsvU"

export function PracticeMap({ professionals, onMarkerClick, rankedMode = false, isDialogOpen = false }: PracticeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [infoWindowOpen, setInfoWindowOpen] = useState(false)

  const showFirstPlaceTeaser = (marker: google.maps.marker.AdvancedMarkerElement, professional: Professional) => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close()
    }

    setInfoWindowOpen(true)

    const contentString = `
      <div style="padding: 16px; max-width: 320px; font-family: 'Inter', system-ui, sans-serif;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="
            width: 40px; 
            height: 40px; 
            background: linear-gradient(135deg, #FFD700 0%, #DAA520 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            color: #000;
            box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
          ">🥇</div>
          <div>
            <div style="font-size: 10px; font-weight: 700; color: #DAA520; text-transform: uppercase; letter-spacing: 0.5px;">
              #1 Best Match
            </div>
            <div style="font-size: 16px; font-weight: 700; color: #1a1a1a; margin-top: 2px;">
              ${professional.name}
            </div>
          </div>
        </div>
        
        <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
          ${professional.credentials}
        </div>
        
        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
          <span style="color: #FFA500;">★</span>
          <span style="font-weight: 600; color: #1a1a1a; font-size: 14px;">${professional.rating.toFixed(1)}</span>
          <span style="color: #888; font-size: 12px;">(${professional.reviewCount} reviews)</span>
        </div>
        
        <div style="
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 10px;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
          margin-bottom: 12px;
          font-size: 13px;
          color: #1e40af;
          font-style: italic;
        ">
          "${professional.philosophy.substring(0, 100)}${professional.philosophy.length > 100 ? '...' : ''}"
        </div>
        
        <div style="
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        ">
          ${professional.conditions.slice(0, 3).map(condition => `
            <span style="
              background: #f3f4f6;
              color: #374151;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 500;
            ">${condition}</span>
          `).join('')}
          ${professional.conditions.length > 3 ? `
            <span style="
              background: #f3f4f6;
              color: #6b7280;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 500;
            ">+${professional.conditions.length - 3} more</span>
          ` : ''}
        </div>
        
        <button
          onclick="window.dispatchEvent(new CustomEvent('open-professional-${professional.id}'))"
          style="
            width: 100%;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
            transition: transform 0.2s;
          "
          onmouseover="this.style.transform='translateY(-1px)'"
          onmouseout="this.style.transform='translateY(0)'"
        >
          View Full Profile →
        </button>
      </div>
    `

    infoWindowRef.current = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: professional.name,
    })

    infoWindowRef.current.open({
      anchor: marker,
      map: googleMapRef.current!,
    })

    const handleOpenProfessional = () => {
      if (onMarkerClick) {
        onMarkerClick(professional)
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close()
      }
      setInfoWindowOpen(false)
    }

    window.addEventListener(`open-professional-${professional.id}` as any, handleOpenProfessional)

    google.maps.event.addListener(infoWindowRef.current, 'closeclick', () => {
      window.removeEventListener(`open-professional-${professional.id}` as any, handleOpenProfessional)
      setInfoWindowOpen(false)
    })
  }

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
          styles: [
            {
              elementType: "geometry",
              stylers: [{ lightness: -30 }]
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ lightness: -20 }]
            },
            {
              elementType: "labels.text.stroke",
              stylers: [{ visibility: "on" }, { lightness: -50 }]
            }
          ]
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
              scale: 0,
            })
          } else {
            pinBackground = new PinElement({
              background: professional.isRecommended ? "#4169E1" : "#6B7280",
              borderColor: professional.isRecommended ? "#1E40AF" : "#4B5563",
              glyphColor: "#FFFFFF",
              scale: 0,
            })
          }

          const marker = new AdvancedMarkerElement({
            map,
            position,
            content: pinBackground.element,
            title: professional.name,
          })

          const targetScale = rankedMode && index < 3 
            ? [1.5, 1.3, 1.2][index]
            : (professional.isRecommended ? 1.2 : 1)

          setTimeout(() => {
            const animationDuration = 400
            const startTime = Date.now()
            const startScale = 0

            const animate = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(elapsed / animationDuration, 1)
              
              const easeOutElastic = (x: number): number => {
                const c4 = (2 * Math.PI) / 3
                return x === 0
                  ? 0
                  : x === 1
                  ? 1
                  : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
              }

              const currentScale = startScale + (targetScale - startScale) * easeOutElastic(progress)
              
              if (rankedMode && index < 3) {
                const rankColors = [
                  { background: "#FFD700", border: "#DAA520", glyph: "1" },
                  { background: "#C0C0C0", border: "#A8A8A8", glyph: "2" },
                  { background: "#CD7F32", border: "#B8732D", glyph: "3" },
                ]
                const rankConfig = rankColors[index]
                const newPin = new PinElement({
                  background: rankConfig.background,
                  borderColor: rankConfig.border,
                  glyphColor: "#000000",
                  glyph: rankConfig.glyph,
                  scale: currentScale,
                })
                marker.content = newPin.element
              } else {
                const newPin = new PinElement({
                  background: professional.isRecommended ? "#4169E1" : "#6B7280",
                  borderColor: professional.isRecommended ? "#1E40AF" : "#4B5563",
                  glyphColor: "#FFFFFF",
                  scale: currentScale,
                })
                marker.content = newPin.element
              }

              if (progress < 1) {
                requestAnimationFrame(animate)
              } else if (rankedMode && index === 0) {
                setTimeout(() => {
                  showFirstPlaceTeaser(marker, professional)
                }, 300)
              }
            }

            animate()
          }, 500 + index * 150)

          marker.addListener("click", () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.close()
              setInfoWindowOpen(false)
            }
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
      if (infoWindowRef.current) {
        infoWindowRef.current.close()
        infoWindowRef.current = null
      }
      setInfoWindowOpen(false)
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
      <div 
        ref={mapRef} 
        className={`w-full h-full transition-all duration-500 ease-out ${
          infoWindowOpen ? 'blur-[3px] brightness-[0.7]' : ''
        }`} 
      />
      {infoWindowOpen && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none transition-opacity duration-500 ease-out" />
      )}
    </div>
  )
}
