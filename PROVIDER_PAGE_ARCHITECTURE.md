# Provider Page Architecture Documentation

**File:** `src/components/ProviderProfilePage.tsx`  
**Purpose:** Display comprehensive provider profiles optimized for AI search and user engagement  
**Last Updated:** November 8, 2025

---

## Overview

The Provider Profile Page is a single-page component that transforms Google Places API data into an AI-ready, conversion-optimized landing page for neurodivergent care providers (therapists, psychiatrists, pediatricians specializing in autism/ADHD).

**Key Design Principles:**
1. **AI-First:** Optimized for Google AI Overviews, Perplexity, ChatGPT citations
2. **Mobile-Responsive:** Works seamlessly on all device sizes
3. **Conversion-Focused:** Clear CTAs, trust signals, and social proof
4. **Accessibility:** WCAG 2.1 AA compliant with screen reader support
5. **Performance:** Core Web Vitals optimized (LCP ≤2.5s, CLS <0.1)

---

## Page Structure

### 1. Header Section (Hero)
**ID:** `#hero`  
**Purpose:** First impression, provider identity

**Components:**
- Provider name (H1)
- Specialty badges (e.g., "Autism Specialist", "ADHD Expert")
- Main provider photo with optimized loading
- Quick stats (rating, reviews count)
- Primary CTA buttons (Book Appointment, Call Now)

**Data Sources:**
- `provider.name` - Provider name from Google Places
- `provider.rating` - Average rating (1-5)
- `provider.user_ratings_total` - Total review count
- `provider.photos[0]` - Main provider photo

**Code Location:** Lines ~280-400

---

### 2. Answer Box (TL;DR)
**ID:** `#answer-box`  
**Purpose:** AI extraction point for search engines

**Structure:**
```tsx
Short answer: [Provider] is a [specialty] specializing in autism, ADHD, and neurodivergent care...

Who it's for: Parents seeking compassionate, neurodiversity-affirming care for their child.

Key outcome: Expert support that respects your child's unique neurodivergent profile.
```

**AI Requirements:**
- Must be <320 characters in "Short answer" section
- Positioned immediately under H1 for priority extraction
- Uses dynamic provider data (provider.name, provider.types)

**Design:**
- Purple gradient background (from-purple-50 to-blue-50)
- Left purple border accent
- Three distinct sections with bold labels

**Code Location:** Lines ~410-450

---

### 3. Practice Environment Section
**ID:** `#features` (parent container)  
**H2:** "What does the {provider.name} practice look like?"

**Purpose:** Visual showcase of practice space, builds trust

**Components:**
- **Hero Practice Photo:** Large image (1200x500px) with lazy loading
- **Photo Gallery Grid:** 4 additional practice photos with captions
  - Caption examples: "Sensory-friendly waiting area", "Therapy rooms", "Play space", "Consultation area"
- **Lightbox Modal:** Click to expand any photo to full size

**Image Optimization:**
- Hero photo: `loading="lazy"`, `width="1200"`, `height="500"`
- Gallery photos: `loading="lazy"`, `width="500"`, `height="375"`
- Lightbox: `loading="eager"`, `width="1200"`, `height="900"`
- All images have descriptive alt text for SEO/accessibility

**Data Sources:**
- `provider.photos[0]` - Hero practice photo
- `provider.photos[1-4]` - Gallery photos
- Captions defined in local `captions` array

**Code Location:** Lines ~680-800

---

### 4. Key Features Section
**H3:** "Our Practice Environment"  
**Purpose:** Highlight practice differentiators

**Grid Layout:** 3 columns on desktop, 1 column on mobile

**Feature Cards:**
1. **Neurodiversity-Affirming** (Brain icon)
   - "We celebrate neurodivergent identities..."
2. **Evidence-Based Care** (Award icon)
   - "Our approaches are backed by research..."
3. **Family-Centered** (Heart icon)
   - "We work collaboratively with families..."

**Design Pattern:**
- Icon at top (Lucide icons: Brain, Award, Heart)
- Feature title (font-semibold)
- Description paragraph
- Light purple background cards with rounded corners

**Code Location:** Lines ~500-600

---

### 5. Unique Differentiators
**H2:** "What makes {provider.name} different for neurodivergent families?"  
**Purpose:** Competitive advantages, conversion drivers

