# AI-Ready Provider Page - Validation Checklist

## Overview
This checklist validates all 12 optimization tasks implemented for AI-ready provider pages. Complete each test to ensure the page is optimized for Google AI Overviews, Perplexity, and other AI search features.

---

## 1. Structured Data Validation

### JSON-LD Schema Testing
**Test:** Validate all structured data schemas are error-free

**Steps:**
1. Open ProviderProfilePage in browser
2. Right-click → Inspect → Open Console
3. Run: `document.querySelectorAll('script[type="application/ld+json"]')`
4. Copy each JSON-LD block
5. Paste into **https://validator.schema.org/**
6. Verify 0 errors, 0 warnings

**Expected Schemas:**
- ✅ LocalBusiness (with name, address, geo, telephone, openingHours, rating)
- ✅ WebPage (with description, mainEntity)
- ✅ BreadcrumbList (Home → Providers → {provider.name})
- ✅ Service (with serviceType, areaServed, provider reference)

**Acceptance Criteria:**
- [ ] All 4 schemas validate without errors
- [ ] LocalBusiness includes aggregateRating with ratingValue and reviewCount
- [ ] WebPage mainEntity references LocalBusiness @id
- [ ] BreadcrumbList shows 3 position items
- [ ] Service schema includes correct areaServed array

---

## 2. Open Graph & Social Meta Tags

### Facebook Debugger
**Test:** Verify Open Graph tags render correctly

**Steps:**
1. Deploy page to public URL (or use localhost tunnel like ngrok)
2. Go to **https://developers.facebook.com/tools/debug/**
3. Enter provider page URL
4. Click "Scrape Again"
5. Check preview card

**Expected Tags:**
- `og:title`: "{provider.name} - Autism & ADHD Care Specialist"
- `og:description`: "Rated {rating}/5 by {count} families..."
- `og:image`: Provider photo URL
- `og:url`: Canonical page URL
- `og:type`: "website"

**Acceptance Criteria:**
- [ ] Preview card shows provider name as title
- [ ] Description includes rating
- [ ] Provider photo displays correctly
- [ ] No missing required properties

### Twitter Card Validator
**Test:** Verify Twitter Card displays properly

**Steps:**
1. Go to **https://cards-dev.twitter.com/validator**
2. Enter provider page URL
3. Click "Preview card"

**Expected Tags:**
- `twitter:card`: "summary_large_image"
- `twitter:title`: "{provider.name} - Autism & ADHD Care Specialist"
- `twitter:description`: "Rated {rating}/5..."
- `twitter:image`: Provider photo URL

**Acceptance Criteria:**
- [ ] Large image card renders
- [ ] Title matches provider name
- [ ] Description shows rating
- [ ] Image loads without errors

---

## 3. Core Web Vitals

### Lighthouse Audit
**Test:** Verify performance, accessibility, SEO scores

**Steps:**
1. Open provider page in Chrome
2. Right-click → Inspect → Lighthouse tab
3. Select: ✅ Performance, ✅ Accessibility, ✅ SEO, ✅ Best Practices
4. Select: Desktop mode
5. Click "Generate report"

**Target Scores:**
- Performance: ≥90
- Accessibility: ≥95
- SEO: ≥95
- Best Practices: ≥90

**Key Metrics:**
- **LCP (Largest Contentful Paint):** ≤2.5 seconds (GOOD)
- **INP (Interaction to Next Paint):** ≤200ms (GOOD)
- **CLS (Cumulative Layout Shift):** <0.1 (GOOD)

**Acceptance Criteria:**
- [ ] Performance score ≥90
- [ ] LCP ≤2.5s (green)
- [ ] CLS <0.1 (green)
- [ ] All images have width/height attributes (prevents CLS)
- [ ] No render-blocking resources >500ms
- [ ] SEO score ≥95

### Image Optimization Check
**Test:** Verify all images are optimized

**Check List:**
- [ ] Main provider photo: alt="{provider.name} - Neurodivergent care specialist", loading="eager", fetchPriority="high"
- [ ] Hero practice photo: alt="{provider.name} practice - Sensory-friendly...", loading="lazy", width="1200", height="500"
- [ ] Gallery photos: alt text from captions, loading="lazy", width="500", height="375"
- [ ] Lightbox photo: descriptive alt, loading="eager", width="1200", height="900"
- [ ] All images have width and height attributes
- [ ] Above-fold images use loading="eager"
- [ ] Below-fold images use loading="lazy"

---

## 4. Semantic HTML & Accessibility

### Heading Hierarchy
**Test:** Verify proper H1 → H2 → H3 structure

**Steps:**
1. Install HeadingsMap browser extension (Chrome/Firefox)
2. Open provider page
3. Click HeadingsMap icon
4. Verify hierarchy

