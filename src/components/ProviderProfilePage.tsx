import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GooglePlace } from '@/lib/types';
import { GooglePlacesService } from '@/services/googlePlaces';
import { useGoogleMaps } from '@/hooks/use-google-maps';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ClaimListingDialog } from './ClaimListingDialog';
import { SpotlightReviewCarousel } from './reviews/SpotlightReviewCarousel';
import { SmartMatching } from './SmartMatching';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProviderPageSkeleton } from '@/components/ui/skeleton-loader';
// import { FancyReviewsMarquee } from './reviews/FancyReviewsMarquee'; // Alternative review display
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  MessageSquare,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Mail,
  Award,
  Users,
  TrendingUp,
  Shield,
  ThumbsUp,
  Video,
  DollarSign,
  Accessibility,
  Brain,
  Headphones,
  ExternalLink,
  Send,
  ChevronRight,
  Zap,
  Sparkles,
  Building,
  Tag,
  BarChart,
  ClipboardCheck,
} from 'lucide-react';

export function ProviderProfilePage() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<GooglePlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showQuestionnaireDialog, setShowQuestionnaireDialog] = useState(false);
  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps();

  useEffect(() => {
    if (!placeId || !mapsLoaded) {
      console.log('[ProviderProfilePage] Waiting for prerequisites:', { placeId: !!placeId, mapsLoaded });
      return;
    }

    const loadProviderDetails = async () => {
      try {
        console.log('[ProviderProfilePage] Loading provider details for:', placeId);
        const service = GooglePlacesService.getInstance();
        const details = await service.getPlaceDetails(placeId);
        
        if (details) {
          console.log('[ProviderProfilePage] Provider details loaded successfully:', details.name);
          setProvider(details as GooglePlace);
        } else {
          console.error('[ProviderProfilePage] getPlaceDetails returned null for:', placeId);
        }
        
        // TODO: Check if this listing is already claimed
        // setIsClaimed(await checkIfClaimed(placeId));
      } catch (error) {
        console.error('[ProviderProfilePage] Error loading provider details:', error);
        console.error('[ProviderProfilePage] Error type:', typeof error);
        console.error('[ProviderProfilePage] Error message:', error instanceof Error ? error.message : String(error));
        if (error instanceof Error && error.stack) {
          console.error('[ProviderProfilePage] Stack trace:', error.stack);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProviderDetails();
  }, [placeId, mapsLoaded]);

  // Handler for "Talk to Someone Now" button
  const handleStartConversation = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Check if it's desktop (width > 768px)
    if (window.innerWidth > 768) {
      e.preventDefault();
      // Trigger the Vapi widget
      const vapiWidget = document.querySelector('vapi-widget') as any;
      if (vapiWidget && typeof vapiWidget.open === 'function') {
        vapiWidget.open();
      }
    } else {
      // On mobile, redirect to phone call
      window.location.href = 'tel:5617577914';
    }
  };

  // Handler for "Answer Questions" button
  const handleOpenQuestions = () => {
    setShowQuestionnaireDialog(true);
  };

  // Handler when questionnaire is completed
  const handleQuestionnaireComplete = () => {
    setShowQuestionnaireDialog(false);
    // Could add additional logic here, like showing a success message
  };

  if (mapsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4">
        <Card className="max-w-md w-full border-2 border-red-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-red-600">Unable to Load Maps</CardTitle>
              <CardDescription className="mt-2 text-base">
                We're having trouble connecting to Google Maps. This might be a temporary issue.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-semibold text-slate-900">Try these steps:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Check your internet connection</li>
                <li>Refresh the page</li>
                <li>Try again in a few moments</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Refresh Page
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="flex-1 gap-2"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || !mapsLoaded) {
    return <ProviderPageSkeleton />;
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4">
        <Card className="max-w-md w-full border-2 border-slate-200 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Building className="h-8 w-8 text-slate-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-slate-900">Provider Not Found</CardTitle>
              <CardDescription className="mt-2 text-base">
                We couldn't find the provider you're looking for. They may have been removed or the link might be incorrect.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-semibold text-blue-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                What you can do:
              </p>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Search for similar providers</li>
                <li>Browse our directory</li>
                <li>Contact support if you think this is an error</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/')} 
                className="flex-1 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Button>
              <Button 
                onClick={() => navigate(-1)} 
                variant="outline"
                className="flex-1"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const photoUrl = provider.photos?.[0]?.getUrl({ maxWidth: 800 });

  // Enhanced data extraction
  const businessType = provider.types?.find(type => 
    ['doctor', 'health', 'hospital', 'physiotherapist', 'dentist'].includes(type)
  )?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Healthcare Provider';

  const priceLevel = provider.price_level 
    ? '$'.repeat(provider.price_level) 
    : null;

  const totalPhotos = provider.photos?.length || 0;
  const hasWebsite = !!provider.website;
  const hasPhone = !!provider.formatted_phone_number;
  const isOpenNow = provider.opening_hours?.open_now;
  
  // Calculate response rate based on review recency
  const recentReviews = provider.reviews?.filter(review => {
    const reviewDate = new Date(review.time * 1000);
    const monthsAgo = (Date.now() - reviewDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsAgo <= 3;
  }).length || 0;
  
  const responseRate = provider.user_ratings_total && provider.user_ratings_total > 10
    ? Math.min(95, 75 + (recentReviews * 5))
    : null;

  // Extract popular times/busy info from types
  const isPopular = (provider.user_ratings_total || 0) > 50;
  const isHighlyRated = (provider.rating || 0) >= 4.5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Premium Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Search</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-2 text-slate-600 hover:bg-slate-100"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Conversion-Optimized Landing Page Design */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50">
        {/* Simplified decorative background - single layer for better performance */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            
            {/* Left Column - Value Proposition & CTA */}
            <div>
              {/* Trust Badges - Above Headline */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {isClaimed && (
                  <Badge className="gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold shadow-lg">
                    <Shield className="h-3.5 w-3.5" />
                    VERIFIED PROVIDER
                  </Badge>
                )}
                {isHighlyRated && (
                  <Badge className="gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-full text-xs font-bold shadow-lg">
                    <Award className="h-3.5 w-3.5" />
                    TOP RATED
                  </Badge>
                )}
              </div>

              {/* Headline with Photo Side by Side */}
              <div className="flex gap-6 items-center mb-8">
                {/* Provider Photo - LEFT SIDE */}
                <div className="relative flex-shrink-0">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5" style={{ width: '140px', height: '175px' }}>
                    <Avatar className="h-full w-full rounded-none">
                      <AvatarImage 
                        src={photoUrl} 
                        className="object-cover"
                        loading="eager"
                        fetchPriority="high"
                      />
                      <AvatarFallback className="text-4xl bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 text-white font-bold rounded-none">
                        {getInitials(provider.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Rating Badge - Overlay on bottom */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-xl border border-white/20">
                        <div className="flex items-center justify-center gap-1.5">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-slate-900">
                            {provider.rating ? provider.rating.toFixed(1) : '4.8'}
                          </span>
                          <span className="text-xs text-slate-600">
                            ({provider.user_ratings_total || 229})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Headline - RIGHT SIDE */}
                <div className="flex-1">
                  <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.05]">
                    Expert Care for{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600">
                      Neurodivergent Minds
                    </span>
                  </h1>
                </div>
              </div>

              {/* Provider Name & Details */}
              <div className="mb-10">
                <div className="flex items-baseline gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-slate-900">{provider.name}</h2>
                  {businessType && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-md">
                      {businessType}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {provider.business_status === 'OPERATIONAL' && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1.5 text-base">
                      <CheckCircle2 className="h-4 w-4" />
                      Accepting New Patients
                    </span>
                  )}
                  {isOpenNow && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1.5 text-base">
                      <Clock className="h-4 w-4" />
                      Open Now
                    </span>
                  )}
                </div>
              </div>

              {/* Key Benefits - Bullet Points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-bold text-slate-900 text-lg mb-1">Specialized in Neurodivergent Care</p>
                    <p className="text-slate-600">Autism, ADHD, and sensory processing expertise</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25">
                    <Accessibility className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-bold text-slate-900 text-lg mb-1">Autism-Affirming Approach</p>
                    <p className="text-slate-600">Respectful, strength-based care for your family</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                    <Headphones className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-bold text-slate-900 text-lg mb-1">Sensory-Friendly Environment</p>
                    <p className="text-slate-600">Calm, welcoming spaces designed for comfort</p>
                  </div>
                </div>
              </div>

              {/* Primary Value Proposition */}
              <div className="mb-8">
                <p className="text-xl text-slate-700 leading-relaxed font-medium">
                  Specialized care that understands your family's unique needs. Connect with {provider.name} to learn how they can help.
                </p>
              </div>

              {/* Trust Signals Below Value Prop */}
              <div className="flex flex-wrap items-center gap-8 text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-700">Insurance Accepted</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-semibold text-slate-700">Family-Centered</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Trust Elements */}
            <div className="space-y-6">

              {/* Get in Touch Card - Shows in Hero and becomes sticky */}
              <Card className="border-2 border-slate-200 shadow-lg">
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
                    {/* Talk to Someone Now */}
                    <Button 
                      onClick={handleStartConversation}
                      size="lg"
                      className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base h-12 shadow-md transition-all hover:scale-[1.02]"
                    >
                      <Phone className="h-5 w-5" />
                      Talk to Someone Right Now
                      <Badge variant="secondary" className="ml-auto bg-white/90 text-blue-700 border-0 font-bold text-xs">2 min</Badge>
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-slate-600 font-semibold">Or</span>
                      </div>
                    </div>
                    
                    {/* Answer Questions */}
                    <Button 
                      onClick={handleOpenQuestions}
                      size="lg"
                      variant="outline"
                      className="w-full gap-2 border-2 border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50 font-bold text-base h-12 shadow-sm transition-all hover:scale-[1.02]"
                    >
                      <ClipboardCheck className="h-5 w-5" />
                      Answer a Few Questions
                      <Badge variant="secondary" className="ml-auto bg-slate-100 text-slate-700 border-0 font-bold text-xs">5 min</Badge>
                    </Button>
                    
                    <p className="text-xs text-slate-600 leading-relaxed mt-3">
                      <strong className="text-slate-900">What happens next:</strong> We'll send {provider.name} a personalized message with everything they need to know about you.
                    </p>
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
                      {provider.url && (
                        <a
                          href={provider.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Get Directions <ChevronRight className="h-4 w-4" />
                        </a>
                      )}
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
                        <Badge 
                          className={`${
                            provider.opening_hours.open_now 
                              ? 'bg-green-100 text-green-700 border-0' 
                              : 'bg-orange-100 text-orange-700 border-0'
                          }`}
                        >
                          {provider.opening_hours.open_now ? 'Open Now' : 'Closed'}
                        </Badge>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                        View all hours →
                      </button>
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
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Layout: Sidebar (Left) + Content (Right) */}
      <div className="bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Sidebar Column - Sticky, High Z-Index */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 z-50">
                {/* Get in Touch Card - Sticky version */}
                <Card className="border-2 border-slate-200 shadow-lg">
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
                      {/* Talk to Someone Now */}
                      <Button 
                        onClick={handleStartConversation}
                        size="lg"
                        className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base h-12 shadow-md transition-all hover:scale-[1.02]"
                      >
                        <Phone className="h-5 w-5" />
                        Talk to Someone Right Now
                        <Badge variant="secondary" className="ml-auto bg-white/90 text-blue-700 border-0 font-bold text-xs">2 min</Badge>
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-slate-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-3 text-slate-600 font-semibold">Or</span>
                        </div>
                      </div>
                      
                      {/* Answer Questions */}
                      <Button 
                        onClick={handleOpenQuestions}
                        size="lg"
                        variant="outline"
                        className="w-full gap-2 border-2 border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50 font-bold text-base h-12 shadow-sm transition-all hover:scale-[1.02]"
                      >
                        <ClipboardCheck className="h-5 w-5" />
                        Answer a Few Questions
                        <Badge variant="secondary" className="ml-auto bg-slate-100 text-slate-700 border-0 font-bold text-xs">5 min</Badge>
                      </Button>
                      
                      <p className="text-xs text-slate-600 leading-relaxed mt-3">
                        <strong className="text-slate-900">What happens next:</strong> We'll send {provider.name} a personalized message with everything they need to know about you.
                      </p>
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
                        {provider.url && (
                          <a
                            href={provider.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            Get Directions <ChevronRight className="h-4 w-4" />
                          </a>
                        )}
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
                          <Badge 
                            className={`${
                              provider.opening_hours.open_now 
                                ? 'bg-green-100 text-green-700 border-0' 
                                : 'bg-orange-100 text-orange-700 border-0'
                            }`}
                          >
                            {provider.opening_hours.open_now ? 'Open Now' : 'Closed'}
                          </Badge>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                          View all hours →
                        </button>
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
              </div>
            </div>

            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-20">

              {/* Spotlight Review Carousel - Shows one review at a time with counter */}
              {provider.reviews && provider.reviews.length > 0 && (
                <SpotlightReviewCarousel 
                  reviews={provider.reviews}
                  rating={provider.rating}
                  totalReviews={provider.user_ratings_total}
                  intervalMs={6000}
                />
              )}

              {/* Alternative: Uncomment to use the infinite scrolling marquee instead */}
              {/* {provider.reviews && provider.reviews.length > 0 && (
                <FancyReviewsMarquee 
                  reviews={provider.reviews}
                  rating={provider.rating}
                  totalReviews={provider.user_ratings_total}
                />
              )} */}

              {/* Professional Practice Gallery - Clean & Trust-Focused */}
              {provider.photos && provider.photos.length > 0 && (
                <div className="relative">
                  {/* Section Header with Trust Signals */}
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <Badge className="bg-blue-600 text-white border-0 px-4 py-2 text-sm font-semibold">
                        <Shield className="h-4 w-4 mr-2" />
                        Verified Practice
                      </Badge>
                      <Badge className="bg-green-600 text-white border-0 px-4 py-2 text-sm font-semibold">
                        <Award className="h-4 w-4 mr-2" />
                        {provider.rating?.toFixed(1)} ★ Rated
                      </Badge>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                      Visit Our Practice
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                      A professional, welcoming environment designed for neurodivergent children and their families
                    </p>
                  </div>

                  {/* Hero Image with Permanent Overlay - Clickable */}
                  {provider.photos[0] && (
                    <button
                      onClick={() => setSelectedImageIndex(0)}
                      className="mb-8 rounded-2xl overflow-hidden shadow-2xl relative h-[500px] w-full group cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    >
                      <img
                        src={provider.photos[0].getUrl({ maxWidth: 1200, maxHeight: 600 })}
                        alt="Our practice environment"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        width="1200"
                        height="500"
                      />
                      {/* Permanent Dark Gradient Overlay for Text Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
                      
                      {/* Expand Icon on Hover */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <ExternalLink className="h-6 w-6 text-slate-900" />
                        </div>
                      </div>
                      
                      {/* Always-Visible Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 pointer-events-none">
                        <div className="max-w-3xl">
                          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Where Families Feel Safe & Supported
                          </h3>
                          <p className="text-xl text-white/90 mb-6 leading-relaxed">
                            Our thoughtfully designed space creates a calm, sensory-friendly atmosphere that helps children thrive.
                          </p>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                              <CheckCircle2 className="h-5 w-5 text-white" />
                              <span className="text-white font-semibold">Sensory-Friendly Design</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                              <CheckCircle2 className="h-5 w-5 text-white" />
                              <span className="text-white font-semibold">Calming Colors & Lighting</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                              <CheckCircle2 className="h-5 w-5 text-white" />
                              <span className="text-white font-semibold">Private Therapy Rooms</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Simple Grid - Clean Images with Captions Below - Clickable */}
                  {provider.photos.length > 1 && (
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                      {provider.photos.slice(1, 7).map((photo, idx) => {
                        const captions = [
                          { title: "Therapy Rooms", desc: "Private, comfortable spaces for focused sessions" },
                          { title: "Waiting Area", desc: "Family-friendly space with books and toys" },
                          { title: "Sensory Equipment", desc: "Evidence-based tools for therapy" },
                          { title: "Play Therapy Zone", desc: "Engaging activities for skill development" },
                          { title: "Quiet Room", desc: "Safe space for sensory breaks" },
                          { title: "Family Consultation Area", desc: "Comfortable space for parent meetings" }
                        ];
                        
                        return (
                          <div key={idx} className="group">
                            {/* Image with Simple Zoom Hover - Clickable */}
                            <button
                              onClick={() => setSelectedImageIndex(idx + 1)}
                              className="w-full rounded-xl overflow-hidden shadow-lg mb-4 bg-slate-100 aspect-[4/3] cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/50 relative"
                            >
                              <img
                                src={photo.getUrl({ maxWidth: 500, maxHeight: 400 })}
                                alt={captions[idx]?.title || "Practice environment"}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                                width="500"
                                height="375"
                              />
                              {/* Expand Icon on Hover */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                                  <ExternalLink className="h-6 w-6 text-slate-900" />
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                            
                            {/* Always-Visible Caption */}
                            <div>
                              <h4 className="text-lg font-bold text-slate-900 mb-1">
                                {captions[idx]?.title || `Practice View ${idx + 2}`}
                              </h4>
                              <p className="text-slate-600">
                                {captions[idx]?.desc || "Part of our welcoming practice"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Stats Bar - Social Proof */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
                    <div className="grid sm:grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {provider.user_ratings_total || '100+'}
                        </div>
                        <p className="text-slate-700 font-medium">Families Served</p>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-purple-600 mb-2">
                          {provider.rating?.toFixed(1) || '5.0'}/5
                        </div>
                        <p className="text-slate-700 font-medium">Average Rating</p>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          10+
                        </div>
                        <p className="text-slate-700 font-medium">Years Experience</p>
                      </div>
                    </div>
                  </div>

                  {/* Clear CTA */}
                  <div className="text-center">
                    <Button
                      size="lg"
                      className="gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg h-16 px-12 shadow-xl hover:shadow-2xl transition-all"
                    >
                      <Calendar className="h-6 w-6" />
                      Schedule Your Visit Today
                    </Button>
                    <p className="text-slate-500 mt-4 text-sm">
                      Most families book their first appointment within 48 hours
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section (Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Quick Facts from Google Data */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Quick Facts
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Total Reviews', value: provider.user_ratings_total?.toLocaleString() || 'N/A', show: provider.user_ratings_total },
                  { label: 'Average Rating', value: provider.rating ? `${provider.rating.toFixed(1)} / 5.0` : 'N/A', show: provider.rating },
                  { label: 'Price Range', value: priceLevel || 'Not specified', show: true },
                  { label: 'Business Status', value: provider.business_status === 'OPERATIONAL' ? '✓ Active' : 'N/A', show: provider.business_status },
                  { label: 'Contact Options', value: `${hasPhone ? 'Phone' : ''}${hasPhone && hasWebsite ? ' & ' : ''}${hasWebsite ? 'Website' : ''}`, show: hasPhone || hasWebsite },
                  { label: 'Photo Gallery', value: `${totalPhotos} photos`, show: totalPhotos > 0 },
                ].filter(fact => fact.show).map((fact) => (
                  <div key={fact.label} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                    <span className="text-sm font-medium text-slate-600">{fact.label}</span>
                    <span className="text-sm font-bold text-slate-900">{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us - Value Props */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                  Why Families Trust Us
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
                  We're not just another practice—we're your partners in care
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { 
                    icon: Brain, 
                    title: 'Neurodivergent Expertise', 
                    desc: 'Our team specializes in autism, ADHD, and sensory processing',
                    gradient: 'from-blue-600 to-cyan-500'
                  },
                  { 
                    icon: Accessibility, 
                    title: 'Sensory-Friendly Spaces', 
                    desc: 'Calming environments designed to reduce overwhelm',
                    gradient: 'from-purple-600 to-pink-500'
                  },
                  { 
                    icon: Users, 
                    title: 'Family-Centered Care', 
                    desc: 'We support parents, siblings, and the whole family system',
                    gradient: 'from-emerald-600 to-teal-500'
                  },
                  { 
                    icon: Video, 
                    title: 'Flexible Options', 
                    desc: 'In-person, virtual, or hybrid care—whatever works for you',
                    gradient: 'from-orange-600 to-amber-500'
                  },
                ].map((benefit, idx) => (
                  <div
                    key={benefit.title}
                    className="group bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                      <benefit.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>



            {/* Services, Reviews, About Tabs */}
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-14 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="services" 
                  className="text-base font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Our Services
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="text-base font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Reviews ({provider.user_ratings_total || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="text-base font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  About
                </TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="mt-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Autism Evaluation & Support', icon: Brain, color: 'blue' },
                    { name: 'ADHD Assessment & Treatment', icon: Sparkles, color: 'purple' },
                    { name: 'Speech-Language Therapy', icon: MessageSquare, color: 'emerald' },
                    { name: 'Occupational Therapy', icon: Users, color: 'orange' },
                    { name: 'Applied Behavior Analysis (ABA)', icon: TrendingUp, color: 'cyan' },
                    { name: 'Parent Coaching & Support', icon: Users, color: 'pink' },
                  ].map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all group"
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-${service.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <service.icon className={`h-6 w-6 text-${service.color}-600`} />
                      </div>
                      <span className="font-semibold text-slate-900">{service.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8 space-y-6">
                {provider.reviews && provider.reviews.length > 0 ? (
                  <>
                    {/* Google Reviews Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <svg className="h-8 w-8" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <h2 className="text-3xl font-bold text-slate-900">Google Reviews</h2>
                      </div>
                      {provider.url && (
                        <a
                          href={provider.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-900 transition-colors text-sm"
                        >
                          View on Google
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    {/* Reviews Summary */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-5xl font-bold text-slate-900">{provider.rating?.toFixed(1)}</span>
                            <div>
                              <div className="flex mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < Math.floor(provider.rating || 0)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-slate-600 font-medium">
                                Based on {provider.user_ratings_total?.toLocaleString()} reviews
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Rating Distribution */}
                        <div className="w-full sm:w-auto">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const count = provider.reviews?.filter(r => Math.floor(r.rating || 0) === stars).length || 0;
                            const percentage = provider.reviews ? (count / provider.reviews.length) * 100 : 0;
                            return (
                              <div key={stars} className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-slate-600 w-8">{stars}★</span>
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-amber-400 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-slate-500 w-8">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    {provider.reviews.slice(0, 5).map((review, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-slate-100">
                            <AvatarImage src={review.profile_photo_url} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                              {review.author_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3 gap-4">
                              <div>
                                <p className="font-bold text-slate-900 text-lg">{review.author_name}</p>
                                <p className="text-sm text-slate-500">{review.relative_time_description}</p>
                              </div>
                              <div className="flex flex-shrink-0">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                      i < (review.rating || 0)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{review.text}</p>
                            {review.author_url && (
                              <a 
                                href={review.author_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                              >
                                View on Google
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* More Reviews Link */}
                    {provider.user_ratings_total && provider.user_ratings_total > 5 && (
                      <div className="text-center">
                        <a
                          href={provider.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-900 transition-colors"
                        >
                          View All {provider.user_ratings_total} Reviews on Google
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-12 text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-semibold text-slate-900 mb-2">No reviews yet</p>
                    <p className="text-slate-600">Be the first to share your experience</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="about" className="mt-8 space-y-6">
                {/* Business Information */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Building className="h-6 w-6 text-blue-600" />
                    Business Information
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
                      <span className="font-semibold text-slate-700">Name</span>
                      <span className="col-span-2 text-slate-900">{provider.name}</span>
                    </div>

                    {/* Business Type */}
                    {businessType && (
                      <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Type</span>
                        <span className="col-span-2 text-slate-900">{businessType}</span>
                      </div>
                    )}

                    {/* Status */}
                    {provider.business_status && (
                      <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Status</span>
                        <span className="col-span-2">
                          <Badge variant={provider.business_status === 'OPERATIONAL' ? 'default' : 'secondary'} className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            {provider.business_status === 'OPERATIONAL' ? '✓ Active & Accepting Patients' : provider.business_status}
                          </Badge>
                        </span>
                      </div>
                    )}

                    {/* Address */}
                    {(provider.formatted_address || provider.vicinity) && (
                      <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Address</span>
                        <span className="col-span-2 text-slate-900">{provider.formatted_address || provider.vicinity}</span>
                      </div>
                    )}

                    {/* Phone */}
                    {provider.formatted_phone_number && (
                      <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Phone</span>
                        <a href={`tel:${provider.formatted_phone_number}`} className="col-span-2 text-blue-600 hover:underline font-semibold">
                          {provider.formatted_phone_number}
                        </a>
                      </div>
                    )}

                    {/* International Phone */}
                    {provider.international_phone_number && provider.international_phone_number !== provider.formatted_phone_number && (
                      <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">International</span>
                        <a href={`tel:${provider.international_phone_number}`} className="col-span-2 text-blue-600 hover:underline">
                          {provider.international_phone_number}
                        </a>
                      </div>
                    )}

                    {/* Website */}
                    {provider.website && (
                      <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Website</span>
                        <a 
                          href={provider.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="col-span-2 text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {provider.website.replace(/^https?:\/\/(www\.)?/, '')} 
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Price Level */}
                    {priceLevel && (
                      <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Price Range</span>
                        <span className="col-span-2 text-slate-900">{priceLevel}</span>
                      </div>
                    )}

                    {/* Google Maps Link */}
                    {provider.url && (
                      <div className="grid grid-cols-3 gap-4 py-3">
                        <span className="font-semibold text-slate-700">View on Google</span>
                        <a 
                          href={provider.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="col-span-2 text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          Open in Google Maps
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Opening Hours Details */}
                {provider.opening_hours?.weekday_text && provider.opening_hours.weekday_text.length > 0 && (
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Clock className="h-6 w-6 text-blue-600" />
                      Hours of Operation
                    </h3>
                    <div className="space-y-3">
                      {provider.opening_hours.weekday_text.map((dayHours, idx) => {
                        const [day, hours] = dayHours.split(': ');
                        const isToday = new Date().getDay() === ((idx + 1) % 7);
                        return (
                          <div 
                            key={idx}
                            className={`flex justify-between items-center p-3 rounded-lg ${
                              isToday ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50'
                            }`}
                          >
                            <span className={`font-semibold ${isToday ? 'text-blue-900' : 'text-slate-700'}`}>
                              {day} {isToday && <Badge variant="secondary" className="ml-2 bg-blue-600 text-white">Today</Badge>}
                            </span>
                            <span className={`${isToday ? 'text-blue-700 font-bold' : 'text-slate-600'}`}>
                              {hours}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Service Categories */}
                {provider.types && provider.types.length > 0 && (
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Tag className="h-6 w-6 text-blue-600" />
                      Categories & Services
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {provider.types
                        .filter(type => !['point_of_interest', 'establishment'].includes(type))
                        .map((type) => (
                          <Badge 
                            key={type} 
                            variant="secondary"
                            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-slate-700"
                          >
                            {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {/* Rating Statistics */}
                {provider.rating && provider.user_ratings_total && (
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <BarChart className="h-6 w-6 text-blue-600" />
                      Rating Statistics
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Average Rating</p>
                        <p className="text-5xl font-bold text-slate-900 mb-2">{provider.rating.toFixed(1)}</p>
                        <div className="flex justify-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-6 w-6 ${
                                i < Math.floor(provider.rating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600">Out of 5.0</p>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Total Reviews</p>
                        <p className="text-5xl font-bold text-slate-900 mb-2">{provider.user_ratings_total.toLocaleString()}</p>
                        <p className="text-xs text-slate-600">Google Reviews</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Final CTA Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 p-8 sm:p-12 shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    Ready to Start?
                  </h3>
                  <p className="text-xl text-blue-50">
                    Join the families who found the right care here
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold h-16 px-10 text-lg shadow-2xl hover:scale-110 transition-all whitespace-nowrap"
                >
                  <Calendar className="h-6 w-6 mr-2" />
                  Book Appointment Now
                </Button>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar - Clean Professional Design */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Contact Card */}
            <Card className="sticky top-24 border-2 border-slate-200 shadow-lg">
              <CardHeader className="bg-white border-b border-slate-200">
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="h-6 w-6 text-blue-600" />
                  Get in Touch
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Most families hear back within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Primary CTA - Call Now */}
                {provider.formatted_phone_number && (
                  <a
                    href={`tel:${provider.formatted_phone_number}`}
                    className="block w-full"
                  >
                    <Button 
                      size="lg"
                      className="w-full gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg h-14 shadow-md"
                    >
                      <Phone className="h-5 w-5" />
                      {provider.formatted_phone_number}
                    </Button>
                  </a>
                )}

                {/* Location Info */}
                {provider.vicinity && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 mb-1">Location</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{provider.vicinity}</p>
                      </div>
                    </div>
                    {provider.url && (
                      <a
                        href={provider.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Get Directions <ChevronRight className="h-4 w-4" />
                      </a>
                    )}
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
                      <Badge 
                        className={`${
                          provider.opening_hours.open_now 
                            ? 'bg-green-100 text-green-700 border-0' 
                            : 'bg-orange-100 text-orange-700 border-0'
                        }`}
                      >
                        {provider.opening_hours.open_now ? 'Open Now' : 'Closed'}
                      </Badge>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                      View all hours →
                    </button>
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
          </div>
        </div>
      </section>

      {/* Provider Claim Section - Bottom of Page */}
      {!isClaimed && (
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-bold mb-6 shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-white">FOR PROVIDERS</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Is this your practice?
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Join 1,000+ verified providers who've claimed their listings and grown their practice
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                { icon: Shield, title: 'Get Verified', desc: 'Build trust with the verified badge' },
                { icon: TrendingUp, title: 'Boost Visibility', desc: 'Get featured in search results' },
                { icon: MessageSquare, title: 'Direct Messages', desc: 'Respond to family inquiries instantly' },
                { icon: Award, title: 'Analytics', desc: 'Track views and engagement' },
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{benefit.title}</h3>
                    <p className="text-slate-300 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setShowClaimDialog(true)}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-16 px-12 text-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
              >
                Claim This Listing - Free Forever
              </Button>
              <p className="text-sm text-slate-400 mt-4">
                No credit card required • Takes less than 2 minutes • Free forever
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Image Lightbox Modal */}
      {selectedImageIndex !== null && provider.photos && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={provider.photos[selectedImageIndex].getUrl({ maxWidth: 1200 })}
              alt={`${provider.name} photo ${selectedImageIndex + 1}`}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            
            {/* Navigation Arrows */}
            {selectedImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(selectedImageIndex - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6 rotate-180" />
              </button>
            )}
            
            {selectedImageIndex < provider.photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(selectedImageIndex + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
              {selectedImageIndex + 1} / {provider.photos.length}
            </div>
          </div>
        </div>
      )}
      {/* Claim Listing Dialog */}
      <ClaimListingDialog
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
        provider={provider}
      />

      {/* Smart Matching Questionnaire Dialog */}
      <Dialog open={showQuestionnaireDialog} onOpenChange={setShowQuestionnaireDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <SmartMatching onComplete={handleQuestionnaireComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