**Components:**
- **Care Philosophy Card:** Practice approach, values
- **Specializations List:** Specific conditions treated
  - Autism Spectrum Disorder
  - ADHD
  - Sensory Processing
  - Anxiety
  - Executive Function
- **Credentials/Certifications:** Provider qualifications

**Design:**
- Two-column layout (philosophy left, specializations right)
- Purple accent borders
- Check icons for specialization list

**Data Sources:**
- Static content (can be made dynamic via CMS in future)
- Specialty types from `provider.types`

**Code Location:** Lines ~850-950

---

### 6. How It Works Section
**ID:** `#how-it-works`  
**Purpose:** Reduce friction, clarify booking process

**3-Step Process:**

**Step 1: Search & Match**
- Icon: Search (Lucide)
- Number: Gradient circle "1"
- Description: "Browse verified providers in your area..."

**Step 2: Book Your Visit**
- Icon: Calendar (Lucide)
- Number: Gradient circle "2"
- Description: "Call {phone} or use our online booking..."
- **Dynamic phone number** from `provider.formatted_phone_number`

**Step 3: Begin Care**
- Icon: Heart (Lucide)
- Number: Gradient circle "3"
- Description: "Attend your first visit and start building..."

**Design:**
- Gradient purple-to-blue circle numbers (01, 02, 03)
- Horizontal layout on desktop, vertical stack on mobile
- Icons in purple with background circles

**Code Location:** Lines ~1100-1200

---

### 7. FAQ Section
**ID:** `#faq`  
**Purpose:** Answer common parent questions, reduce support burden

**5 Key Questions:**

1. **"Does {provider.name} accept insurance?"**
   - Answer: Insurance acceptance, payment options
   
2. **"What age groups does {provider.name} serve?"**
   - Answer: Age ranges (e.g., "children and teens ages 3-18")
   
3. **"What should I expect for my first visit?"**
   - Answer: Intake process, what to bring, duration
   
4. **"What does 'autism-affirming' mean at {provider.name}?"**
   - Answer: Philosophy explanation, neurodiversity paradigm
   
5. **"What are the current wait times?"**
   - Answer: Wait time estimate, expedited options

**Technical Implementation:**
- **Radix UI Accordion** component
- Single item open at a time (`type="single"`)
- Smooth expand/collapse animations
- ChevronDown icon rotates when open
- Mobile-friendly tap targets (≥44px)

**Data Sources:**
- `provider.name` - Dynamically inserted in questions
- Content is static (can be pulled from CMS in future)

**Code Location:** Lines ~1250-1400

---

### 8. Local Section (NAP + Map)
**ID:** `#local`  
**H2:** "Visit Us"  
**Purpose:** Local SEO, contact information, directions

**NAP Format (Name, Address, Phone):**
```
🏢 [Provider Name]
📍 [Address]
📞 [Phone Number]
```

**Components:**

**A. NAP Display:**
- MapPin icon + provider.name
- MapPin icon + provider.vicinity (address)
- Phone icon + provider.formatted_phone_number
- Each with consistent styling and spacing

**B. Embedded Google Map:**
```tsx
<iframe
  src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${provider.place_id}`}
  width="100%"
  height="400"
  loading="lazy"
/>
```
- Uses `VITE_GOOGLE_MAPS_API_KEY` from environment
- Shows provider location with red pin
- Interactive (zoom, pan)

**C. Service Area:**
- Geographic region served (e.g., "San Francisco Bay Area")
- Light purple background box
- MapPin icon

**D. Full Hours Display:**
- All 7 days (Monday - Sunday)
- Today's day highlighted with purple background
- Format: "9:00 AM - 5:00 PM" or "Closed"
- Data from `provider.opening_hours.weekday_text`

**E. Action Buttons:**
- **Get Directions:** Opens Google Maps in new tab
- **Call {phone}:** tel: link for mobile calling

**Data Sources:**
- `provider.name` - Business name
- `provider.vicinity` - Street address
- `provider.formatted_phone_number` - Phone with formatting
- `provider.place_id` - Google Places ID for map
- `provider.opening_hours.weekday_text` - Hours array

**Code Location:** Lines ~1450-1600

---

### 9. Proof Section
**ID:** `#proof`  
**Purpose:** Trust signals, social proof, credibility

