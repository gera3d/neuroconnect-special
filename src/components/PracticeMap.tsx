import { useEffect, useRef, useState } from "react"
import { Professional } from "@/lib/types"
import { motion } from "framer-motion"
import { createRoot } from "react-dom/client"

interface PracticeMapProps {
  professionals: Professional[]
  onMarkerClick?: (professional: Professional, rank?: number) => void
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
      bgOuter: "#FFD700",
      bgInner: "#FFC700",
      borderColor: "#B8860B",
      size: 56,
      labelBg: "#B8860B",
      labelText: "#FFFFFF",
      glowColor: "#FFD700",
      medal: "🥇"
    },
    { 
      bgOuter: "#C0C0C0",
      bgInner: "#B8B8B8",
      borderColor: "#888888",
      size: 50,
      labelBg: "#888888",
      labelText: "#FFFFFF",
      glowColor: "#C0C0C0",
      medal: "🥈"
    },
    { 
      bgOuter: "#CD7F32",
      bgInner: "#B87333",
      borderColor: "#8B5A2B",
      size: 46,
      labelBg: "#8B5A2B",
      labelText: "#FFFFFF",
      glowColor: "#CD7F32",
      medal: "🥉"
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
      onClick={onClick}
      style={{
        position: "relative",
        cursor: "pointer",
        width: rankConfig.size,
        height: rankConfig.size,
        filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))",
        pointerEvents: "auto"
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: "absolute",
          inset: -8,
          background: `radial-gradient(circle, ${rankConfig.glowColor}40 0%, transparent 70%)`,
          borderRadius: "50%",
          zIndex: 0,
          pointerEvents: "none"
        }}
      />
      
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${rankConfig.bgOuter} 0%, ${rankConfig.bgInner} 100%)`,
          borderRadius: "50%",
          border: `4px solid ${rankConfig.borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          boxShadow: `0 4px 16px ${rankConfig.glowColor}60, 0 2px 8px ${rankConfig.borderColor}40, inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)`,
          pointerEvents: "none"
        }}
      >
        <div
          style={{
            fontSize: rankConfig.size * 0.55,
            fontWeight: "900",
            color: "#FFFFFF",
            textShadow: "0 3px 6px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.6)",
            fontFamily: "Inter, system-ui, sans-serif",
            pointerEvents: "none",
            letterSpacing: "-0.02em"
          }}
        >
          {rankConfig.medal}
        </div>
      </div>
      
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 0.5 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
        style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 4,
          height: 20,
          background: `linear-gradient(to bottom, ${rankConfig.bgInner}, transparent)`,
          transformOrigin: "top",
          zIndex: 0,
          borderRadius: "0 0 2px 2px",
          pointerEvents: "none",
          boxShadow: `0 2px 8px ${rankConfig.glowColor}40`
        }}
      />
    </motion.div>
  )
}

export function PracticeMap({ professionals, onMarkerClick, rankedMode = false, isDialogOpen = false }: PracticeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<Array<{ marker: any; professional: Professional; rank?: number }>>([])
  const infoWindowRef = useRef<any>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [infoWindowOpen, setInfoWindowOpen] = useState(false)

  const showCompactPreview = (marker: any, professional: Professional, rank?: number) => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close()
    }

    setInfoWindowOpen(true)

    const rankBadge = rank && rank <= 3 ? 
      `<div style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, ${rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32'}, ${rank === 1 ? '#FFA500' : rank === 2 ? '#B8B8B8' : '#B87333'}); color: white; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 800; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); letter-spacing: 0.02em;">
        <span style="font-size: 16px;">${rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
        <span>#${rank} ${rank === 1 ? 'BEST MATCH' : rank === 2 ? 'SILVER TIER' : 'BRONZE TIER'}</span>
      </div>` : ''

    const topConditions = professional.conditions.slice(0, 3)
    const conditionTags = topConditions.map(condition => 
      `<span style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; margin: 0 4px 4px 0;">${condition}</span>`
    ).join('')

    const quote = professional.bio.split('.')[0] + '.'
    
    const contentString = `
      <div style="padding: 16px; max-width: 320px; font-family: 'Inter', system-ui, sans-serif;">
        ${rankBadge}
        
        <div style="font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; letter-spacing: -0.01em;">
          ${professional.name}
        </div>
        
        <div style="display: inline-block; background: #e5e7eb; color: #374151; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; margin-bottom: 10px;">
          ${professional.credentials}
        </div>
        
        <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 12px;">
          <span style="color: #F59E0B; font-size: 16px;">★</span>
          <span style="font-weight: 700; color: #1a1a1a; font-size: 14px;">${professional.rating.toFixed(1)}</span>
          <span style="color: #9ca3af; font-size: 12px;">(${professional.reviewCount} reviews)</span>
        </div>
        
        <div style="background: #EFF6FF; border-left: 3px solid #3B82F6; padding: 10px 12px; margin-bottom: 12px; border-radius: 4px;">
          <div style="font-size: 12px; color: #1e40af; font-style: italic; line-height: 1.5;">
            "${quote}"
          </div>
        </div>
        
        <div style="margin-bottom: 14px;">
          ${conditionTags}
        </div>
        
        <button
          onclick="window.dispatchEvent(new CustomEvent('open-professional-${professional.id}'))"
          style="
            width: 100%;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
          "
          onmouseover="this.style.background='#2563eb'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'"
          onmouseout="this.style.background='#3b82f6'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
        >
          <span>View Full Profile</span>
          <span style="font-size: 16px;">→</span>
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
        onMarkerClick(professional, rank)
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

        markersRef.current.forEach(({ marker }) => {
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
          markerDiv.style.pointerEvents = "auto"
          
          const handleClick = () => {
            const markerRank = rankedMode && index < 3 ? index + 1 : undefined
            showCompactPreview(marker, professional, markerRank)
          }
          
          if (rankedMode && index < 3) {
            const orderIndex = loadOrder.indexOf(index)
            const delay = orderIndex * 0.25
            
            const root = createRoot(markerDiv)
            root.render(
              <CustomMarker
                rank={index + 1}
                delay={delay}
                professional={professional}
                onClick={handleClick}
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

          marker.addListener("click", handleClick)

          markersRef.current.push({ marker, professional, rank: rankedMode && index < 3 ? index + 1 : undefined })
          bounds.extend(position)
        })

        if (professionals.length > 0) {
          map.fitBounds(bounds, {
            top: 120,
            right: 60,
            bottom: 180,
            left: 60,
          })
          
          if (rankedMode && professionals.length >= 1) {
            setTimeout(() => {
              const maxZoom = map.getZoom()
              if (maxZoom && maxZoom > 14) {
                map.setZoom(14)
              }
              
              const firstProfessional = professionals[0]
              const firstPosition = {
                lat: firstProfessional.location.lat,
                lng: firstProfessional.location.lng
              }
              
              map.panTo({
                lat: firstPosition.lat + 0.008,
                lng: firstPosition.lng
              })
              
              setTimeout(() => {
                const firstMarkerData = markersRef.current[0]
                if (firstMarkerData) {
                  showCompactPreview(firstMarkerData.marker, firstMarkerData.professional, firstMarkerData.rank)
                }
              }, 800)
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
      markersRef.current.forEach(({ marker }) => {
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
