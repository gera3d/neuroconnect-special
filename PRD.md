# NeuroConnect Web Demo - Planning Guide

A polished, professional web platform connecting families of neurodivergent individuals with specialized professionals, featuring industry-leading registry and directory best practices, with a comprehensive navigation structure showing the full application roadmap.

**Experience Qualities:**
1. **Trustworthy** - Professional verification badges, ratings, reviews, and transparent credentials inspire confidence like top medical directories (Healthgrades, Zocdoc, Psychology Today)
2. **Efficient** - Smart filtering, sorting, active filter chips, and quick-scan cards enable fast decision-making similar to successful marketplaces (Yelp, Care.com)
3. **Accessible** - Clear visual hierarchy, generous spacing, and neurodivergent-friendly design reduce cognitive load and create calm browsing

**Complexity Level**: Light Application (multiple features with basic state)
- Professional directory with advanced filtering, sorting, trust signals (ratings/reviews), verification badges, detailed profiles, and smart matching indicators. Navigation menu shows full platform roadmap with current and upcoming features clearly distinguished.

## Essential Features

### Navigation & Feature Discovery
- **Functionality**: Slide-out menu displaying all platform features with clear status indicators (Active vs Coming Soon)
- **Purpose**: Provides transparency about available features and platform roadmap, setting clear expectations for users
- **Trigger**: User clicks Menu button in header or swipes from left edge (mobile)
- **Progression**: Click Menu → View all features → See Professional Directory marked as Active → See future features marked as Coming Soon → Close menu or tap active feature
- **Success criteria**: Users understand which features are available now and what's planned; menu is accessible and clearly organized

### Trust Signals & Social Proof
- **Functionality**: Display star ratings (1-5), review counts, verification badges, years of experience, and client acceptance status on each professional listing
- **Purpose**: Build confidence and help parents quickly identify credible, highly-rated providers (mirroring Yelp, Healthgrades, Psychology Today success patterns)
- **Trigger**: Visible on all professional cards and detailed in profile view
- **Progression**: Browse professionals → Quick-scan trust indicators (rating stars, verification badge, review count) → Deep-dive profile for full details
- **Success criteria**: Users can assess professional credibility within 3 seconds of viewing card

### Professional Directory with Smart Filters
- **Functionality**: Searchable database with multi-criteria filtering, active filter chips, and intelligent sorting options
- **Purpose**: Enables busy parents to quickly narrow 12+ professionals to 2-3 relevant matches without overwhelming choice paralysis
- **Trigger**: User applies filters (specialty, location, treatment type, condition) or changes sort order (best match, highest rated, most reviews, most experience)
- **Progression**: Landing → View all professionals → Apply filters → See active filter chips → Adjust/remove individual filters → Filtered results → Select professional
- **Success criteria**: Users can filter from 12+ professionals to relevant matches in under 30 seconds; active filter chips make current selections immediately visible

### Professional Profile View
- **Functionality**: Comprehensive profile cards with qualifications, ratings/reviews, specialties, treatment philosophy, languages, insurance, availability, and acceptance status
- **Purpose**: Provide all decision-making information in scannable, organized format similar to medical directory standards
- **Trigger**: User clicks on a professional card from the directory
- **Progression**: Professional list → Click card → Expanded dialog → View organized sections (trust signals, bio, philosophy, specialties, practical info) → Contact or close
- **Success criteria**: Profile contains all essential information organized in clear visual hierarchy with trust signals prominently displayed

### Intelligent Sorting & Matching
- **Functionality**: Multiple sort options (Best Match/Recommended, Highest Rated, Most Reviews, Most Experience) with visual "Top Match" badges
- **Purpose**: Surface the most relevant and highest-quality providers based on user preference
- **Trigger**: User selects sort option from dropdown or system highlights recommended matches
- **Progression**: View professionals → Change sort order → Results re-order → Browse sorted list → Identify top matches via badges
- **Success criteria**: Recommended professionals are visually distinct; sorting immediately reorganizes results; acceptance status clearly visible