**Stats Grid (3 Columns):**

**Stat 1: Families Served**
- Icon: Users (Lucide)
- Number: `{provider.user_ratings_total}+`
- Label: "Families Served"

**Stat 2: Average Rating**
- Icon: Star (Lucide, filled yellow)
- Number: `{provider.rating}/5.0`
- Label: "Average Rating"

**Stat 3: Recommendation Rate**
- Icon: ThumbsUp (Lucide)
- Number: "95%"
- Label: "Recommend Us"

**Testimonial Card:**
```
"[Quote about positive experience with provider...]"

— Parent of autistic child
[Current Date]
```

**Features:**
- Quotation marks around quote text
- Attribution line
- ThumbsUp icon in top-right
- Current date (uses JavaScript `new Date().toLocaleDateString()`)
- Purple gradient border

**Data Sources:**
- `provider.user_ratings_total` - Total reviews from Google
- `provider.rating` - Average rating from Google
- Testimonial quote is static (can connect to reviews API)

**Code Location:** Lines ~950-1100

---

### 10. Reviews Section
**H2:** "What do families say about {provider.name}?"  
**Purpose:** Display Google reviews, build trust

**Components:**
- **Review Cards Grid:** 3 columns on desktop
- Each review shows:
  - Reviewer name
  - Star rating (visual stars)
  - Review text
  - Time posted (e.g., "2 months ago")
  - Reviewer avatar (initials if no photo)

**Review Card Structure:**
```tsx
<Card>
  <Avatar>{initials}</Avatar>
  <ReviewerName />
  <StarRating />
  <ReviewText />
  <TimeAgo />
</Card>
```

**Data Sources:**
- `provider.reviews` - Array of Google review objects
- Each review has: author_name, rating, text, relative_time_description

**Edge Cases:**
- If no reviews: Shows "No reviews yet" message
- Long reviews: Truncated with "Read more" link
- Missing photos: Shows initials in avatar

**Code Location:** Lines ~1600-1750

---

### 11. Final CTA Section
**ID:** `#cta-final`  
**Purpose:** Convert visitors to bookings/calls

**Components:**
- **Headline:** "Ready to connect with {provider.name}?"
- **Subtext:** "Take the first step toward compassionate, neurodiversity-affirming care"
- **Button Group:**
  - **Primary:** "Book Appointment" (purple gradient)
  - **Secondary:** "Call {phone}" (outline style)

**Design:**
- Purple gradient background (from-purple-600 via-purple-500 to-blue-600)
- White text for contrast
- Large, prominent buttons
- Center-aligned content

**Code Location:** Lines ~1750-1800

---

## Supporting Components

### StructuredData Component
**File:** `src/components/StructuredData.tsx`  
**Purpose:** Generate JSON-LD structured data for SEO/AI

**Schemas Generated:**
1. **LocalBusiness Schema**
   - Business name, address, phone
   - Geo coordinates (lat/lng)
   - Opening hours
   - Aggregate rating
   - Price range

2. **WebPage Schema**
   - Page description
   - Main entity (links to LocalBusiness)

3. **BreadcrumbList Schema**
   - Home → Providers → {provider.name}

4. **Service Schema**
   - Service types (Autism care, ADHD therapy, etc.)
   - Area served (city/region)
   - Provider reference

**Usage:**
```tsx
<StructuredData provider={provider} />
```

**Renders:** 4 `<script type="application/ld+json">` tags in page head

---

### ProviderMetaTags Component
**File:** `src/components/ProviderMetaTags.tsx`  
**Purpose:** Dynamically set SEO and social meta tags

**Meta Tags Set:**
- **Title:** "{provider.name} - Autism & ADHD Care Specialist"
- **Description:** "Rated {rating}/5 by {count} families..."
- **Open Graph:** og:title, og:description, og:image, og:url, og:type
- **Twitter Card:** twitter:card, twitter:title, twitter:description, twitter:image
- **Standard:** robots, author, canonical link

**Implementation:**
- Uses `useEffect` hook to update `document.head`
- Helper function `setMetaTag()` creates/updates meta elements
- Runs when provider data or photo changes

