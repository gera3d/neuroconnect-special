import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GooglePlace } from '@/lib/types';
import { GooglePlacesService } from '@/services/googlePlaces';
import { useGoogleMaps } from '@/hooks/use-google-maps';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { ClaimListingDialog } from './ClaimListingDialog';
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  MessageSquare,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Mail,
} from 'lucide-react';

export function ProviderProfilePage() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<GooglePlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps();

  useEffect(() => {
    if (!placeId || !mapsLoaded) return;

    const loadProviderDetails = async () => {
      try {
        const service = GooglePlacesService.getInstance();
        const details = await service.getPlaceDetails(placeId);
        setProvider(details as GooglePlace);
        
        // TODO: Check if this listing is already claimed
        // setIsClaimed(await checkIfClaimed(placeId));
      } catch (error) {
        console.error('Error loading provider details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProviderDetails();
  }, [placeId, mapsLoaded]);

  if (mapsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Failed to load Google Maps</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !mapsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Provider not found</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="font-medium hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Map
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={photoUrl} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(provider.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {provider.name}
                      </h1>
                      {isClaimed && (
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">
                            Claimed Business
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>

                  {provider.rating && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl font-semibold ml-1">
                          {provider.rating.toFixed(1)}
                        </span>
                      </div>
                      {provider.user_ratings_total && (
                        <span className="text-gray-600">
                          ({provider.user_ratings_total} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {provider.types?.slice(0, 4).map((type) => (
                      <Badge key={type} variant="secondary">
                        {type.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  {!isClaimed && (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Is this your business?
                        </h3>
                        <p className="text-sm text-blue-700 mb-3">
                          Claim this listing to manage your profile, respond to reviews,
                          and reach more families.
                        </p>
                        <Button
                          className="w-full"
                          onClick={() => setShowClaimDialog(true)}
                        >
                          Claim This Listing
                        </Button>
                      </div>
                      <Separator className="my-4" />
                    </>
                  )}

                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Calendar className="h-5 w-5 mr-2" />
                      Request Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos Gallery */}
            {provider.photos && provider.photos.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-2">
                    {provider.photos.slice(0, 6).map((photo, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={photo.getUrl({ maxWidth: 400 })}
                          alt={`${provider.name} photo ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="about" className="flex-1">
                  About
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  Reviews ({provider.user_ratings_total || 0})
                </TabsTrigger>
                <TabsTrigger value="photos" className="flex-1">
                  Photos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Practice</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {provider.vicinity && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-gray-600">{provider.vicinity}</p>
                          {provider.url && (
                            <a
                              href={provider.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              View on Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {provider.formatted_phone_number && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <a
                            href={`tel:${provider.formatted_phone_number}`}
                            className="text-blue-600 hover:underline"
                          >
                            {provider.formatted_phone_number}
                          </a>
                        </div>
                      </div>
                    )}

                    {provider.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Website</p>
                          <a
                            href={provider.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {provider.website}
                          </a>
                        </div>
                      </div>
                    )}

                    {provider.opening_hours && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium mb-2">Hours</p>
                          <div className="space-y-1">
                            {provider.opening_hours.weekday_text?.map((day, idx) => (
                              <p key={idx} className="text-sm text-gray-600">
                                {day}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Pediatric Care</Badge>
                        <Badge>Speech Therapy</Badge>
                        <Badge>Occupational Therapy</Badge>
                        <Badge>Autism Support</Badge>
                        <Badge>Developmental Delays</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {provider.reviews && provider.reviews.length > 0 ? (
                    provider.reviews.map((review, idx) => (
                      <Card key={idx}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.profile_photo_url} />
                              <AvatarFallback>
                                {review.author_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-semibold">
                                    {review.author_name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {review.relative_time_description}
                                  </p>
                                </div>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < (review.rating || 0)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700">{review.text}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center text-gray-500">
                        No reviews yet
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="photos" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {provider.photos?.map((photo, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo.getUrl({ maxWidth: 600 })}
                        alt={`${provider.name} photo ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {provider.opening_hours && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">
                        {provider.opening_hours.open_now ? 'Open Now' : 'Closed'}
                      </p>
                      {provider.opening_hours.weekday_text?.[new Date().getDay()] && (
                        <p className="text-xs text-gray-600">
                          {provider.opening_hours.weekday_text[new Date().getDay()]}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Accepts</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      Insurance
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      New Patients
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Telehealth
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Message
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md"
                      rows={4}
                      placeholder="I'm interested in..."
                    />
                  </div>
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Claim Listing Dialog - TODO: Fix and re-enable */}
      {/* <ClaimListingDialog
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
        provider={provider}
      /> */}
    </div>
  );
}
