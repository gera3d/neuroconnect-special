/**
 * Custom hook for Vapi AI voice assistant integration
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import Vapi from '@vapi-ai/web'

const VAPI_PUBLIC_KEY = '245c6606-babd-43ec-8a6e-fa9736964ef8'
const VAPI_ASSISTANT_ID = '06e7ca99-572b-4623-9c79-b9391524def8'

export function useVapi() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active' | 'ending'>('idle')
  const vapiRef = useRef<Vapi | null>(null)

  // Initialize Vapi client
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      vapiRef.current = new Vapi(VAPI_PUBLIC_KEY)

      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        console.log('Call started')
        setIsCallActive(true)
        setCallStatus('active')
      })

      vapiRef.current.on('call-end', () => {
        console.log('Call ended')
        setIsCallActive(false)
        setIsSpeaking(false)
        setCallStatus('idle')
      })

      vapiRef.current.on('speech-start', () => {
        console.log('Speech started')
        setIsSpeaking(true)
      })

      vapiRef.current.on('speech-end', () => {
        console.log('Speech ended')
        setIsSpeaking(false)
      })

      vapiRef.current.on('error', (error) => {
        console.error('Vapi error:', error)
        setCallStatus('idle')
        setIsCallActive(false)
      })

    } catch (error) {
      console.error('Failed to initialize Vapi:', error)
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop()
      }
    }
  }, [])

  const startCall = useCallback(async () => {
    if (!vapiRef.current || isCallActive) return

    try {
      setCallStatus('connecting')
      await vapiRef.current.start(VAPI_ASSISTANT_ID)
    } catch (error) {
      console.error('Failed to start call:', error)
      setCallStatus('idle')
    }
  }, [isCallActive])

  const endCall = useCallback(() => {
    if (!vapiRef.current || !isCallActive) return

    try {
      setCallStatus('ending')
      vapiRef.current.stop()
    } catch (error) {
      console.error('Failed to end call:', error)
    }
  }, [isCallActive])

  return {
    isCallActive,
    isSpeaking,
    callStatus,
    startCall,
    endCall,
  }
}