**Usage:**
```tsx
<ProviderMetaTags provider={provider} photoUrl={photoUrl} />
```

---

### Breadcrumb Component
**File:** `src/components/Breadcrumb.tsx`  
**Purpose:** Hierarchical navigation for SEO/UX

**Structure:**
```
🏠 Home › Providers › {provider.name}
```

**Features:**
- Home icon (Lucide)
- ChevronRight separators
- React Router Links for navigation
- Current page shown in bold (not clickable)
- `aria-label="Breadcrumb"` for accessibility

**Props:**
```tsx
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string; // undefined for current page
  }>;
}
```

**Usage:**
```tsx
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Providers', href: '/professionals' },
  { label: provider.name }
]} />
```

---

## Data Flow

### 1. Provider Data Loading
```
URL param (:id) → useParams() → providerId
  ↓
Google Places API → getProviderById(providerId)
  ↓
provider object (GooglePlace type)
  ↓
Pass to all child components
```

### 2. Photo Loading
```
provider.photos[0] → getUrl({ maxWidth, maxHeight })
  ↓
Generate signed Google photo URL
  ↓
Display in img tags with optimization attributes
```

### 3. Navigation Flow
```
DirectorySection (provider list)
  ↓ Click provider card
Navigate to /provider/:id
  ↓
ProviderProfilePage renders
  ↓
Load provider data from Google Places
  ↓
Display full profile
```

---

## State Management

### Local State (useState)
```tsx
const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
```
- **Purpose:** Track which photo is open in lightbox
- **Values:** null (no lightbox) | 0-n (photo index)
- **Triggers:** Click photo → open lightbox, click X → close

### Router State (useParams)
```tsx
const { id } = useParams<{ id: string }>();
```
- **Purpose:** Get provider ID from URL
- **Example URL:** `/provider/ChIJ1234abcd`
- **Usage:** Fetch provider data from Google Places API

### Navigation (useNavigate)
```tsx
const navigate = useNavigate();
// Usage: navigate('/professionals')
```
- **Purpose:** Programmatic navigation (e.g., back button)

---

## Styling Architecture

### Tailwind Classes Structure

**Layout Patterns:**
```tsx
// Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// Section: py-12 md:py-16
// Grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

**Color System:**
- **Primary:** Purple (`purple-600`, `purple-500`)
- **Secondary:** Blue (`blue-600`, `blue-500`)
- **Accent:** Gradients (`from-purple-600 via-purple-500 to-blue-600`)
- **Neutrals:** Slate (`slate-100`, `slate-700`)

**Responsive Breakpoints:**
- **sm:** 640px (mobile landscape)
- **md:** 768px (tablet)
- **lg:** 1024px (desktop)
- **xl:** 1280px (large desktop)

**Component Patterns:**
```tsx
// Card
className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"

// Button Primary
className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"

// Button Secondary
className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
```

---

## Performance Optimizations

### Image Loading Strategy
```tsx
// Above-fold (hero): Prioritize loading
<img loading="eager" fetchPriority="high" />

// Below-fold (gallery): Lazy load
<img loading="lazy" decoding="async" />

