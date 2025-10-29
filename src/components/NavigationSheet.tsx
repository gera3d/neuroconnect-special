import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  MagnifyingGlass,
  Sparkle,
  UserCircle,
  ChatCircle,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
} from "@phosphor-icons/react"

interface NavItem {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  isActive: boolean
  isComingSoon?: boolean
}

interface NavigationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (section: string) => void
  currentSection: string
}

export function NavigationSheet({ open, onOpenChange, onNavigate, currentSection }: NavigationSheetProps) {
  const navItems: NavItem[] = [
    {
      id: "directory",
      label: "Professional Directory",
      description: "Browse and filter specialized professionals",
      icon: <MagnifyingGlass size={22} weight="bold" />,
      isActive: true,
    },
    {
      id: "matching",
      label: "Smart Matching",
      description: "AI-powered professional recommendations",
      icon: <Sparkle size={22} weight="bold" />,
      isActive: true,
    },
    {
      id: "profile",
      label: "Family Profile",
      description: "Manage your child's information and needs",
      icon: <UserCircle size={22} weight="bold" />,
      isActive: true,
    },
    {
      id: "messages",
      label: "Messages",
      description: "Communicate with professionals directly",
      icon: <ChatCircle size={22} weight="bold" />,
      isActive: true,
    },
    {
      id: "resources",
      label: "Resources",
      description: "Articles, guides, and educational content",
      icon: <BookOpen size={22} weight="bold" />,
      isActive: true,
    },
    {
      id: "community",
      label: "Community",
      description: "Connect with other families and share experiences",
      icon: <Users size={22} weight="bold" />,
      isActive: true,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-2xl font-bold shadow-md ring-1 ring-primary/20">
              🧠
            </div>
            <div>
              <SheetTitle className="text-xl">NeuroConnect</SheetTitle>
              <SheetDescription className="text-xs">
                Your complete support platform
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-border"></div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Platform Features</span>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`
                    w-full flex items-start gap-3 p-4 rounded-lg border transition-all
                    ${
                      currentSection === item.id
                        ? 'bg-primary/10 border-primary/40 shadow-sm'
                        : item.isActive 
                          ? 'bg-card border-border/40 hover:bg-primary/5 hover:border-primary/30 cursor-pointer' 
                          : 'bg-muted/30 border-border/40 cursor-not-allowed opacity-75'
                    }
                  `}
                  disabled={!item.isActive}
                  onClick={() => {
                    if (item.isActive) {
                      onNavigate(item.id)
                    }
                  }}
                >
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                    ${
                      currentSection === item.id
                        ? 'bg-primary/20 text-primary'
                        : item.isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-sm ${item.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.label}
                      </h3>
                      {currentSection === item.id ? (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-bold px-1.5 py-0 h-4">
                          <CheckCircle size={10} weight="fill" className="mr-0.5" />
                          Active
                        </Badge>
                      ) : item.isComingSoon ? (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-border text-[9px] font-bold px-1.5 py-0 h-4">
                          <Clock size={10} weight="bold" className="mr-0.5" />
                          Soon
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-5 rounded-lg border border-border/40">
            <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
              <Sparkle size={16} weight="fill" className="text-primary" />
              Complete Platform
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              All core features are now available to help you find and connect with specialized support.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle size={14} weight="bold" className="text-success flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80">Browse and filter professional directory</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} weight="bold" className="text-success flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80">Smart matching based on your needs</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} weight="bold" className="text-success flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80">Direct messaging with professionals</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} weight="bold" className="text-success flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80">Educational resources and support community</p>
              </div>
            </div>
          </div>

          <div className="text-center py-4 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground">
              NeuroConnect © 2024 • Connecting families with specialized care
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
