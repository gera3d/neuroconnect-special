# NeuroConnect Web Demo - Planning Guide

A simplified, accessible web platform connecting families of neurodivergent individuals with specialized professionals.

**Experience Qualities:**
1. **Calming** - Interface should provide a stress-free, peaceful browsing experience for parents already navigating complex challenges
2. **Trustworthy** - Professional profiles and matching features should inspire confidence and legitimacy
3. **Accessible** - Designed with neurodivergent-friendly principles including clear hierarchy, reduced cognitive load, and sensory-friendly aesthetics

**Complexity Level**: Light Application (multiple features with basic state)
- Core focus on browsing professionals, filtering by needs, and viewing detailed profiles. This demo showcases the professional directory and matching concepts without full backend infrastructure like video calls or payment processing.

## Essential Features

### Professional Directory with Smart Filters
- **Functionality**: Searchable database of professionals with multi-criteria filtering
- **Purpose**: Enables busy parents to quickly find relevant specialists without overwhelming choice paralysis
- **Trigger**: User clicks "Find Professionals" or uses search/filter controls on main view
- **Progression**: Landing → View all professionals → Apply filters (specialty, location, treatment type, condition) → Filtered results → Select professional
- **Success criteria**: Users can filter from 15+ professionals to 2-3 relevant matches in under 30 seconds

### Professional Profile View
- **Functionality**: Detailed professional cards showing qualifications, specialties, treatment philosophy, and contact methods
- **Purpose**: Build trust and help parents make informed decisions about potential providers
- **Trigger**: User clicks on a professional card from the directory
- **Progression**: Professional list → Click card → Expanded profile dialog → View details → Contact or close
- **Success criteria**: Profile contains all essential decision-making information (specialty, location, approach, qualifications)

### Needs-Based Matching Suggestions
- **Functionality**: Highlight professionals matching specific family needs using visual indicators
- **Purpose**: Surface the most relevant providers for specific conditions and preferences
- **Trigger**: Filter selection or visual badges on professional cards
- **Progression**: Apply filters → System highlights matching professionals → Browse recommended matches → Select provider
- **Success criteria**: Visual distinction between highly-relevant and standard matches is immediately clear

## Edge Case Handling
- **No Results State**: Display encouraging message with suggestions to broaden search criteria or explore alternative treatment types
- **Empty Initial State**: Show sample professionals with clear value proposition for what the platform offers
- **Accessibility Needs**: Support keyboard navigation, high contrast mode readiness, and screen reader compatibility
- **Long Professional Bios**: Truncate with "read more" expansion to prevent overwhelming information density

## Design Direction
The design should feel calming, professional, and trustworthy—evoking the warmth of a supportive community center combined with the credibility of a medical directory. A minimal interface serves the purpose best, reducing cognitive load for stressed parents while maintaining clear information hierarchy.

## Color Selection
Analogous color scheme using soft, calming blues and teals with warm accent touches

The palette draws from nature-inspired, therapeutic colors that research shows have calming effects:
- **Primary Color**: Soft Teal (oklch(0.65 0.08 200)) - Communicates trust, calm, and healthcare professionalism
- **Secondary Colors**: 
  - Light Sky Blue (oklch(0.85 0.05 220)) for backgrounds - Creates peaceful, airy feeling
  - Deeper Ocean Blue (oklch(0.45 0.09 230)) for emphasis - Adds depth and authority
- **Accent Color**: Warm Coral (oklch(0.70 0.12 35)) - Represents warmth, support, and human connection for CTAs
- **Foreground/Background Pairings**:
  - Background (Very Light Blue oklch(0.98 0.01 220)): Dark text (oklch(0.25 0.02 240)) - Ratio 12.8:1 ✓
  - Card (White oklch(1 0 0)): Dark text (oklch(0.25 0.02 240)) - Ratio 14.2:1 ✓
  - Primary (Soft Teal oklch(0.65 0.08 200)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Accent (Warm Coral oklch(0.70 0.12 35)): Dark text (oklch(0.25 0.02 240)) - Ratio 7.1:1 ✓
  - Muted (Light Gray oklch(0.92 0.01 220)): Medium text (oklch(0.50 0.02 240)) - Ratio 4.6:1 ✓

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
Animations should be subtle and purposeful, primarily serving to orient users during state changes rather than decorative flourish—essential for users who may experience sensory sensitivities.

- **Purposeful Meaning**: Gentle transitions communicate state changes without startling; micro-interactions on cards provide tactile feedback
- **Hierarchy of Movement**: Professional cards receive hover lift effect (priority interaction), filters slide in smoothly (secondary), dialog overlays fade with backdrop blur (context preservation)

## Component Selection

- **Components**:
  - **Card**: Professional listings with hover states and clear visual hierarchy
  - **Badge**: Treatment types, specialties, and condition tags with calm colors
  - **Dialog**: Professional profile expansion for detailed view without navigation
  - **Select/Dropdown**: Filter controls for specialty, location, treatment type
  - **Input**: Search field with icon for quick professional name search
  - **Button**: Primary actions (contact, view profile) with distinct hierarchy
  - **Separator**: Visual breathing room between sections
  - **ScrollArea**: Smooth professional list scrolling
  
- **Customizations**:
  - Professional cards with custom layout featuring avatar, specialty badges, and "featured match" indicator
  - Filter sidebar with grouped controls and clear visual separation
  - Custom "match score" visual indicator using subtle iconography
  
- **States**:
  - Buttons: Default with soft shadows, hover with slight lift, active with gentle press, disabled with reduced opacity
  - Cards: Default elevated, hover with enhanced shadow and slight scale, selected with accent border
  - Inputs: Default with border, focus with teal ring and subtle glow, error with coral accent
  
- **Icon Selection**: 
  - Phosphor icons throughout for consistency
  - MagnifyingGlass for search
  - FunnelSimple for filters
  - MapPin for location
  - Heartbeat for medical specialties
  - User for profiles
  - ChatCircle for messaging
  - Star for featured/recommended
  
- **Spacing**: 
  - Container padding: 6 (24px) for breathing room
  - Card internal padding: 4-6 (16-24px)
  - Element gaps: 2 (8px) for tight groupings, 4 (16px) for related sections, 8 (32px) for major sections
  
- **Mobile**: 
  - Stack filter sidebar above professional grid on mobile
  - Single column card layout below 768px
  - Larger touch targets (min 44px) for all interactive elements
  - Collapsible filter section with clear toggle button
  - Professional cards remain full-width with vertical layout of content
