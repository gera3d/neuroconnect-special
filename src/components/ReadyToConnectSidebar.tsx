import { useState, useEffect } from "react"
import { Phone, ClipboardCheck, MapPin, Clock, Shield, CheckCircle2, ChevronRight, Sparkles, PhoneCall, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GooglePlace } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface ReadyToConnectSidebarProps {
  callStatus: 'idle' | 'connecting' | 'active' | 'ending'
  isCallActive: boolean
  isSpeaking: boolean
  provider: GooglePlace
  onStartConversation: (e: React.MouseEvent<HTMLButtonElement>) => void
  onOpenQuestions: () => void
  className?: string
}

export function ReadyToConnectSidebar({
  callStatus,
  isCallActive,
  isSpeaking,
  provider,
  onStartConversation,
  onOpenQuestions,
  className = ''
}: ReadyToConnectSidebarProps) {
  const [progress, setProgress] = useState(0)

  // Animate progress bar when connecting
  useEffect(() => {
    if (callStatus === 'connecting') {
      setProgress(0)
      const duration = 2000 // 2 seconds to complete
      const steps = 60
      const increment = 100 / steps
      const stepDuration = duration / steps

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return Math.min(prev + increment, 100)
        })
      }, stepDuration)

      return () => clearInterval(interval)
    } else if (callStatus === 'idle') {
      setProgress(0)
    }
  }, [callStatus])

  return (
    <Card className={`border-2 border-slate-200 shadow-lg ${className}`}>
      <CardHeader className="bg-white border-b border-slate-200">
        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          Ready to Connect?
        </CardTitle>
        <CardDescription className="text-base text-slate-600">
          Choose how you'd like to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Getting Started CTAs */}
        <div className="space-y-3 pb-4 border-b border-slate-200">
          {/* Tell About Your Situation by Voice - Animated Button */}
          <div className="relative">
            <Button 
              onClick={onStartConversation}
              disabled={callStatus === 'connecting' || callStatus === 'ending'}
              size="lg"
              className={`w-full font-bold text-base h-14 shadow-md transition-all duration-200 relative overflow-hidden justify-between ${
                isCallActive
                  ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground active:scale-[0.98]'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {/* Progress Bar Background - Only visible when connecting */}
              <AnimatePresence>
                {callStatus === 'connecting' && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-md"
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </AnimatePresence>

              {/* Button Content */}
              <AnimatePresence mode="wait">
                {callStatus === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="relative z-10 flex items-center gap-2 w-full"
                  >
                    <Phone className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">Talk About Your Situation</span>
                    <Badge variant="secondary" className="bg-white/95 text-blue-700 border-0 font-bold text-xs px-2 py-0.5 flex-shrink-0">1 min</Badge>
                  </motion.div>
                )}

                {callStatus === 'connecting' && (
                  <motion.div
                    key="connecting"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="relative z-10 flex items-center gap-2 w-full"
                  >
                    <motion.div
                      animate={{ 
                        rotate: 360,
                      }}
                      transition={{ 
                        rotate: { duration: 1.2, repeat: Infinity, ease: "linear" },
                      }}
                      className="flex-shrink-0"
                    >
                      <PhoneCall className="h-5 w-5" />
                    </motion.div>
                    <span className="flex-1 text-left">Connecting to AI Agent</span>
                    <Badge variant="secondary" className="bg-white/95 text-blue-700 border-0 font-bold text-xs px-2 py-0.5 flex-shrink-0">
                      {Math.round(progress)}%
                    </Badge>
                  </motion.div>
                )}

                {callStatus === 'active' && (
                  <motion.div
                    key="active"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="relative z-10 flex items-center gap-2 w-full"
                  >
                    <motion.div
                      animate={{ 
                        scale: isSpeaking ? [1, 1.15, 1] : 1
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: isSpeaking ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                      className="flex-shrink-0"
                    >
                      <Mic className="h-5 w-5" />
                    </motion.div>
                    <span className="flex-1 text-left">End Call</span>
                    <Badge 
                      variant="secondary" 
                      className={`border-0 font-bold text-xs px-2 py-0.5 flex-shrink-0 transition-all duration-200 ${
                        isSpeaking 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {isSpeaking ? 'Speaking' : 'Listening'}
                    </Badge>
                  </motion.div>
                )}

                {callStatus === 'ending' && (
                  <motion.div
                    key="ending"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 0.95, opacity: 0.6 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 flex items-center gap-2 w-full"
                  >
                    <Phone className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1 text-left">Ending Call...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Connection Success Celebration */}
            <AnimatePresence>
              {callStatus === 'active' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute -top-10 left-0 right-0 flex justify-center pointer-events-none"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold shadow-sm border border-green-200">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Connected!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-600 font-semibold">Or</span>
            </div>
          </div>
          
          {/* Select Options */}
          <Button 
            onClick={onOpenQuestions}
            size="lg"
            variant="outline"
            className="w-full border-2 border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50 hover:text-slate-900 text-slate-900 font-bold text-base h-12 shadow-sm transition-all duration-200 active:scale-[0.98] justify-between"
          >
            <ClipboardCheck className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left px-2">Select From Quick Options</span>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-0 font-bold text-xs px-2 py-0.5 flex-shrink-0">2 min</Badge>
          </Button>
          
          {/* What Happens Next - Enhanced */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 mt-3">
            <p className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              What happens next:
            </p>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>We take <strong className="text-slate-900">detailed notes</strong> about your situation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Your info is sent directly to {provider.name}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">They'll have deeper insight into you</strong> — no repeating yourself!</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Location Info */}
        {provider.vicinity && (
          <div className="pt-0">
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 mb-1">Location</p>
                <p className="text-sm text-slate-600 leading-relaxed">{provider.vicinity}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hours Info */}
        {provider.opening_hours && (
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-slate-600" />
              <div className="flex-1">
                <p className="font-bold text-slate-900">Hours</p>
              </div>
              {provider.opening_hours.open_now !== undefined && (
                <Badge 
                  className={`${
                    provider.opening_hours.open_now 
                      ? 'bg-green-100 text-green-700 border-0' 
                      : 'bg-orange-100 text-orange-700 border-0'
                  }`}
                >
                  {provider.opening_hours.open_now ? 'Open Now' : 'Closed'}
                </Badge>
              )}
            </div>
            {provider.opening_hours.weekday_text && (
              <p className="text-sm text-slate-700 leading-relaxed">
                {provider.opening_hours.weekday_text[new Date().getDay()]}
              </p>
            )}
          </div>
        )}

        {/* What We Accept */}
        <div className="pt-4 border-t border-slate-200">
          <p className="font-bold text-slate-900 mb-3">We Accept</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Most insurance plans</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>New patients welcome</span>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-slate-700 leading-relaxed">
              Your information is secure and confidential
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
