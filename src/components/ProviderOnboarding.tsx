import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Briefcase,
  FileText,
  Users,
  Award,
  Clock,
  DollarSign,
} from 'lucide-react';

export function ProviderOnboarding() {
  const [onboardingType, setOnboardingType] = useState<'claim' | 'new'>('claim');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    credentials: '',
    
    // Practice Information
    practiceName: '',
    practiceType: 'individual' as 'individual' | 'group' | 'clinic',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    practicePhone: '',
    practiceEmail: '',
    website: '',
    
    // Professional Details
    specialties: [] as string[],
    conditions: [] as string[],
    treatmentApproaches: [] as string[],
    yearsExperience: '',
    licenseNumber: '',
    acceptsNewClients: true,
    
    // Insurance & Billing
    acceptsInsurance: true,
    insuranceProviders: [] as string[],
    acceptsMedicaid: false,
    acceptsMedicare: false,
    offersSliding: false,
    
    // Additional
    bio: '',
    
    // Account
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const specialtyOptions = [
    'Autism Spectrum Disorder (ASD)',
    'ADHD',
    'Learning Disabilities',
    'Speech & Language',
    'Occupational Therapy',
    'Behavioral Therapy (ABA)',
    'Developmental Pediatrics',
    'Psychological Testing',
    'Social Skills Training',
    'Executive Function Coaching',
  ];

  const conditionOptions = [
    'Autism',
    'ADHD',
    'Dyslexia',
    'Anxiety',
    'Depression',
    'Sensory Processing',
    'Motor Skills Delays',
    'Speech Delays',
    'Social Communication',
    'Executive Function Challenges',
  ];

  const treatmentOptions = [
    'Applied Behavior Analysis (ABA)',
    'Cognitive Behavioral Therapy (CBT)',
    'Developmental Therapy',
    'Play Therapy',
    'Parent Training',
    'Social Skills Groups',
    'Sensory Integration',
    'Floortime',
  ];

  const insuranceOptions = [
    'Blue Cross Blue Shield',
    'Aetna',
    'UnitedHealthcare',
    'Cigna',
    'Kaiser Permanente',
    'Anthem',
    'Humana',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual onboarding submission
    console.log('Onboarding submission:', formData);
    
    // Move to success step
    setStep(5);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const renderClaimFlow = () => {
    return (
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 mx-auto mb-4 text-blue-600" />
        <h2 className="text-2xl font-bold mb-2">Already Listed on Google?</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Search for your practice on our Live Map and claim your listing to get started instantly.
        </p>
        <Button size="lg" onClick={() => window.location.href = '/'}>
          Go to Live Map
        </Button>
        <div className="mt-6">
          <button
            onClick={() => setOnboardingType('new')}
            className="text-sm text-blue-600 hover:underline"
          >
            Not listed yet? Create a new profile →
          </button>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credentials">Credentials *</Label>
                  <Input
                    id="credentials"
                    value={formData.credentials}
                    onChange={(e) =>
                      setFormData({ ...formData, credentials: e.target.value })
                    }
                    placeholder="e.g., Ph.D., BCBA, SLP, OTR/L"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full"
                disabled={
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.email ||
                  !formData.phone ||
                  !formData.credentials
                }
              >
                Next: Practice Information
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Practice Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="practiceName">Practice Name *</Label>
                  <Input
                    id="practiceName"
                    value={formData.practiceName}
                    onChange={(e) =>
                      setFormData({ ...formData, practiceName: e.target.value })
                    }
                    placeholder="Your Practice Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="practiceType">Practice Type *</Label>
                  <Select
                    value={formData.practiceType}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, practiceType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Practice</SelectItem>
                      <SelectItem value="group">Group Practice</SelectItem>
                      <SelectItem value="clinic">Clinic/Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Los Angeles"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      placeholder="CA"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    placeholder="90210"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="practicePhone">Practice Phone *</Label>
                  <Input
                    id="practicePhone"
                    type="tel"
                    value={formData.practicePhone}
                    onChange={(e) =>
                      setFormData({ ...formData, practicePhone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://yourpractice.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1"
                disabled={
                  !formData.practiceName ||
                  !formData.address ||
                  !formData.city ||
                  !formData.state ||
                  !formData.zipCode ||
                  !formData.practicePhone
                }
              >
                Next: Specialties
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Professional Details
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Specialties * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                    {specialtyOptions.map((specialty) => (
                      <div key={specialty} className="flex items-start space-x-2">
                        <Checkbox
                          id={`specialty-${specialty}`}
                          checked={formData.specialties.includes(specialty)}
                          onCheckedChange={() =>
                            setFormData({
                              ...formData,
                              specialties: toggleArrayItem(formData.specialties, specialty),
                            })
                          }
                        />
                        <label
                          htmlFor={`specialty-${specialty}`}
                          className="text-sm leading-tight cursor-pointer"
                        >
                          {specialty}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Conditions Treated * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                    {conditionOptions.map((condition) => (
                      <div key={condition} className="flex items-start space-x-2">
                        <Checkbox
                          id={`condition-${condition}`}
                          checked={formData.conditions.includes(condition)}
                          onCheckedChange={() =>
                            setFormData({
                              ...formData,
                              conditions: toggleArrayItem(formData.conditions, condition),
                            })
                          }
                        />
                        <label
                          htmlFor={`condition-${condition}`}
                          className="text-sm leading-tight cursor-pointer"
                        >
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Treatment Approaches (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                    {treatmentOptions.map((treatment) => (
                      <div key={treatment} className="flex items-start space-x-2">
                        <Checkbox
                          id={`treatment-${treatment}`}
                          checked={formData.treatmentApproaches.includes(treatment)}
                          onCheckedChange={() =>
                            setFormData({
                              ...formData,
                              treatmentApproaches: toggleArrayItem(
                                formData.treatmentApproaches,
                                treatment
                              ),
                            })
                          }
                        />
                        <label
                          htmlFor={`treatment-${treatment}`}
                          className="text-sm leading-tight cursor-pointer"
                        >
                          {treatment}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience *</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      value={formData.yearsExperience}
                      onChange={(e) =>
                        setFormData({ ...formData, yearsExperience: e.target.value })
                      }
                      placeholder="10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, licenseNumber: e.target.value })
                      }
                      placeholder="ABC123456"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptsNewClients"
                    checked={formData.acceptsNewClients}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        acceptsNewClients: checked as boolean,
                      })
                    }
                  />
                  <label htmlFor="acceptsNewClients" className="text-sm cursor-pointer">
                    Currently accepting new clients
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1"
                disabled={
                  formData.specialties.length === 0 ||
                  formData.conditions.length === 0 ||
                  !formData.yearsExperience ||
                  !formData.licenseNumber
                }
              >
                Next: Create Account
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Create Your Account
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell families about your experience, approach, and what makes your practice unique..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    This will be displayed on your public profile
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Create Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Min. 8 characters"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with a mix of letters and numbers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Re-enter password"
                    required
                  />
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreeToTerms: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 leading-tight cursor-pointer"
                  >
                    I agree to NeuroConnect's{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                    , and confirm that all information provided is accurate.
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(3)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  !formData.bio ||
                  !formData.password ||
                  !formData.confirmPassword ||
                  formData.password !== formData.confirmPassword ||
                  !formData.agreeToTerms
                }
              >
                Create Profile
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to NeuroConnect!</h3>
            <p className="text-gray-600 mb-6">
              Your profile has been created successfully. We're reviewing your information
              and will activate your account within 24 hours.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <h4 className="font-semibold text-blue-900 mb-2">What's Next:</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Check your email for verification link</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>We'll verify your credentials (1-2 business days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Your profile will go live on our platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Start connecting with families in need</span>
                </li>
              </ul>
            </div>
            <Button onClick={() => window.location.href = '/'} size="lg">
              Explore Platform
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Join NeuroConnect</h1>
          <p className="text-gray-600">
            Connect with families seeking neurodivergent-focused healthcare
          </p>
        </div>

        <Card>
          <CardHeader>
            <Tabs value={onboardingType} onValueChange={(v: any) => setOnboardingType(v)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="claim">Claim Existing Listing</TabsTrigger>
                <TabsTrigger value="new">Create New Profile</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {onboardingType === 'claim' ? (
              renderClaimFlow()
            ) : (
              <form onSubmit={handleSubmit}>
                {step < 5 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Step {step} of 4</span>
                      <span>{Math.round((step / 4) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(step / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {renderStep()}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