## Edge Case Handling
- **No Results State**: Display encouraging message with emoji, clear explanation, and "Clear All Filters" button to guide users back to browsing
- **Empty Initial State**: Show all professionals with smart defaults and clear value proposition
- **Waitlist-Only Professionals**: Clearly marked with distinct icon/text; contact button changes to "Join Waitlist" instead of disabled state
- **Unverified Professionals**: No verification badge shown; other trust signals (ratings, reviews) still visible
- **No Insurance**: Display "Private pay only" instead of empty insurance list
- **Active Filter Management**: Individual filter removal via chip X buttons; bulk removal via "Clear All" button; active filter count displayed
- **Long Professional Bios**: Truncate on cards with line-clamp-2; full text in dialog
- **Mobile Responsiveness**: Filters stack above results; cards go single-column; touch targets minimum 44px

## Design Direction
The design should feel professional, credible, and efficient—evoking the polish of leading medical directories (Healthgrades, Zocdoc) combined with the usability of top consumer marketplaces (Yelp, Care.com). A clean, modern interface with strong visual hierarchy, prominent trust signals, and efficient scanning patterns serves busy parents who need to make confident decisions quickly.

## Color Selection
Modern, professional color palette with strong contrast and clear hierarchy

The palette balances healthcare professionalism with approachable warmth:
- **Primary Color**: Deep Blue (oklch(0.55 0.15 235)) - Communicates trust, credibility, and medical professionalism like top healthcare directories
- **Secondary Colors**: 
  - Light Background (oklch(0.96 0.01 240)) - Creates clean, airy canvas for content focus
  - Muted Gray (oklch(0.96 0.005 240)) - Subtle backgrounds for secondary information
- **Accent Color**: Warm Coral-Orange (oklch(0.68 0.19 45)) - Represents featured matches, CTAs, and important highlights
- **Trust Signals**: Amber/Gold for star ratings (industry standard), Blue for verification badges, Green for availability status
- **Foreground/Background Pairings**:
  - Background (Very Light oklch(0.99 0.005 220)): Dark text (oklch(0.20 0.015 240)) - Ratio 14.1:1 ✓
  - Card (White oklch(1 0 0)): Dark text (oklch(0.20 0.015 240)) - Ratio 15.2:1 ✓
  - Primary (Deep Blue oklch(0.55 0.15 235)): White text (oklch(0.99 0 0)) - Ratio 7.8:1 ✓
  - Accent (Warm Coral oklch(0.68 0.19 45)): White text (oklch(0.99 0 0)) - Ratio 5.1:1 ✓
  - Muted (Light Gray oklch(0.96 0.005 240)): Medium text (oklch(0.47 0.015 240)) - Ratio 5.2:1 ✓

## Font Selection
Typography should convey accessibility, warmth, and modern professionalism through a clean sans-serif that emphasizes readability.

Using **Inter** for its exceptional readability and accessibility features (large x-height, open apertures, distinguishable characters).

- **Typographic Hierarchy**:
  - H1 (App Title/Hero): Inter SemiBold/32px/tight letter spacing (-0.02em)
  - H2 (Section Headers): Inter SemiBold/24px/normal letter spacing
  - H3 (Professional Names): Inter Medium/18px/normal letter spacing
  - Body (Descriptions): Inter Regular/16px/relaxed line height (1.6)
  - Small (Metadata/Tags): Inter Medium/14px/normal spacing
  - Labels (Form fields): Inter Medium/14px/wide spacing (0.01em)

## Animations
Animations must be restrained, professional, and serve functional purposes—overly decorative motion undermines credibility in a healthcare context and can be overwhelming for neurodivergent users.

