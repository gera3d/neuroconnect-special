import { useState } from "react"
import { DirectorySection } from "./components/DirectorySection"
import { MatchingSection } from "./components/MatchingSection"
import { ProfileSection } from "./components/ProfileSection"
import { MessagesSection } from "./components/MessagesSection"
import { ResourcesSection } from "./components/ResourcesSection"
import { CommunitySection } from "./components/CommunitySection"
import { HelpDialog } from "./components/HelpDialog"
import { MainNav } from "./components/MainNav"
import { Toaster } from "./components/ui/sonner"
import logoImage from "@/assets/images/neuroconnect_logo_vector_smooth_preview.png"

type Section = "directory" | "matching" | "profile" | "messages" | "resources" | "community"

function App() {
  const [currentSection, setCurrentSection] = useState<Section>("directory")
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)

  const handleNavigate = (section: Section) => {
    setCurrentSection(section)
  }

  const renderSection = () => {
    switch (currentSection) {
      case "directory":
        return <DirectorySection />
      case "matching":
        return <MatchingSection />
      case "profile":
        return <ProfileSection />
      case "messages":
        return <MessagesSection />
      case "resources":
        return <ResourcesSection />
      case "community":
        return <CommunitySection />
      default:
        return <DirectorySection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/60 sticky top-0 z-20 backdrop-blur-md bg-card/95 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="NeuroConnect" 
                className="h-16 w-auto"
              />
            </div>
            <MainNav 
              currentSection={currentSection}
              onNavigate={handleNavigate}
              onHelpClick={() => setHelpDialogOpen(true)} 
            />
          </div>
        </div>
      </header>

      {renderSection()}

      <HelpDialog
        open={helpDialogOpen}
        onOpenChange={setHelpDialogOpen}
      />

      <Toaster richColors position="top-center" />
    </div>
  )
}

export default App
