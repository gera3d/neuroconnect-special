import { Button } from "@/components/ui/button"
import {
  MagnifyingGlass,
  Sparkle,
  UserCircle,
  ChatCircle,
  BookOpen,
  Users,
  Question,
} from "@phosphor-icons/react"

type Section = "directory" | "matching" | "profile" | "messages" | "resources" | "community"

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
      icon: <MagnifyingGlass size={16} weight="bold" />,
    },
    {
      id: "matching",
      label: "Matching",
      icon: <Sparkle size={16} weight="bold" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserCircle size={16} weight="bold" />,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <ChatCircle size={16} weight="bold" />,
    },
    {
      id: "resources",
      label: "Resources",
      icon: <BookOpen size={16} weight="bold" />,
    },
    {
      id: "community",
      label: "Community",
      icon: <Users size={16} weight="bold" />,
    },
  ]

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={currentSection === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onNavigate(item.id)}
            className="flex items-center gap-1.5 h-9 text-xs"
          >
            {item.icon}
            <span className="hidden lg:inline">{item.label}</span>
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