- **Purposeful Meaning**: Subtle entrance animations for ranked markers establish hierarchy without distraction; smooth spring physics on hover provide tactile feedback; no particle effects, rotating elements, or excessive pulsing that compete for attention
- **Hierarchy of Movement**: Map markers use minimal spring entrance (260 stiffness, 20 damping) with sequential delays (0.25s) to establish ranking; hover states lift elements 4-8px with controlled physics; all animations under 500ms to respect reduced-motion preferences  
- **Professional Aesthetic**: Solid gradient-filled numbered circles replace emoji markers; gentle ambient pulse (2.5s cycle) only on outer glow; credibility through restraint rather than spectacle

## Component Selection

- **Components**:
  - **Sheet**: Slide-out navigation menu from left side showing all platform features with status badges
  - **Badge**: Treatment types, specialties, condition tags, active filters, verification status, experience levels, feature status (Active/Coming Soon) with semantic color coding
  - **Card**: Professional listings with trust signals, hover states, verification badges, and clear visual hierarchy inspired by Yelp/Healthgrades patterns
  - **Dialog**: Comprehensive professional profile with organized sections, prominent trust signals, and all decision-making information
  - **Select/Dropdown**: Filter controls and sorting options with clear labels
  - **Input**: Search fields with icon prefixes for visual clarity (magnifying glass, map pin)
  - **Button**: Tiered action hierarchy (primary CTAs, secondary actions, ghost utility buttons)
  - **Separator**: Visual breathing room between profile sections
  - **Active Filter Chips**: Removable badges showing current filter state (Airbnb/Zillow pattern)
  - **Star Ratings**: Industry-standard 5-star visual with half-star support and numeric display
  - **Status Indicators**: Availability badges, verification checkmarks, experience highlights
  
- **Customizations**:
  - Professional cards with avatar placeholder, prominent ratings display, verification badge overlay, acceptance status footer
  - Enhanced filter sidebar with active filter chip section, icon-prefixed inputs, filter count badge
  - Results header with professional count, sort dropdown, and acceptance summary
  - Trust signal components: star ratings, review counts, verification badges, years of experience highlights
  - Staggered card entrance animations for polished feel
  
- **States**:
  - Buttons: Soft shadows on default, subtle lift on hover, gentle press active, reduced opacity disabled, context-aware labels (Send Message vs Join Waitlist)
  - Cards: Elevated default, enhanced shadow + border color on hover, smooth transform animation
  - Inputs: Border default, ring + border color on focus, icon prefix for context
  - Professional Cards: Verified badge overlay, recommended ribbon, acceptance status badge, hover lift effect
  - Filter Chips: Removable with X button, hover state for removal action
  
- **Icon Selection** (Phosphor icons): 
  - List for main navigation menu
  - MagnifyingGlass for search and directory
  - FunnelSimple for filters
  - MapPin for location
  - Star (fill/regular) for ratings and featured matches
  - Certificate for verification badges
  - CalendarCheck for availability status
  - ChatCircle for messaging features
  - Globe for languages
  - CreditCard for insurance
  - Clock for availability hours
  - SortAscending for sort controls
  - Sparkle for "Best Match" sorting and smart features
  - UserCircle for profile features
  - BookOpen for resources
  - Users for community features
  - Question for help dialog
  - X for removal actions
  
- **Spacing**: 
  - Container padding: 4-8 (16-32px) responsive
  - Card internal padding: 5-6 (20-24px) for comfortable density
  - Element gaps: 2 (8px) for tight groupings, 3-4 (12-16px) for related sections, 6-8 (24-32px) for major sections
  - Filter sidebar spacing: 5 (20px) between controls for clear separation
  
- **Mobile**: 
  - Filters stack above results grid on mobile (<1024px)
  - Single column card layout below 1280px (XL breakpoint)
  - Larger touch targets (min 44px) for all interactive elements
  - Results header stacks vertically with sort dropdown full-width
  - Professional cards maintain all information in stacked layout
  - Active filter chips wrap naturally
  - Dialog uses full viewport height with scroll
