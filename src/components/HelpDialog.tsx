import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Star, 
  Certificate, 
  FunnelSimple, 
  SortAscending, 
  MagnifyingGlass,
  ChatCircle,
  Clock,
  Globe,
  CreditCard
} from "@phosphor-icons/react"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  const features = [
    {
      icon: <MagnifyingGlass size={20} weight="bold" className="text-primary" />,
      title: "Smart Search & Filters",
      description: "Search by name or keyword, then filter by specialty, treatment type, condition, and location to find the perfect match."
    },
    {
      icon: <SortAscending size={20} weight="bold" className="text-primary" />,
      title: "Intelligent Sorting",
      description: "Sort professionals by Best Match, Highest Rated, Most Reviews, or Most Experience to prioritize what matters most to you."
    },
    {
      icon: <Star size={20} weight="fill" className="text-amber-500" />,
      title: "Trust Signals",
      description: "View star ratings, review counts, and years of experience at a glance to assess professional credibility quickly."
    },
    {
      icon: <Certificate size={20} weight="fill" className="text-blue-600" />,
      title: "Verification Badges",
      description: "Verified professionals display a blue checkmark, confirming their credentials have been authenticated."
    },
    {
      icon: <FunnelSimple size={20} weight="bold" className="text-primary" />,
      title: "Active Filter Management",
      description: "See your active filters displayed as removable chips. Clear individual filters or reset all at once."
    },
    {
      icon: <ChatCircle size={20} weight="bold" className="text-primary" />,
      title: "Direct Contact",
      description: "Send messages to professionals accepting new clients or join waitlists for those at capacity."
    },
    {
      icon: <Clock size={20} weight="bold" className="text-success" />,
      title: "Availability Status",
      description: "Instantly see which professionals are accepting new clients with real-time status indicators."
    },
    {
      icon: <Globe size={20} weight="fill" className="text-primary" />,
      title: "Languages & Insurance",
      description: "View supported languages and accepted insurance providers in detailed professional profiles."
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xl font-bold shadow-md ring-1 ring-primary/20">
              🧠
            </div>
            <div>
              <DialogTitle className="text-2xl">How to Use NeuroConnect</DialogTitle>
              <p className="text-sm text-muted-foreground">Your guide to finding specialized support</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">Features & Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3 p-4 bg-muted/30 rounded-lg border border-border/40">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border/40">
                    {feature.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-foreground mb-1">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">Understanding Trust Signals</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="bg-accent text-white font-bold mt-0.5">
                  <Star weight="fill" size={12} className="mr-1" />
                  Top Match
                </Badge>
                <div>
                  <p className="font-semibold text-sm text-foreground">Recommended Professionals</p>
                  <p className="text-xs text-muted-foreground">These professionals are specially matched to common needs and have excellent ratings.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-sm mt-0.5">
                  <Certificate weight="fill" size={14} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Verified Badge</p>
                  <p className="text-xs text-muted-foreground">Credentials and qualifications have been reviewed and authenticated by our team.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} weight="fill" className="text-amber-500" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Star Ratings</p>
                  <p className="text-xs text-muted-foreground">Ratings from 1-5 stars based on verified client reviews and feedback.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-xs font-semibold text-success">Accepting Clients</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Availability Status</p>
                  <p className="text-xs text-muted-foreground">Green indicator means the professional is currently accepting new clients. "Waitlist" means you can join their waiting list.</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">Quick Start Guide</h3>
            <div className="space-y-2.5">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                <p className="text-sm text-foreground/90 pt-0.5"><span className="font-semibold">Browse all professionals</span> or use the search bar to find specific names or keywords.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                <p className="text-sm text-foreground/90 pt-0.5"><span className="font-semibold">Apply filters</span> on the left sidebar to narrow results by specialty, treatment type, condition, or location.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                <p className="text-sm text-foreground/90 pt-0.5"><span className="font-semibold">Sort results</span> using the dropdown menu to prioritize by Best Match, Rating, Reviews, or Experience.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</div>
                <p className="text-sm text-foreground/90 pt-0.5"><span className="font-semibold">Click on a professional card</span> to view their complete profile with detailed information.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">5</div>
                <p className="text-sm text-foreground/90 pt-0.5"><span className="font-semibold">Send a message or join waitlist</span> directly from the professional's profile.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-lg border border-primary/20">
            <p className="text-sm text-foreground/90 leading-relaxed">
              <span className="font-bold text-primary">💡 Pro Tip:</span> Use the "Active Filters" section to see exactly what filters you've applied. Click the X on any filter chip to quickly remove it!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
