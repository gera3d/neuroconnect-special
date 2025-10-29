import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MagnifyingGlass,
  Sparkle,
  UserCircle,
  ChatCircle,
  BookOpen,
  Users,
  Question,
} from "@phosphor-icons/react"

interface NavItem {
  id: string
  label: string
  shortLabel?: string
  icon: React.ReactNode
  isActive: boolean
  isComingSoon?: boolean
}

interface MainNavProps {
  onHelpClick: () => void
}

export function MainNav({ onHelpClick }: MainNavProps) {
  const navItems: NavItem[] = [
    {
      id: "directory",
      label: "Directory",
      icon: <MagnifyingGlass size={16} weight="bold" />,
      isActive: true,
    },
    {
      id: "matching",
      label: "Matching",
      icon: <Sparkle size={16} weight="bold" />,
      isActive: false,
      isComingSoon: true,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserCircle size={16} weight="bold" />,
      isActive: false,
      isComingSoon: true,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <ChatCircle size={16} weight="bold" />,
      isActive: false,
      isComingSoon: true,
    },
    {
      id: "resources",
      label: "Resources",
      icon: <BookOpen size={16} weight="bold" />,
      isActive: false,
      isComingSoon: true,
    },
    {
      id: "community",
      label: "Community",
      icon: <Users size={16} weight="bold" />,
      isActive: false,
      isComingSoon: true,
    },
  ]

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={item.isActive ? "default" : "ghost"}
            size="sm"
            disabled={!item.isActive}
            className="flex items-center gap-1.5 h-9 text-xs relative"
          >
            {item.icon}
            <span className="hidden lg:inline">{item.label}</span>
            {item.isComingSoon && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 text-[9px] px-1 py-0 h-4 leading-none"
              >
                Soon
              </Badge>
            )}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onHelpClick}
        className="flex items-center gap-1.5 h-9"
      >
        <Question size={16} weight="bold" />
        <span className="hidden sm:inline text-xs">Help</span>
      </Button>
    </nav>
  )
}
