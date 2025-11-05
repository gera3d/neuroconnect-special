import { useState } from 'react';
import { GooglePlace } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Building2, User, Mail, Phone, Lock } from 'lucide-react';

interface ClaimListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: GooglePlace;
}

export function ClaimListingDialog({
  open,
  onOpenChange,
  provider,
}: ClaimListingDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    
    // Verification
    businessEmail: '',
    verificationMethod: 'email' as 'email' | 'phone' | 'document',
    
    // Account Setup
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual claim submission
    console.log('Claiming listing:', {
      placeId: provider.place_id,
      ...formData,
    });
    
    // Move to success step
    setStep(4);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">
                    {provider.name}
                  </h4>
                  <p className="text-sm text-blue-700">{provider.vicinity}</p>
                </div>
              </div>
            </div>

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
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-10"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="e.g., Practice Owner, Director, Manager"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1"
                disabled={
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.email ||
                  !formData.phone ||
                  !formData.role
                }
              >
                Next: Verify Ownership
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-amber-900 mb-2">
                Verify Business Ownership
              </h4>
              <p className="text-sm text-amber-700">
                We need to verify that you're authorized to manage this listing.
                Choose your preferred verification method below.
              </p>
            </div>

            <div className="space-y-3">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.verificationMethod === 'email'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() =>
                  setFormData({ ...formData, verificationMethod: 'email' })
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      formData.verificationMethod === 'email'
                        ? 'border-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {formData.verificationMethod === 'email' && (
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold">Email Verification</h5>
                    <p className="text-sm text-gray-600">
                      We'll send a verification code to your business email
                    </p>
                    {formData.verificationMethod === 'email' && (
                      <div className="mt-3">
                        <Label htmlFor="businessEmail" className="text-xs">
                          Business Email
                        </Label>
                        <Input
                          id="businessEmail"
                          type="email"
                          value={formData.businessEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessEmail: e.target.value,
                            })
                          }
                          placeholder={`contact@${provider.name.toLowerCase().replace(/\s+/g, '')}.com`}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.verificationMethod === 'phone'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() =>
                  setFormData({ ...formData, verificationMethod: 'phone' })
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      formData.verificationMethod === 'phone'
                        ? 'border-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {formData.verificationMethod === 'phone' && (
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold">Phone Verification</h5>
                    <p className="text-sm text-gray-600">
                      We'll call the business phone number listed on Google
                    </p>
                    {formData.verificationMethod === 'phone' && provider.formatted_phone_number && (
                      <p className="text-sm mt-2 font-mono bg-white p-2 rounded border">
                        {provider.formatted_phone_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.verificationMethod === 'document'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() =>
                  setFormData({ ...formData, verificationMethod: 'document' })
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      formData.verificationMethod === 'document'
                        ? 'border-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {formData.verificationMethod === 'document' && (
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold">Document Verification</h5>
                    <p className="text-sm text-gray-600">
                      Upload a business license or official document
                    </p>
                  </div>
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
                  formData.verificationMethod === 'email' &&
                  !formData.businessEmail
                }
              >
                Next: Create Account
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Create Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10"
                    placeholder="Min. 8 characters"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters with a mix of letters and numbers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                    className="pl-10"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
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
                  , and confirm that I am authorized to claim this business listing.
                </label>
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
                type="submit"
                className="flex-1"
                disabled={
                  !formData.password ||
                  !formData.confirmPassword ||
                  formData.password !== formData.confirmPassword ||
                  !formData.agreeToTerms
                }
              >
                Claim Listing
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Claim Submitted!</h3>
            <p className="text-gray-600 mb-6">
              We've received your claim for <strong>{provider.name}</strong>.
              You'll receive a verification {formData.verificationMethod === 'email' ? 'email' : formData.verificationMethod === 'phone' ? 'phone call' : 'request'} within 24 hours.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Check your {formData.verificationMethod === 'email' ? 'inbox' : 'phone'} for verification</li>
                <li>✓ Complete the verification process</li>
                <li>✓ Start managing your profile</li>
                <li>✓ Respond to reviews and messages</li>
              </ul>
            </div>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Got It
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 4 ? 'Success!' : `Claim Your Listing (${step}/3)`}
          </DialogTitle>
          <DialogDescription>
            {step === 1 &&
              'Provide your information to begin the claiming process'}
            {step === 2 && 'Choose how you would like to verify ownership'}
            {step === 3 && 'Create your NeuroConnect provider account'}
            {step === 4 && 'Your claim has been submitted for review'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>{renderStep()}</form>
      </DialogContent>
    </Dialog>
  );
}