// All images: Prevent layout shift
<img width="1200" height="500" />
```

### Code Splitting
- Component is lazy-loaded via React Router
- Heavy dependencies (Google Maps) loaded only when needed

### API Efficiency
- Provider data fetched once on mount
- Photos loaded on-demand (not all at once)
- Reviews fetched with provider data (single API call)

---

## Accessibility Features

### Semantic HTML
```html
<nav aria-label="Breadcrumb">...</nav>
<main>...</main>
<section id="faq" aria-labelledby="faq-heading">...</section>
```

### Keyboard Navigation
- All buttons/links focusable with Tab
- Accordion opens with Enter/Space
- Lightbox closes with Escape
- Focus indicators visible (ring-2 ring-blue-500)

### Screen Reader Support
- Descriptive alt text on all images
- ARIA labels on icons-only buttons
- Heading hierarchy (H1 → H2 → H3)
- Link text is descriptive ("Get Directions" not "Click here")

### Color Contrast
- All text meets WCAG AA (≥4.5:1 ratio)
- Links are distinguishable (underline + color)
- Focus states have sufficient contrast

---

## Environment Variables

### Required
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
- **Used for:** Embedded map iframe, Places API requests
- **Security:** Should be restricted to specific domains in Google Cloud Console

### Optional
```env
VITE_BOOKING_URL=https://booking.example.com/{providerId}
```
- **Used for:** Deep linking to booking system
- **Fallback:** If not set, "Book Appointment" shows phone number

---

## Error Handling

### Provider Not Found
```tsx
if (!provider) {
  return <ErrorFallback message="Provider not found" />;
}
```

### Missing Photos
```tsx
{provider.photos && provider.photos.length > 0 ? (
  <img src={provider.photos[0].getUrl()} />
) : (
  <div className="bg-slate-200">No photo available</div>
)}
```

### API Key Missing
```tsx
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  console.error('Google Maps API key not found');
  // Show address text only, no map
}
```

---

## Mobile Responsiveness

### Breakpoint Behavior

**Mobile (< 640px):**
- Single column layout
- Stack CTA buttons vertically
- Hide some decorative elements
- Reduce font sizes (text-2xl → text-xl)

**Tablet (640px - 1023px):**
- Two column grids (features, stats)
- Side-by-side buttons with wrapping
- Medium padding/spacing

**Desktop (≥ 1024px):**
- Three column grids
- Horizontal step layout
- Full padding/spacing
- Hover effects enabled

### Touch Optimization
- Button minimum size: 44x44px (Apple guidelines)
- Increased tap targets for accordion
- Disabled hover effects on mobile (use @media(hover: hover))

---

## Testing Guidelines

### Visual Testing
1. Open page in Chrome DevTools device mode
2. Test breakpoints: 375px, 768px, 1024px, 1920px
3. Verify no horizontal scroll
4. Check image loading (Network tab)
5. Verify all sections render

### Functionality Testing
1. Click all CTA buttons (Book, Call, Get Directions)
2. Open/close FAQ accordion items
3. Open lightbox, navigate photos
4. Test breadcrumb navigation
5. Verify phone number is clickable on mobile

### SEO Testing
1. View page source (Ctrl+U)
2. Verify all 4 JSON-LD schemas present
3. Check meta tags in `<head>`
4. Validate structured data: https://validator.schema.org/
5. Test Open Graph: https://developers.facebook.com/tools/debug/

### Performance Testing
1. Run Lighthouse audit (Chrome DevTools)
2. Check Core Web Vitals in PageSpeed Insights
3. Verify LCP ≤2.5s, CLS <0.1, INP ≤200ms
4. Test on slow 3G network (DevTools throttling)

---

## Common Customizations

### Adding a New Section
```tsx
// 1. Add section ID to semantic list
<section id="new-section" className="py-12">
  
// 2. Add H2 heading
<h2 className="text-3xl font-bold mb-6">
  New Section Title
</h2>

// 3. Add content
<div className="grid gap-6">
  {/* Content here */}
</div>

</section>
```

### Changing CTA Behavior
```tsx
// Current: Opens booking dialog
onClick={() => setShowBooking(true)}

// Change to: External booking link
onClick={() => window.open(bookingUrl, '_blank')}

// Or: Direct phone call
href={`tel:${provider.formatted_phone_number}`}
```

### Adding More FAQ Items
```tsx
<AccordionItem value="item6">
  <AccordionTrigger>
    New question here?
  </AccordionTrigger>
  <AccordionContent>
    Answer here.
  </AccordionContent>
</AccordionItem>
```

### Customizing Stats
```tsx
// Current: user_ratings_total, rating, 95%
// Change to: Years in practice, certifications, etc.
<div className="text-4xl font-bold text-purple-600">
  {customStatValue}