**Expected Structure:**
```
H1: {provider.name}
  H2: What does the {provider.name} practice look like?
    H3: Our Practice Environment
  H2: What makes {provider.name} different for neurodivergent families?
    H3: Care Philosophy
  H2: How It Works
  H2: Frequently Asked Questions
  H2: Visit Us
  H2: What do families say about {provider.name}?
```

**Acceptance Criteria:**
- [ ] Only one H1 on page
- [ ] H2s are questions (3 minimum)
- [ ] No skipped heading levels (H1 → H3 without H2)
- [ ] All headings are descriptive

### Keyboard Navigation
**Test:** Verify full keyboard accessibility

**Steps:**
1. Open provider page
2. Press Tab repeatedly to navigate
3. Press Enter/Space to activate elements
4. Press Shift+Tab to navigate backwards

**Acceptance Criteria:**
- [ ] All interactive elements focusable (buttons, links, accordion)
- [ ] Focus indicators visible on all elements
- [ ] Tab order follows logical reading order
- [ ] No keyboard traps (can always tab out)
- [ ] FAQ accordion opens/closes with Enter/Space

### Screen Reader Test
**Test:** Verify screen reader compatibility

**Steps (Windows):**
1. Enable Narrator (Win + Ctrl + Enter)
2. Navigate page with arrow keys
3. Listen to announcements

**Acceptance Criteria:**
- [ ] All images have descriptive alt text
- [ ] Links announce destination ("Home", "Providers")
- [ ] Buttons announce action ("Book Appointment")
- [ ] Landmarks announced (navigation, main, footer)
- [ ] ARIA labels present where needed

---

## 5. Answer Box Validation

### AI Extraction Test
**Test:** Verify answer box meets AI requirements

**Steps:**
1. Locate answer box on page (id="answer-box")
2. Count characters in "Short answer" section
3. Verify formatting

**Expected Content:**
```
Short answer: [Provider Name] is a [specialty] specializing in autism, ADHD, and neurodivergent care for children and families.

Who it's for: Parents seeking compassionate, neurodiversity-affirming care for their child.

Key outcome: Expert support that respects your child's unique neurodivergent profile.
```

**Acceptance Criteria:**
- [ ] Has id="answer-box"
- [ ] "Short answer" ≤320 characters
- [ ] Contains 3 sections: Short answer, Who it's for, Key outcome
- [ ] Uses provider.name dynamically
- [ ] Appears before main content (for AI extraction)

---

## 6. Semantic Section IDs

### ID Validation
**Test:** Verify all required section IDs exist

**Steps:**
1. Open browser console
2. Run each command:
```javascript
document.getElementById('hero')         // Header section
document.getElementById('answer-box')   // TL;DR answer
document.getElementById('proof')        // Stats + testimonial
document.getElementById('features')     // Key features
document.getElementById('how-it-works') // 3-step process
document.getElementById('faq')          // FAQ accordion
document.getElementById('local')        // NAP + map
document.getElementById('cta-final')    // Final CTA
```

**Acceptance Criteria:**
- [ ] All 8 IDs return valid elements (not null)
- [ ] IDs match playbook naming convention
- [ ] Sections appear in logical order on page

---

## 7. FAQ Section

### Content Validation
**Test:** Verify FAQ structure and content

**Steps:**
1. Scroll to FAQ section (id="faq")
2. Click each accordion item
3. Read content

**Expected Questions:**
1. "Does {provider.name} accept insurance?"
2. "What age groups does {provider.name} serve?"
3. "What should I expect for my first visit?"
4. "What does 'autism-affirming' mean at {provider.name}?"
5. "What are the current wait times?"

**Acceptance Criteria:**
- [ ] 5 FAQ items minimum
- [ ] Questions use provider.name dynamically
- [ ] Accordion expands/collapses smoothly
- [ ] Answers are specific and helpful
- [ ] Questions match common parent concerns

---

## 8. Local Section (NAP)

### NAP Format Validation
**Test:** Verify Name, Address, Phone display

**Steps:**
1. Scroll to "Visit Us" section (id="local")
2. Verify NAP format with icons

**Expected Format:**
```
🏢 {provider.name}
📍 {provider.vicinity}
📞 {provider.formatted_phone_number}
```

**Acceptance Criteria:**
- [ ] Name matches provider.name
- [ ] Address matches provider.vicinity
- [ ] Phone is formatted (e.g., "(555) 123-4567")
- [ ] Icons display correctly (MapPin, Phone)
- [ ] All text is readable and accessible

### Google Map Embed
**Test:** Verify embedded map displays

**Steps:**
1. Check map iframe renders
2. Verify place_id is correct
3. Test map interactions

