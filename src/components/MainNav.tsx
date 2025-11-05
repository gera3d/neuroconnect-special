import { Button } from "@/components/ui/button"
import {
  MagnifyingGlass,
  Sparkle,
  UserCircle,
  ChatCircle,
  BookOpen,
  Users,
  Question,
  MapTrifold,
} from "@phosphor-icons/react"

type Section = "directory" | "matching" | "profile" | "messages" | "resources" | "community" | "livemap"

interface NavItem {
  id: Section
  label: string
  icon: React.ReactNode
}

interface MainNavProps {
  currentSection: Section
  onNavigate: (section: Section) => void
  onHelpClick: () => void
}

export function MainNav({ currentSection, onNavigate, onHelpClick }: MainNavProps) {
  const navItems: NavItem[] = [
    {
      id: "directory",
      label: "Directory",
      icon: <MagnifyingGlass size={18} weight="bold" />,
    },
    {
      id: "matching",
      label: "Matching",
      icon: <Sparkle size={18} weight="bold" />,
    },
    {
      id: "livemap",
      label: "Live Map",
      icon: <MapTrifold size={18} weight="bold" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserCircle size={18} weight="bold" />,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <ChatCircle size={18} weight="bold" />,
    },
    {
      id: "resources",
      label: "Resources",
      icon: <BookOpen size={18} weight="bold" />,
    },
    {
      id: "community",
      label: "Community",
      icon: <Users size={18} weight="bold" />,
    },
  ]

  return (
    <nav className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={currentSection === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-1.5 h-9 px-3 text-sm font-medium rounded-lg transition-all ${
              currentSection === item.id 
                ? 'shadow-sm' 
                : 'hover:bg-muted'
            }`}
          >
            {item.icon}
            <span className="hidden lg:inline">{item.label}</span>
          </Button>
        ))}
      </div>
      <div className="w-px h-6 bg-border mx-1"></div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.href = '/provider/join'}
        className="flex items-center gap-1.5 h-9 px-3 rounded-lg border-primary text-primary hover:bg-primary hover:text-white transition-all"
      >
        <UserCircle size={18} weight="bold" />
        <span className="hidden md:inline text-sm font-medium">Join as Provider</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onHelpClick}
        className="flex items-center gap-1.5 h-9 px-3 rounded-lg hover:bg-muted"
      >
        <Question size={18} weight="bold" />
        <span className="hidden sm:inline text-sm">Help</span>
      </Button>
    </nav>
  )
}