</div>
```

---

## Integration Points

### Google Places API
**Endpoint:** `new google.maps.places.PlacesService()`  
**Methods Used:**
- `getDetails()` - Fetch provider by place_id
- `photos[].getUrl()` - Generate photo URLs

**Data Fields Used:**
- `name`, `vicinity`, `formatted_phone_number`
- `rating`, `user_ratings_total`, `reviews`
- `opening_hours.weekday_text`
- `geometry.location` (lat/lng)
- `place_id`, `types`, `photos`

### Booking System (Future)
```tsx
// Placeholder for booking integration
const handleBooking = () => {
  // POST to booking API
  // Pass provider ID, selected date/time
  // Redirect to confirmation page
};
```

### Analytics Events
```tsx
// Track user actions
onClick={() => {
  trackEvent('cta_click', {
    provider_id: provider.place_id,
    cta_type: 'book_appointment'
  });
}}
```

---

## Maintenance Checklist

### Weekly
- [ ] Update wait times in FAQ
- [ ] Check for new Google reviews
- [ ] Verify map is loading correctly

### Monthly
- [ ] Rotate testimonial quote
- [ ] Update stats (if using custom data)
- [ ] Review and update FAQs based on support questions

### Quarterly
- [ ] Run full accessibility audit
- [ ] Check Core Web Vitals scores
- [ ] Update any outdated practice photos
- [ ] Validate all structured data schemas

---

## Troubleshooting

### Map Not Loading
**Symptom:** Gray box instead of map  
**Solution:**
1. Check `VITE_GOOGLE_MAPS_API_KEY` is set
2. Verify API key has Maps Embed API enabled
3. Check browser console for API errors
4. Verify domain is allowed in Google Cloud Console

### Photos Not Displaying
**Symptom:** Broken image icons  
**Solution:**
1. Check `provider.photos` array exists
2. Verify Google Places API quota not exceeded
3. Check photo URLs in Network tab
4. Ensure CORS is enabled for photo domains

### Slow Page Load
**Symptom:** LCP > 2.5s in Lighthouse  
**Solution:**
1. Verify images have `loading="lazy"` (except hero)
2. Check for large JavaScript bundles
3. Enable image optimization (WebP format)
4. Use CDN for static assets

### Accordion Not Working
**Symptom:** FAQ items don't expand/collapse  
**Solution:**
1. Verify Radix UI Accordion is installed
2. Check for JavaScript errors in console
3. Ensure unique `value` props on AccordionItems
4. Test keyboard navigation (Enter/Space)

---

## Future Enhancements

### Phase 1 (Q1 2026)
- [ ] Video Schema for provider intro videos
- [ ] Review Schema for individual testimonials
- [ ] Integrate real-time appointment availability
- [ ] Add "Compare Providers" feature

### Phase 2 (Q2 2026)
- [ ] Virtual tour (360° photos)
- [ ] Live chat integration
- [ ] Multi-language support (i18n)
- [ ] Provider-editable profiles (CMS)

### Phase 3 (Q3 2026)
- [ ] AI chatbot for FAQ answering
- [ ] Telehealth booking integration
- [ ] Insurance verification tool
- [ ] Parent resource library

---

## Related Documentation

- **AI Optimization Playbook:** `AI_READY_PROVIDER_PAGE_PLAYBOOK.md`
- **Implementation Plan:** `PROVIDER_PAGE_AI_OPTIMIZATION_PLAN.md`
- **Validation Checklist:** `AI_OPTIMIZATION_VALIDATION_CHECKLIST.md`
- **Implementation Summary:** `AI_OPTIMIZATION_IMPLEMENTATION_COMPLETE.md`
- **Component Library:** `src/components/ui/README.md`

---

## Quick Reference

### File Locations
```
src/components/
├── ProviderProfilePage.tsx        (Main page - 1637 lines)
├── StructuredData.tsx             (JSON-LD schemas)
├── ProviderMetaTags.tsx           (SEO meta tags)
└── Breadcrumb.tsx                 (Navigation breadcrumb)
```

### Key Functions
```tsx
// Get provider data
const provider = await getProviderById(providerId);

// Generate photo URL
const photoUrl = provider.photos[0].getUrl({ maxWidth: 1200 });

// Format phone for tel: link
const telLink = provider.formatted_phone_number.replace(/\D/g, '');
```

### Critical IDs
```
#hero           - Header section
#answer-box     - AI answer extraction
#proof          - Trust signals
#features       - Key features
#how-it-works   - Process steps
#faq            - FAQ accordion
#local          - NAP + map
#cta-final      - Final conversion
```

---

**This architecture supports AI-ready, high-converting provider pages that work seamlessly across devices and search engines. Refer to this document when modifying the provider page structure or troubleshooting issues.**