**Acceptance Criteria:**
- [ ] Map iframe loads without errors
- [ ] Map shows correct provider location (red pin)
- [ ] Map is responsive (fills container)
- [ ] place_id in URL matches provider.place_id
- [ ] API key is valid (no error overlay on map)

### Hours Display
**Test:** Verify full hours list with today highlighted

**Steps:**
1. Check hours section below map
2. Verify today's day is highlighted

**Acceptance Criteria:**
- [ ] All 7 days displayed (Monday - Sunday)
- [ ] Today's day has highlighted background
- [ ] Hours format is consistent (e.g., "9:00 AM - 5:00 PM")
- [ ] "Closed" shown for non-business days
- [ ] Hours match provider.opening_hours data

---

## 9. Proof Section

### Stats Grid
**Test:** Verify 3-column stats display

**Expected Stats:**
- Families Served: {provider.user_ratings_total}+
- Average Rating: {provider.rating}/5.0
- Recommendation: 95%

**Acceptance Criteria:**
- [ ] 3 stat cards display in row
- [ ] Icons render (Users, Star, ThumbsUp)
- [ ] Numbers use provider data dynamically
- [ ] Stats are visible and readable

### Testimonial
**Test:** Verify testimonial with date

**Expected Content:**
```
"[Quote about provider experience]"
— Parent of autistic child
[Current Date]
```

**Acceptance Criteria:**
- [ ] Testimonial card displays
- [ ] Quote is in quotation marks
- [ ] Attribution shows "Parent of autistic child"
- [ ] Date shows current date (format: "January 15, 2025")
- [ ] ThumbsUp icon appears

---

## 10. Breadcrumb Navigation

### Display Validation
**Test:** Verify breadcrumb shows correct path

**Expected Path:**
```
🏠 Home › Providers › {provider.name}
```

**Steps:**
1. Locate breadcrumb at top of page (after header)
2. Verify all 3 links
3. Test link navigation

**Acceptance Criteria:**
- [ ] Breadcrumb appears below header
- [ ] Shows 3 items: Home, Providers, {provider.name}
- [ ] ChevronRight separators between items
- [ ] "Home" links to "/"
- [ ] "Providers" links to "/professionals"
- [ ] Current page ({provider.name}) is bold, not clickable
- [ ] Home icon displays correctly

---

## 11. How It Works Section

### 3-Step Process
**Test:** Verify step-by-step process display

**Expected Steps:**
1. **Search & Match** - Browse verified providers...
2. **Book Your Visit** - Call {phone} or use online booking...
3. **Begin Care** - Attend your first visit...

**Acceptance Criteria:**
- [ ] 3 steps display in order
- [ ] Gradient circle numbers (1, 2, 3)
- [ ] Step 2 includes dynamic phone number
- [ ] Steps are visually distinct
- [ ] Content is clear and actionable

---

## 12. Mobile Responsiveness

### Responsive Design Test
**Test:** Verify layout works on all screen sizes

**Steps:**
1. Open Chrome DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Test these sizes:
   - Mobile: 375x667 (iPhone SE)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080

**Acceptance Criteria:**
- [ ] Answer box readable on mobile (no overflow)
- [ ] Stats grid stacks on mobile (1 column)
- [ ] FAQ accordion works on mobile
- [ ] Map resizes properly (responsive iframe)
- [ ] Breadcrumb doesn't overflow on mobile
- [ ] All buttons are tap-friendly (≥44px height)
- [ ] Text is readable (font-size ≥16px on mobile)

---

## Final AI Optimization Checklist

### Google AI Overviews Readiness
- [ ] Answer box under H1 (<320 chars)
- [ ] H2s are questions
- [ ] Semantic section IDs present
- [ ] JSON-LD schemas error-free
- [ ] Open Graph tags complete
- [ ] LCP ≤2.5s
- [ ] CLS <0.1

### Perplexity Citation Readiness
- [ ] Structured data present
- [ ] Clear heading hierarchy
- [ ] Descriptive alt text on images
- [ ] FAQ section with clear Q&A
- [ ] NAP format for local SEO

### Accessibility (WCAG 2.1 AA)
- [ ] All images have alt text
- [ ] Keyboard navigable
- [ ] Color contrast ≥4.5:1
- [ ] ARIA labels where needed
- [ ] Screen reader friendly

---

## Test Summary

**Date Tested:** _____________
**Tested By:** _____________

**Results:**
- Structured Data: ☐ Pass ☐ Fail
- Social Meta Tags: ☐ Pass ☐ Fail
- Core Web Vitals: ☐ Pass ☐ Fail
- Accessibility: ☐ Pass ☐ Fail
- Content Sections: ☐ Pass ☐ Fail
- Mobile Responsive: ☐ Pass ☐ Fail

**Overall Status:** ☐ Ready for Production ☐ Needs Fixes

**Notes:**
______________________________________________________
______________________________________________________
______________________________________________________
