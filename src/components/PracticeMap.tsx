import { useEffect, useRef, useState } from "react"
import { Professional } from "@/lib/types"
import { motion } from "framer-motion"
import { createRoot } from "react-dom/client"

interface PracticeMapProps {
  professionals: Professional[]
  onMarkerClick?: (professional: Professional) => void
  rankedMode?: boolean
  isDialogOpen?: boolean
}

const GOOGLE_MAPS_API_KEY = "AIzaSyCgIykNzRHRxx_QIUlhQ6eLQL3bGwlQsvU"

interface CustomMarkerProps {
  rank: number
  delay: number
  onClick: () => void
  professional: Professional
}

function CustomMarker({ rank, delay, onClick, professional }: CustomMarkerProps) {
  const rankConfig = [
    { 
      bgOuter: "#3B82F6",
      bgInner: "#2563EB",
      borderColor: "#1D4ED8",
      size: 52,
      labelBg: "#1E40AF",
      labelText: "#FFFFFF"
    },
    { 
      bgOuter: "#8B5CF6",
      bgInner: "#7C3AED",
      borderColor: "#6D28D9",
      size: 46,
      labelBg: "#5B21B6",
      labelText: "#FFFFFF"
    },
    { 
      bgOuter: "#EC4899",
      bgInner: "#DB2777",
      borderColor: "#BE185D",
      size: 42,
      labelBg: "#9F1239",
      labelText: "#FFFFFF"
    }
  ][rank - 1]

  return (
    <motion.div
      initial={{ 
        scale: 0,
        y: -60,
        opacity: 0
      }}
      animate={{ 
        scale: 1,
        y: 0,
        opacity: 1
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay
      }}
      whileHover={{ 
        scale: 1.1,
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 12 }
      }}
      style={{
        position: "relative",
        cursor: "pointer",
        width: rankConfig.size,
        height: rankConfig.size,
        filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))"
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: "absolute",
          inset: -6,
          background: `${rankConfig.bgOuter}20`,
          borderRadius: "50%",
          zIndex: 0
        }}
      />
      
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${rankConfig.bgOuter} 0%, ${rankConfig.bgInner} 100%)`,
          borderRadius: "50%",
          border: `3px solid ${rankConfig.borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          boxShadow: `0 2px 8px ${rankConfig.borderColor}40, inset 0 1px 0 rgba(255, 255, 255, 0.3)`
        }}
      >
        <div
          style={{
            fontSize: rankConfig.size * 0.45,
            fontWeight: "800",
            color: "#FFFFFF",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            fontFamily: "Inter, system-ui, sans-serif"
          }}
        >
          {rank}
        </div>
      </div>
      
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 0.4 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
        style={{
          position: "absolute",
          bottom: -16,
          left: "50%",
          transform: "translateX(-50%)",
          width: 3,
          height: 16,
          background: `linear-gradient(to bottom, ${rankConfig.bgInner}, transparent)`,
          transformOrigin: "top",
          zIndex: 0,
          borderRadius: "0 0 2px 2px"
        }}
      />
    </motion.div>
  )
}

export function PracticeMap({ professionals, onMarkerClick, rankedMode = false, isDialogOpen = false }: PracticeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowRef = useRef<any>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [infoWindowOpen, setInfoWindowOpen] = useState(false)

  const showCompactPreview = (marker: any, professional: Professional) => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close()
    }

    setInfoWindowOpen(true)

    const contentString = `
      <div style="padding: 14px; max-width: 300px; font-family: 'Inter', system-ui, sans-serif;">
        <div style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">
          ${professional.name}
        </div>
        
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 10px;">
          ${professional.credentials}
        </div>
        
        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 10px;">
          <span style="color: #F59E0B;">★</span>
          <span style="font-weight: 600; color: #1a1a1a; font-size: 13px;">${professional.rating.toFixed(1)}</span>
          <span style="color: #9ca3af; font-size: 12px;">(${professional.reviewCount})</span>
        </div>
        
        <button
          onclick="window.dispatchEvent(new CustomEvent('open-professional-${professional.id}'))"
          style="
            width: 100%;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
          "
          onmouseover="this.style.background='#2563eb'"
          onmouseout="this.style.background='#3b82f6'"
        >
          View Profile
        </button>
      </div>
    `

    const g = (window as any).google
    infoWindowRef.current = new g.maps.InfoWindow({
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

    const g2 = (window as any).google
    g2.maps.event.addListener(infoWindowRef.current, 'closeclick', () => {
      window.removeEventListener(`open-professional-${professional.id}` as any, handleOpenProfessional)
      setInfoWindowOpen(false)
    })
  }

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return

      try {
        const g = (window as any).google
        if (!g) {
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

        const g2 = (window as any).google
        const { Map } = await g2.maps.importLibrary("maps")
        const { AdvancedMarkerElement, PinElement } = await g2.maps.importLibrary("marker")

        const center = { lat: 34.0195, lng: -118.4912 }

        const map = new Map(mapRef.current!, {
          center,
          zoom: 12,
          mapId: "neuroconnect_map",
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              elementType: "geometry",
              stylers: [{ saturation: -20 }, { lightness: 10 }]
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        })

        googleMapRef.current = map

        markersRef.current.forEach(marker => {
          marker.map = null
        })
        markersRef.current = []

        const g3 = (window as any).google
        const bounds = new g3.maps.LatLngBounds()
        const loadOrder = rankedMode && professionals.length >= 3 
          ? [0, 1, 2]
          : professionals.map((_, i) => i)

        professionals.forEach((professional, index) => {
          const position = {
            lat: professional.location.lat,
            lng: professional.location.lng,
          }

          const markerDiv = document.createElement("div")
          markerDiv.style.position = "relative"
          markerDiv.style.cursor = "pointer"
          
          if (rankedMode && index < 3) {
            const orderIndex = loadOrder.indexOf(index)
            const delay = orderIndex * 0.25
            
            const root = createRoot(markerDiv)
            root.render(
              <CustomMarker
                rank={index + 1}
                delay={delay}
                professional={professional}
                onClick={() => {}}
              />
            )
          } else {
            const basicPin = new PinElement({
              background: professional.isRecommended ? "#3B82F6" : "#6B7280",
              borderColor: professional.isRecommended ? "#2563EB" : "#4B5563",
              glyphColor: "#FFFFFF",
              scale: professional.isRecommended ? 1.1 : 1,
            })
            markerDiv.appendChild(basicPin.element)
          }

          const marker = new AdvancedMarkerElement({
            map,
            position,
            content: markerDiv,
            title: professional.name,
            gmpClickable: true,
          })

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
          map.fitBounds(bounds, {
            top: 100,
            right: 60,
            bottom: 60,
            left: 60,
          })
          
          if (rankedMode && professionals.length >= 1) {
            setTimeout(() => {
              const maxZoom = map.getZoom()
              if (maxZoom && maxZoom > 14) {
                map.setZoom(14)
              }
            }, 500)
          }
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
  }, [professionals, onMarkerClick, rankedMode])

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
    <div className="relative w-full h-full">
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
        className="w-full h-full" 
      />
    </div>
  )
}
