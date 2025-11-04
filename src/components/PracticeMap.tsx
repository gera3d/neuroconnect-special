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
}

function CustomMarker({ rank, delay, onClick }: CustomMarkerProps) {
  const rankConfig = [
    { 
      emoji: "🥇", 
      bg: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
      shadow: "0 8px 32px rgba(255, 215, 0, 0.6), 0 0 0 4px rgba(255, 215, 0, 0.2)",
      ring: "linear-gradient(135deg, #FFD700, #FFA500)",
      size: 72,
      pulseColor: "rgba(255, 215, 0, 0.4)"
    },
    { 
      emoji: "🥈", 
      bg: "linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 50%, #E8E8E8 100%)",
      shadow: "0 6px 24px rgba(192, 192, 192, 0.5), 0 0 0 3px rgba(192, 192, 192, 0.2)",
      ring: "linear-gradient(135deg, #E8E8E8, #C0C0C0)",
      size: 64,
      pulseColor: "rgba(192, 192, 192, 0.4)"
    },
    { 
      emoji: "🥉", 
      bg: "linear-gradient(135deg, #E59C6C 0%, #CD7F32 50%, #E59C6C 100%)",
      shadow: "0 6px 20px rgba(205, 127, 50, 0.4), 0 0 0 3px rgba(205, 127, 50, 0.2)",
      ring: "linear-gradient(135deg, #E59C6C, #CD7F32)",
      size: 58,
      pulseColor: "rgba(205, 127, 50, 0.4)"
    }
  ][rank - 1]

  const particles = Array.from({ length: rank === 1 ? 12 : 8 }, (_, i) => ({
    id: i,
    angle: (360 / (rank === 1 ? 12 : 8)) * i,
    color: rank === 1 ? ["#FFD700", "#FFA500", "#FF6B6B", "#4ECDC4"][i % 4] : 
           rank === 2 ? ["#E8E8E8", "#C0C0C0", "#A8A8A8"][i % 3] :
           ["#E59C6C", "#CD7F32", "#B8732D"][i % 3]
  }))

  return (
    <motion.div
      initial={{ 
        scale: 0,
        y: -100,
        opacity: 0,
        rotate: -180
      }}
      animate={{ 
        scale: 1,
        y: 0,
        opacity: 1,
        rotate: 0
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: delay,
        duration: 0.8
      }}
      whileHover={{ 
        scale: 1.15,
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      onClick={onClick}
      style={{
        position: "relative",
        cursor: "pointer",
        width: rankConfig.size,
        height: rankConfig.size,
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [0, Math.cos((particle.angle * Math.PI) / 180) * (rank === 1 ? 60 : 40)],
            y: [0, Math.sin((particle.angle * Math.PI) / 180) * (rank === 1 ? 60 : 40)]
          }}
          transition={{
            duration: 1.2,
            delay: delay + 0.8,
            ease: "easeOut"
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: rank === 1 ? 8 : 6,
            height: rank === 1 ? 8 : 6,
            borderRadius: "50%",
            background: particle.color,
            boxShadow: `0 0 ${rank === 1 ? 12 : 8}px ${particle.color}`,
            zIndex: 4
          }}
        />
      ))}

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 0, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.8
        }}
        style={{
          position: "absolute",
          inset: -12,
          background: rankConfig.pulseColor,
          borderRadius: "50%",
          zIndex: 0
        }}
      />
      
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: "absolute",
          inset: -4,
          background: rankConfig.ring,
          borderRadius: "50%",
          opacity: 0.3,
          zIndex: 1
        }}
      />
      
      <motion.div
        animate={{
          boxShadow: [
            rankConfig.shadow,
            rankConfig.shadow.replace(/0.6/g, "0.9").replace(/0.5/g, "0.8").replace(/0.4/g, "0.7"),
            rankConfig.shadow
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: rankConfig.bg,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: rankConfig.size * 0.5,
          zIndex: 2,
          border: "3px solid rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)"
        }}
      >
        <motion.span
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 1
          }}
        >
          {rankConfig.emoji}
        </motion.span>
      </motion.div>
      
      {rank === 1 && (
        <>
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: delay + 0.4, type: "spring", stiffness: 300 }}
            style={{
              position: "absolute",
              top: -22,
              left: -8,
              fontSize: 24,
              zIndex: 3
            }}
          >
            ✨
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: delay + 0.6, type: "spring", stiffness: 300 }}
            style={{
              position: "absolute",
              top: -18,
              right: -8,
              fontSize: 20,
              zIndex: 3
            }}
          >
            ⭐
          </motion.div>
        </>
      )}
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.3 }}
        style={{
          position: "absolute",
          top: -12,
          right: -12,
          width: 32,
          height: 32,
          background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: "bold",
          color: "#000",
          border: "2px solid rgba(255, 255, 255, 1)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
          zIndex: 5
        }}
      >
        {rank}
      </motion.div>
      
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          height: 20,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)",
          transformOrigin: "top",
          zIndex: 0
        }}
      />
    </motion.div>
  )
}

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
        const loadOrder = rankedMode && professionals.length >= 3 
          ? [2, 1, 0]
          : professionals.map((_, i) => i)

        professionals.forEach((professional, index) => {
          const position = {
            lat: professional.location.lat,
            lng: professional.location.lng,
          }

          const markerDiv = document.createElement("div")
          markerDiv.style.position = "relative"
          
          if (rankedMode && index < 3) {
            const orderIndex = loadOrder.indexOf(index)
            const delay = orderIndex * 0.5
            
            const root = createRoot(markerDiv)
            root.render(
              <CustomMarker
                rank={index + 1}
                delay={delay}
                onClick={() => {
                  if (infoWindowRef.current) {
                    infoWindowRef.current.close()
                    setInfoWindowOpen(false)
                  }
                  if (onMarkerClick) {
                    onMarkerClick(professional)
                  }
                }}
              />
            )
          } else {
            const basicPin = new PinElement({
              background: professional.isRecommended ? "#4169E1" : "#6B7280",
              borderColor: professional.isRecommended ? "#1E40AF" : "#4B5563",
              glyphColor: "#FFFFFF",
              scale: professional.isRecommended ? 1.2 : 1,
            })
            markerDiv.appendChild(basicPin.element)
          }

          const marker = new AdvancedMarkerElement({
            map,
            position,
            content: markerDiv,
            title: professional.name,
          })

          if (rankedMode && index === 0) {
            setTimeout(() => {
              showFirstPlaceTeaser(marker, professional)
            }, 2500)
          }

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
          if (rankedMode && professionals.length >= 1) {
            const firstPlacePosition = {
              lat: professionals[0].location.lat,
              lng: professionals[0].location.lng,
            }
            
            setTimeout(() => {
              map.panTo(firstPlacePosition)
              map.setZoom(14)
            }, 1800)
          } else {
            map.fitBounds(bounds, {
              top: 200,
              right: 80,
              bottom: 80,
              left: 80,
            })
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
