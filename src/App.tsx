import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { DirectorySection } from "./components/DirectorySection"
import { MatchingSection } from "./components/MatchingSection"
import { ProfileSection } from "./components/ProfileSection"
import { MessagesSection } from "./components/MessagesSection"
import { ResourcesSection } from "./components/ResourcesSection"
import { CommunitySection } from "./components/CommunitySection"
import { LiveMapDemo } from "./components/LiveMapDemo"
import { ProviderProfilePage } from "./components/ProviderProfilePage"
import { ProviderOnboarding } from "./components/ProviderOnboarding"
import { HelpDialog } from "./components/HelpDialog"
import { MainNav } from "./components/MainNav"
import { Toaster } from "./components/ui/sonner"
import logoImage from "@/assets/images/NC_logo.png"

type Section = "directory" | "matching" | "profile" | "messages" | "resources" | "community" | "livemap"

function AppLayout({ children }: { children: React.ReactNode }) {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none py-4">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="bg-card/95 backdrop-blur-lg shadow-sm rounded-2xl border border-border/60 pointer-events-auto">
            <div className="px-5 py-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={logoImage} 
                    alt="NeuroConnect" 
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <MainNav 
                  currentSection={"directory"}
                  onNavigate={() => {}}
                  onHelpClick={() => setHelpDialogOpen(true)} 
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {children}

      <HelpDialog
        open={helpDialogOpen}
        onOpenChange={setHelpDialogOpen}
      />

      <Toaster richColors position="top-center" />
    </div>
  )
}

function MainApp() {
  const [currentSection, setCurrentSection] = useState<Section>("livemap")
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)

  const handleNavigate = (section: Section) => {
    setCurrentSection(section)
  }

  // Determine if current section has a map
  const hasMap = currentSection === "livemap" || currentSection === "directory"

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
      case "livemap":
        return <LiveMapDemo />
      default:
        return <DirectorySection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header for map-based pages (overlapping) */}
      {hasMap && (
        <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none py-4">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="bg-card/95 backdrop-blur-lg shadow-sm rounded-2xl border border-border/60 pointer-events-auto">
              <div className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={logoImage} 
                      alt="NeuroConnect" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <MainNav 
                    currentSection={currentSection}
                    onNavigate={handleNavigate}
                    onHelpClick={() => setHelpDialogOpen(true)} 
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Header for non-map pages (regular) */}
      {!hasMap && (
        <header className="bg-card border-b border-border sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="px-5 py-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={logoImage} 
                    alt="NeuroConnect" 
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <MainNav 
                  currentSection={currentSection}
                  onNavigate={handleNavigate}
                  onHelpClick={() => setHelpDialogOpen(true)} 
                />
              </div>
            </div>
          </div>
        </header>
      )}

      {renderSection()}

      <HelpDialog
        open={helpDialogOpen}
        onOpenChange={setHelpDialogOpen}
      />

      <Toaster richColors position="top-center" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route 
          path="/provider/:placeId" 
          element={
            <AppLayout>
              <ProviderProfilePage />
            </AppLayout>
          } 
        />
        <Route 
          path="/provider/join" 
          element={<ProviderOnboarding />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
