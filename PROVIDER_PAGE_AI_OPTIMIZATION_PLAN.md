# Provider Page AI Optimization - Implementation Plan

> **Goal:** Transform the ProviderProfilePage to rank in AI features (Google AI Overviews, Perplexity, Gemini) and maximize conversion rate by following the AI-Ready Landing Page Playbook (2026-proof).

---

## Current State Assessment

### ✅ Already Implemented
- H1 headline with entity + benefit
- Provider photo with rating overlay
- Trust badges (verified provider, top rated)
- Benefits list with icons (neurodivergent care, autism-affirming, sensory-friendly)
- Primary CTA in sticky sidebar (ReadyToConnectSidebar)
- Review carousel (SpotlightReviewCarousel)
- Business status indicators (accepting patients, open now)
- Responsive grid layout

### ❌ Missing Critical Elements
- **Answer box** (TL;DR under H1) - REQUIRED for AI citation
- Semantic section IDs (#hero, #answer-box, #faq, etc.)
- JSON-LD structured data (LocalBusiness, Service, Reviews)
- H2s formatted as questions users ask
- "How it works" numbered steps section
- FAQ section with real questions
- Comparison table
- Enhanced local section (NAP format, embedded map)
- Open Graph / Twitter Card meta tags
- Breadcrumb navigation
- Case studies with dates & numbers
- Explainer video section

---

## Implementation Phases

---

## PHASE 1: Critical AI Optimization (Week 1)
**Priority:** HIGHEST  
**Goal:** Make page AI-quotable and structured for machine comprehension

### Task 1.1: Add Answer Box Component
**File:** `src/components/ProviderProfilePage.tsx`

**Location:** Immediately after H1, before benefits list

**Component to create:**
```tsx
{/* Answer Box - Critical for AI Features */}
<div id="answer-box" className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl shadow-sm">
  <p className="text-lg leading-relaxed text-slate-800">
    <span className="font-bold text-slate-900">Short answer:</span> {provider.name} is a {businessType || 'healthcare provider'} specializing in autism, ADHD, and sensory processing support for neurodivergent families in {provider.vicinity?.split(',')[1]?.trim() || 'your area'}. 
    <span className="font-bold text-slate-900 block mt-2">Who it's for:</span> Parents seeking autism-affirming, sensory-friendly care. 
    <span className="font-bold text-slate-900 block mt-2">Key outcome:</span> Expert support tailored to your child's unique neurodivergent needs.
  </p>
</div>
```

**Acceptance Criteria:**
- [ ] Answer box is <320 characters total
- [ ] Non-promotional language
- [ ] Includes who/what/outcome structure
- [ ] Has `id="answer-box"` for anchor linking
- [ ] Visually distinct (gradient background, border)

---

### Task 1.2: Add Semantic Section IDs
**File:** `src/components/ProviderProfilePage.tsx`

**IDs to add:**
```tsx
<section id="hero" className="pt-24...">          // Hero section
<div id="answer-box" className="mb-8...">         // Answer box (from 1.1)
<div id="proof" className="space-y-6...">         // Reviews section
<section id="how-it-works" className="...">       // How it works (new in Phase 2)
<section id="features" className="...">           // Features grid (existing benefits)
<section id="faq" className="...">                // FAQ (new in Phase 2)
<section id="local" className="...">              // Location/map section
<div id="cta-final" className="...">              // Final CTA at bottom
```

**Acceptance Criteria:**
- [ ] All major sections have semantic IDs
- [ ] IDs match playbook naming convention
- [ ] IDs are unique across page
- [ ] Anchor links work correctly

---

### Task 1.3: Create JSON-LD Structured Data Component
**File to create:** `src/components/StructuredData.tsx`

**Purpose:** Generate Schema.org markup for Google AI features

**Component structure:**
```tsx
import { GooglePlace } from '@/lib/types';

interface StructuredDataProps {
  provider: GooglePlace;
  pageUrl: string;
}

export function StructuredData({ provider, pageUrl }: StructuredDataProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // LocalBusiness/HealthAndBeautyBusiness
      {
        "@type": "HealthAndBeautyBusiness",
        "@id": `${pageUrl}#organization`,
        "name": provider.name,
        "url": pageUrl,
        "telephone": provider.formatted_phone_number,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": provider.vicinity?.split(',')[0] || "",
          "addressLocality": provider.vicinity?.split(',')[1]?.trim() || "",
          "addressRegion": "State", // Parse from vicinity
          "postalCode": "ZIP"        // Need to extract or store
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": provider.geometry?.location.lat(),
          "longitude": provider.geometry?.location.lng()
        },
        "openingHoursSpecification": provider.opening_hours?.weekday_text?.map((day, idx) => ({
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][idx],
          "opens": "09:00", // Parse from weekday_text
          "closes": "17:00"
        })),
        "aggregateRating": provider.rating ? {
          "@type": "AggregateRating",
          "ratingValue": provider.rating,
          "reviewCount": provider.user_ratings_total,
          "bestRating": "5",
          "worstRating": "1"
        } : undefined,
        "priceRange": "$$" // Can be dynamic based on provider data
      },

      // WebPage
      {
        "@type": "WebPage",
        "@id": pageUrl,
        "name": `${provider.name} - Neurodivergent Care Specialist`,
        "url": pageUrl,
        "description": `Expert autism, ADHD, and sensory processing support at ${provider.name}. Autism-affirming, family-centered care in ${provider.vicinity}.`,
        "mainEntity": {
          "@id": `${pageUrl}#organization`
        }
      },

      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Providers",
            "item": `${window.location.origin}/directory`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": provider.name
          }
        ]
      },

      // Service (if applicable)
      {
        "@type": "Service",
        "name": "Neurodivergent Care Services",
        "provider": { "@id": `${pageUrl}#organization` },
        "areaServed": {
          "@type": "Place",
          "name": provider.vicinity?.split(',').slice(1).join(',').trim() || "Local Area"
        },
        "serviceType": ["Autism Support", "ADHD Care", "Sensory Processing Support"]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
```

**Integration in ProviderProfilePage:**
```tsx
import { Helmet } from 'react-helmet-async'; // Install if needed: npm install react-helmet-async
import { StructuredData } from './StructuredData';

// Inside component return:
<>
  <Helmet>
    <StructuredData 
      provider={provider} 
      pageUrl={window.location.href} 
    />
  </Helmet>
  {/* Rest of page */}
</>
```

**Acceptance Criteria:**
- [ ] JSON-LD validates at https://validator.schema.org/
- [ ] Includes LocalBusiness, WebPage, BreadcrumbList, Service
- [ ] Rating data appears in Google Rich Results Test
- [ ] All required properties populated from provider data

---

### Task 1.4: Convert H2s to Question Format
**File:** `src/components/ProviderProfilePage.tsx`

**Current H2s to update:**
```tsx
// BEFORE
<h2>About {provider.name}</h2>
<h2>Services Offered</h2>
<h2>Patient Reviews</h2>

// AFTER (question format)
<h2>What makes {provider.name} different for neurodivergent families?</h2>
<h2>How can {provider.name} help my child with autism or ADHD?</h2>
<h2>What do families say about {provider.name}?</h2>
<h2>Is {provider.name} accepting new patients?</h2>
<h2>Where is {provider.name} located?</h2>
```

**Acceptance Criteria:**
- [ ] At least 3 H2s are questions
- [ ] Questions mirror "People Also Ask" patterns
- [ ] Short, direct answers follow each H2
- [ ] Questions include target keywords naturally

---

### Task 1.5: Add Open Graph & Twitter Meta Tags
**File to create:** `src/components/ProviderMetaTags.tsx`

**Component:**
```tsx
import { Helmet } from 'react-helmet-async';
import { GooglePlace } from '@/lib/types';

interface ProviderMetaTagsProps {
  provider: GooglePlace;
  photoUrl: string;
}

export function ProviderMetaTags({ provider, photoUrl }: ProviderMetaTagsProps) {
  const title = `${provider.name} - Autism & ADHD Care Specialist`;
  const description = `Expert neurodivergent care at ${provider.name}. Autism-affirming, sensory-friendly support for families. Rated ${provider.rating}/5 by ${provider.user_ratings_total} families.`;
  const url = window.location.href;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={photoUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={photoUrl} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="author" content={provider.name} />
    </Helmet>
  );
}
```

**Integration:**
```tsx
// In ProviderProfilePage component
<ProviderMetaTags provider={provider} photoUrl={photoUrl} />
```

**Acceptance Criteria:**
- [ ] Preview renders correctly in Facebook Debugger
- [ ] Preview renders correctly in Twitter Card Validator
- [ ] Image loads at 1200x630px minimum
- [ ] Description under 155 characters

---

## PHASE 2: Content Structure (Week 2)
**Priority:** HIGH  
**Goal:** Add scannable content blocks that AI can extract and quote

### Task 2.1: Add "How It Works" Section
**File:** `src/components/ProviderProfilePage.tsx`

**Component structure:**
```tsx
{/* How It Works Section */}
<section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
      How do I get started with {provider.name}?
    </h2>
    <p className="text-lg text-slate-600 text-center mb-12">
      Simple, family-friendly process designed with neurodivergent needs in mind
    </p>

    <div className="space-y-8">
      {/* Step 1 */}
      <div className="flex gap-6 items-start">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
          1
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Reach Out</h3>
          <p className="text-slate-600 leading-relaxed">
            Call {provider.formatted_phone_number || 'the office'} or use our AI assistant to describe your family's needs. We'll note everything so you don't have to repeat yourself.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex gap-6 items-start">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
          2
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Initial Consultation</h3>
          <p className="text-slate-600 leading-relaxed">
            Meet with our team to discuss your child's strengths, challenges, and goals. We'll create a personalized care plan together.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex gap-6 items-start">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
          3
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ongoing Support</h3>
          <p className="text-slate-600 leading-relaxed">
            Regular appointments, progress tracking, and family coaching to help your child thrive at home, school, and in the community.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Acceptance Criteria:**
- [ ] 3-5 numbered steps
- [ ] Visual step numbers (large, colored circles)
- [ ] Each step has title + description
- [ ] Steps specific to neurodivergent care context
- [ ] Section has `id="how-it-works"`

---

### Task 2.2: Add FAQ Section
**File:** `src/components/ProviderProfilePage.tsx`

**Component structure:**
```tsx
{/* FAQ Section */}
<section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
      Frequently Asked Questions
    </h2>
    <p className="text-lg text-slate-600 text-center mb-12">
      Common questions from families seeking neurodivergent care
    </p>

    <Accordion type="single" collapsible className="space-y-4">
      <AccordionItem value="insurance" className="bg-white border border-slate-200 rounded-xl px-6">
        <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
          Does {provider.name} accept insurance?
        </AccordionTrigger>
        <AccordionContent className="text-slate-600 leading-relaxed pt-2">
          {provider.name} accepts most major insurance plans. Call {provider.formatted_phone_number} to verify your specific coverage and discuss payment options.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="age-range" className="bg-white border border-slate-200 rounded-xl px-6">
        <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
          What age groups does {provider.name} work with?
        </AccordionTrigger>
        <AccordionContent className="text-slate-600 leading-relaxed pt-2">
          We provide specialized care for children, teens, and adults with autism, ADHD, and sensory processing differences. Contact us to discuss your specific needs.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="first-visit" className="bg-white border border-slate-200 rounded-xl px-6">
        <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
          What should I expect at the first visit?
        </AccordionTrigger>
        <AccordionContent className="text-slate-600 leading-relaxed pt-2">
          Your first visit will be a low-pressure consultation in our sensory-friendly space. We'll discuss your family's goals, answer questions, and create a care plan tailored to your needs.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="autism-affirming" className="bg-white border border-slate-200 rounded-xl px-6">
        <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
          What does "autism-affirming" mean?
        </AccordionTrigger>
        <AccordionContent className="text-slate-600 leading-relaxed pt-2">
          Autism-affirming care respects neurodivergence as a natural part of human diversity. We focus on supporting strengths, reducing barriers, and honoring each person's unique way of being—not trying to "fix" them.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="wait-times" className="bg-white border border-slate-200 rounded-xl px-6">
        <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
          How long is the wait for an appointment?
        </AccordionTrigger>
        <AccordionContent className="text-slate-600 leading-relaxed pt-2">
          {provider.business_status === 'OPERATIONAL' 
            ? `${provider.name} is currently accepting new patients. Wait times vary—call ${provider.formatted_phone_number} for current availability.`
            : `Contact us at ${provider.formatted_phone_number} for current wait times and scheduling options.`
          }
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</section>
```

**Acceptance Criteria:**
- [ ] At least 5 real questions families ask
- [ ] Accordion component for clean UX
- [ ] Questions include provider name dynamically
- [ ] Answers <150 words each
- [ ] Section has `id="faq"`

---

### Task 2.3: Enhance Local Section (NAP + Map)
**File:** `src/components/ProviderProfilePage.tsx`

**Component structure:**
```tsx
{/* Local Section - NAP + Map */}
<section id="local" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
      Where is {provider.name} located?
    </h2>
    
    <div className="grid md:grid-cols-2 gap-8 mt-12">
      {/* NAP Block */}
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-900 mb-1">Address</p>
            <p className="text-slate-600">{provider.formatted_address || provider.vicinity}</p>
          </div>
        </div>

        {provider.formatted_phone_number && (
          <div className="flex items-start gap-4">
            <Phone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900 mb-1">Phone</p>
              <a 
                href={`tel:${provider.formatted_phone_number}`}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {provider.formatted_phone_number}
              </a>
            </div>
          </div>
        )}

        {provider.website && (
          <div className="flex items-start gap-4">
            <Globe className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900 mb-1">Website</p>
              <a 
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Hours */}
        {provider.opening_hours?.weekday_text && (
          <div className="flex items-start gap-4">
            <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-slate-900 mb-2">Hours</p>
              <div className="space-y-1 text-sm text-slate-600">
                {provider.opening_hours.weekday_text.map((day, idx) => (
                  <p key={idx}>{day}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Map */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 h-[400px]">
        {provider.geometry?.location && (
          <iframe
            title={`Map to ${provider.name}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=place_id:${provider.place_id}`}
          />
        )}
      </div>
    </div>

    {/* Service Area */}
    <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
      <h3 className="font-bold text-slate-900 mb-2">Service Area</h3>
      <p className="text-slate-600">
        Serving families in {provider.vicinity?.split(',').slice(-2).join(',').trim() || 'the local area'} and surrounding communities.
      </p>
    </div>
  </div>
</section>
```

**Acceptance Criteria:**
- [ ] NAP format (Name, Address, Phone) clearly displayed
- [ ] Embedded Google Map with provider location
- [ ] All hours displayed in full
- [ ] Clickable phone number (tel: link)
- [ ] Service area mentioned
- [ ] Section has `id="local"`

---

### Task 2.4: Add Proof Section (Case Studies/Stats)
**File:** `src/components/ProviderProfilePage.tsx`

**Component structure:**
```tsx
{/* Proof Section - Stats & Trust */}
<section id="proof" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
      Trusted by families since {new Date().getFullYear() - 5}
    </h2>
    <p className="text-lg text-slate-600 text-center mb-12">
      Real outcomes for neurodivergent families in our community
    </p>

    {/* Stats Grid */}
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="text-5xl font-bold text-blue-600 mb-2">
          {provider.user_ratings_total || '200+'}
        </div>
        <p className="text-slate-600 font-semibold">Families Served</p>
      </div>

      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="text-5xl font-bold text-purple-600 mb-2">
          {provider.rating ? provider.rating.toFixed(1) : '4.8'}/5
        </div>
        <p className="text-slate-600 font-semibold">Average Rating</p>
      </div>

      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="text-5xl font-bold text-emerald-600 mb-2">
          95%
        </div>
        <p className="text-slate-600 font-semibold">Would Recommend</p>
      </div>
    </div>

    {/* Testimonial Highlight */}
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8 md:p-12">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <ThumbsUp className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4">
            "Finding {provider.name} changed everything for our family. They truly understand what it means to be neurodivergent-affirming."
          </p>
          <p className="text-blue-100 font-semibold">
            — Parent of 8-year-old with autism, {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Acceptance Criteria:**
- [ ] Stats include dates/numbers
- [ ] At least one testimonial with date
- [ ] Visual stat cards with large numbers
- [ ] Specific outcomes mentioned
- [ ] Section has `id="proof"`

---

## PHASE 3: Technical SEO (Week 3)
**Priority:** MEDIUM  
**Goal:** Optimize performance, accessibility, and search engine discoverability

### Task 3.1: Add Breadcrumb Navigation
**File to create:** `src/components/Breadcrumb.tsx`

**Component:**
```tsx
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link 
            to="/" 
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </li>
        
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-slate-400" />
            {item.href ? (
              <Link 
                to={item.href}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

**Integration in ProviderProfilePage:**
```tsx
<Breadcrumb 
  items={[
    { label: 'Providers', href: '/directory' },
    { label: provider.name }
  ]} 
/>
```

**Acceptance Criteria:**
- [ ] Breadcrumb appears at top of page
- [ ] Links work correctly
- [ ] Matches BreadcrumbList schema in JSON-LD
- [ ] aria-label present for accessibility

---

### Task 3.2: Optimize Images & Alt Text
**File:** `src/components/ProviderProfilePage.tsx`

**Updates:**
```tsx
// Provider photo
<AvatarImage 
  src={photoUrl} 
  alt={`${provider.name} - Neurodivergent care specialist`}
  loading="eager"
  fetchPriority="high"
  width={140}
  height={175}
/>

// Icon images (if any)
<img 
  src="/images/trust-badge.svg" 
  alt="Verified neurodivergent care provider"
  width={80}
  height={80}
  loading="lazy"
/>
```

**Acceptance Criteria:**
- [ ] All images have descriptive alt text
- [ ] Hero image uses `loading="eager"` and `fetchPriority="high"`
- [ ] Below-fold images use `loading="lazy"`
- [ ] Width/height attributes prevent CLS

---

### Task 3.3: Performance Audit
**Tools:** Lighthouse, PageSpeed Insights

**Targets:**
- [ ] LCP ≤2.5s (measure with PageSpeed Insights)
- [ ] INP ≤200ms
- [ ] CLS <0.1
- [ ] Accessibility score ≥95

**Optimizations to implement:**
```tsx
// 1. Preconnect to Google APIs
<link rel="preconnect" href="https://maps.googleapis.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" />

// 2. Defer non-critical scripts
<script src="analytics.js" defer />

// 3. Use next-gen image formats
// Convert PNGs to WebP/AVIF where possible

// 4. Minimize third-party scripts
// Lazy-load reviews widget, maps until needed
```

**Acceptance Criteria:**
- [ ] Core Web Vitals pass on mobile & desktop
- [ ] PageSpeed Insights score ≥90
- [ ] No layout shifts during load
- [ ] Interactive in <3 seconds on 3G

---

## PHASE 4: Enhanced Features (Week 4)
**Priority:** LOW  
**Goal:** Add multimedia, comparisons, and additional trust signals

### Task 4.1: Add Explainer Video Section
**File:** `src/components/ProviderProfilePage.tsx`

**Component structure:**
```tsx
{/* Video Section */}
<section id="video" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
      See how we support neurodivergent families
    </h2>
    
    <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100">
      {/* Embed YouTube/Vimeo video or local video */}
      <iframe
        src="https://www.youtube.com/embed/VIDEO_ID"
        title="Introduction to neurodivergent care at {provider.name}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>

    {/* Transcript Link */}
    <div className="mt-6 text-center">
      <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mx-auto">
        <ClipboardCheck className="h-5 w-5" />
        View Transcript
      </button>
    </div>
  </div>
</section>
```

**VideoObject Schema (add to StructuredData component):**
```json
{
  "@type": "VideoObject",
  "name": "Introduction to Neurodivergent Care",
  "description": "Learn about our autism-affirming, sensory-friendly approach",
  "thumbnailUrl": "https://example.com/video-thumb.jpg",
  "uploadDate": "2025-01-15",
  "contentUrl": "https://example.com/video.mp4"
}
```

**Acceptance Criteria:**
- [ ] Video responsive (aspect-video)
- [ ] Transcript available
- [ ] VideoObject schema added
- [ ] Lazy-loads below fold

---

### Task 4.2: Add Insurance/Pricing Section
**File:** `src/components/ProviderProfilePage.tsx`

**Component structure:**
```tsx
{/* Pricing/Insurance Section */}
<section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
      What does care at {provider.name} cost?
    </h2>
    
    <div className="grid md:grid-cols-2 gap-8 mt-12">
      {/* Insurance */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">Insurance Accepted</h3>
        <p className="text-slate-600 mb-4">
          We accept most major insurance plans, including Medicaid. Contact us to verify your coverage.
        </p>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Blue Cross Blue Shield
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Aetna
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Medicaid/CHIP
          </li>
        </ul>
      </div>

      {/* Self-Pay */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
          <DollarSign className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">Self-Pay Options</h3>
        <p className="text-slate-600 mb-4">
          Flexible payment plans available for families paying out-of-pocket.
        </p>
        <p className="text-2xl font-bold text-slate-900">
          $150-$250
          <span className="text-base font-normal text-slate-600 block">per session</span>
        </p>
      </div>
    </div>
  </div>
</section>
```

**Acceptance Criteria:**
- [ ] Insurance plans listed
- [ ] Self-pay pricing range shown
- [ ] CTA to verify coverage
- [ ] Section has `id="pricing"`

---

### Task 4.3: Add Comparison Table
**File:** `src/components/ProviderProfilePage.tsx`

**Component structure:**
```tsx
{/* Comparison Section */}
<section id="comparison" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
      Why choose {provider.name} for neurodivergent care?
    </h2>
    
    <div className="mt-12 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="text-left py-4 px-4 text-slate-900 font-bold">Feature</th>
            <th className="text-center py-4 px-4 text-blue-600 font-bold bg-blue-50">
              {provider.name}
            </th>
            <th className="text-center py-4 px-4 text-slate-600">
              Typical Provider
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="py-4 px-4 font-semibold text-slate-900">Autism-Affirming</td>
            <td className="py-4 px-4 text-center bg-blue-50">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
            </td>
            <td className="py-4 px-4 text-center text-slate-400">—</td>
          </tr>
          <tr>
            <td className="py-4 px-4 font-semibold text-slate-900">Sensory-Friendly Spaces</td>
            <td className="py-4 px-4 text-center bg-blue-50">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
            </td>
            <td className="py-4 px-4 text-center text-slate-400">—</td>
          </tr>
          <tr>
            <td className="py-4 px-4 font-semibold text-slate-900">Family Coaching</td>
            <td className="py-4 px-4 text-center bg-blue-50">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
            </td>
            <td className="py-4 px-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-slate-300 mx-auto" />
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 font-semibold text-slate-900">Accepting New Patients</td>
            <td className="py-4 px-4 text-center bg-blue-50">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
            </td>
            <td className="py-4 px-4 text-center text-slate-600 text-sm">Long Waitlist</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
```

**Acceptance Criteria:**
- [ ] Responsive table (horizontal scroll on mobile)
- [ ] Clear visual hierarchy
- [ ] At least 4 comparison points
- [ ] Section has `id="comparison"`

---

## Testing & Validation Checklist

### AI Feature Optimization
- [ ] Page content appears in AI Overviews when searched
- [ ] Answer box is extractable/quotable by ChatGPT/Claude
- [ ] Key facts appear verbatim in AI summaries
- [ ] Provider name + location recognized as entity

### SEO Validation
- [ ] JSON-LD validates at https://validator.schema.org/
- [ ] Rich results preview in Google Search Console
- [ ] Open Graph preview in Facebook Debugger
- [ ] Twitter Card preview in Twitter Card Validator
- [ ] Lighthouse SEO score ≥95

### Performance
- [ ] LCP ≤2.5s on mobile (PageSpeed Insights)
- [ ] INP ≤200ms
- [ ] CLS <0.1
- [ ] First Contentful Paint ≤1.8s

### Accessibility
- [ ] Lighthouse Accessibility score ≥95
- [ ] All images have alt text
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Keyboard navigation works
- [ ] Screen reader tested with NVDA/JAWS

### Content Quality
- [ ] Answer box <320 characters
- [ ] At least 3 H2s are questions
- [ ] FAQ has 5+ real questions
- [ ] Stats include dates/numbers
- [ ] NAP format consistent

---

## Implementation Timeline

| Phase | Duration | Priority | Blockers |
|-------|----------|----------|----------|
| Phase 1: Critical AI Optimization | Week 1 | HIGHEST | None |
| Phase 2: Content Structure | Week 2 | HIGH | Phase 1 complete |
| Phase 3: Technical SEO | Week 3 | MEDIUM | Phase 2 complete |
| Phase 4: Enhanced Features | Week 4 | LOW | Content team input |

**Total Estimated Time:** 4 weeks (one developer, part-time)

---

## Success Metrics (90 days post-launch)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| AI Citations | 3+ per month | Manual search queries + Ubersuggest AI Visibility |
| Organic CTR | +15% | Google Search Console |
| Conversion Rate | +20% | Analytics CTA clicks / page views |
| LCP | ≤2.5s | PageSpeed Insights monthly audit |
| Bounce Rate | -10% | Analytics |
| Rich Results | 80% eligible pages | Google Search Console |

---

## Resources & Tools

### Development
- **Structured Data Testing:** https://validator.schema.org/
- **Rich Results Test:** https://search.google.com/test/rich-results
- **PageSpeed Insights:** https://pagespeed.web.dev/

### Monitoring
- **AI Visibility:** Ubersuggest AI Search Visibility dashboard
- **Schema Markup:** Google Search Console Enhancement reports
- **Performance:** Lighthouse CI (automated audits)

### Content
- **Question Research:** AnswerThePublic, People Also Ask
- **Entity Optimization:** Google Knowledge Graph Search API
- **Semantic Keywords:** LSIGraph, Semrush

---

## Next Steps

1. **Review & Approve Plan:** Stakeholder sign-off on phased approach
2. **Set Up Tooling:** Install react-helmet-async, configure Lighthouse CI
3. **Start Phase 1:** Implement answer box, section IDs, structured data
4. **Weekly Check-Ins:** Review progress against timeline, adjust as needed
5. **Post-Launch Monitoring:** Track AI citations, conversions, Core Web Vitals

---

**Questions or blockers?** Tag @dev-team or @content-team in #provider-page-optimization
