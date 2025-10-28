import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  List,
  MagnifyingGlass,
  Sparkle,
  UserCircle,
  ChatCircle,
  BookOpen,
  Users,
  Question,
} from "@phosphor-icons/react"
import { Separator } from "@/components/ui/separator"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  isActive: boolean
  isComingSoon?: boolean
}

interface MainNavProps {
  onHelpClick: () => void
}

export function MainNav({ onHelpClick }: MainNavProps) {
  const [open, setOpen] = useState(false)

  const navItems: NavItem[] = [
    {
      id: "directory",
      label: "Professional Directory",
      icon: <MagnifyingGlass size={20} weight="duotone" />,
      description: "Browse and filter specialized professionals",
      isActive: true,
    },
    {
      id: "matching",
      label: "Smart Matching",
      icon: <Sparkle size={20} weight="duotone" />,
      description: "Get personalized professional recommendations",
      isActive: false,
      isComingSoon: true,
    },
    {
      id: "profile",
      label: "Family Profile",
      icon: <UserCircle size={20} weight="duotone" />,
      description: "Manage your family's needs and preferences",
      isActive: false,
      isComingSoon: true,
    },
    {
      id: "messages",
      label: "Messages & Scheduling",
      icon: <ChatCircle size={20} weight="duotone" />,
      description: "Secure chat and appointment booking",
      isActive: false,
      isComingSoon: true,
    },
    {
      id: "resources",
      label: "Resource Library",
      icon: <BookOpen size={20} weight="duotone" />,
      description: "Guides, videos, and educational content",
      isActive: false,
      isComingSoon: true,
    },
    {
      id: "community",
      label: "Community Forum",
      icon: <Users size={20} weight="duotone" />,
      description: "Connect with other families and share experiences",
      isActive: false,
      isComingSoon: true,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-9"
          >
            <List size={18} weight="bold" />
            <span className="hidden sm:inline">Menu</span>
          </Button>
        </SheetTrigger>
        <Button
          variant="outline"
          size="sm"
          onClick={onHelpClick}
          className="flex items-center gap-1.5 h-9"
        >
          <Question size={18} weight="bold" />
          <span className="hidden sm:inline">Help</span>
        </Button>
      </div>

      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-left flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-lg font-bold shadow-md ring-1 ring-primary/20">
              🧠
            </div>
            NeuroConnect
          </SheetTitle>
          <SheetDescription className="text-left">
            Connecting neurodivergent families with specialized support
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-1">
          {navItems.map((item, index) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.isActive) {
                    setOpen(false)
                  }
                }}
                disabled={!item.isActive}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  item.isActive
                    ? "bg-primary/5 hover:bg-primary/10 cursor-pointer border border-primary/20"
                    : "opacity-60 cursor-not-allowed hover:bg-muted/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 ${
                      item.isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-semibold text-sm ${
                          item.isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </h3>
                      {item.isActive && (
                        <Badge
                          variant="default"
                          className="text-xs px-1.5 py-0 h-5 bg-primary/10 text-primary hover:bg-primary/10"
                        >
                          Active
                        </Badge>
                      )}
                      {item.isComingSoon && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0 h-5"
                        >
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
              {index < navItems.length - 1 && index === 0 && (
                <Separator className="my-3" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted/40 rounded-lg border border-border/60">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Sparkle size={16} weight="fill" className="text-primary" />
            Platform Status
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            NeuroConnect is currently in development. The Professional Directory is
            live for browsing specialists. Additional features will be released as
            they're completed.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
