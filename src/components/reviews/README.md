# Review Components

This folder contains reusable review display components for the NeuroConnect provider profile pages.

## Components

### 1. SpotlightReviewCarousel
**Current Default** - Shows one review at a time with smooth animations.

#### Features:
- 🎯 **Single Review Focus** - Displays one review at a time for maximum impact
- 🔥 **Hot Counter** - Shows "X of Y" reviews with dynamic heat indicators:
  - 🔥 Fire (100+ reviews) - Orange/Red gradient
  - 📈 Hot (50+ reviews) - Amber/Orange gradient  
  - ⭐ Warm (<50 reviews) - Blue/Purple gradient
- ✨ **Smooth Animations** - Fade in/out transitions between reviews
- 📊 **Progress Dots** - Click to jump to specific reviews
- 🎨 **Beautiful Design** - Large centered layout with gradient backgrounds

#### Usage:
```tsx
<SpotlightReviewCarousel 
  reviews={provider.reviews}
  rating={provider.rating}
  totalReviews={provider.user_ratings_total}
  intervalMs={6000} // Optional: time between transitions (default: 6000ms)
/>
```

### 2. FancyReviewsMarquee
**Alternative Option** - Infinite scrolling marquee display.

#### Features:
- 🎠 **Infinite Scroll** - Two rows of reviews continuously scrolling
- 🎭 **Dual Direction** - First row scrolls left, second row scrolls right
- 🎪 **Hover Pause** - Animations pause when hovering over a review
- 🎨 **Card Variety** - Alternating card styles with different gradients
- 📱 **Responsive** - Works great on all screen sizes

#### Usage:
```tsx
<FancyReviewsMarquee 
  reviews={provider.reviews}
  rating={provider.rating}
  totalReviews={provider.user_ratings_total}
/>
```

## Switching Between Components

In `ProviderProfilePage.tsx`, you can easily switch between the two styles:

```tsx
{/* Option 1: Spotlight (Current Default) */}
<SpotlightReviewCarousel 
  reviews={provider.reviews}
  rating={provider.rating}
  totalReviews={provider.user_ratings_total}
/>

{/* Option 2: Marquee (Uncomment to use) */}
{/* <FancyReviewsMarquee 
  reviews={provider.reviews}
  rating={provider.rating}
  totalReviews={provider.user_ratings_total}
/> */}
```

## Props

Both components accept the same props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `reviews` | `google.maps.places.PlaceReview[]` | ✅ | Array of Google Place reviews |
| `rating` | `number` | ❌ | Average rating (e.g., 4.8) |
| `totalReviews` | `number` | ❌ | Total number of reviews |
| `intervalMs` | `number` | ❌ | (Spotlight only) Milliseconds between transitions |

## Animations

### Spotlight Animations
- **Fade In/Out** - Reviews fade and scale when transitioning
- **Pulsing Icons** - Heat indicator icons pulse for attention
- **Hover Scale** - Counter badge scales up on hover
- **Star Animations** - Stars scale slightly when rendered

### Marquee Animations
- **Continuous Scroll** - Defined in `src/index.css`
- **Hover Effects** - Cards rotate, scale, and change shadow on hover
- **Pause on Hover** - Animation pauses when user hovers

## Customization

You can customize the appearance by:
1. Adjusting Tailwind classes in the components
2. Modifying animation durations in `src/index.css`
3. Changing gradient colors for different brand styles
4. Adding new heat level thresholds in SpotlightReviewCarousel

## Performance

- Both components are optimized for performance
- SpotlightReviewCarousel uses cleanup in useEffect to prevent memory leaks
- Marquee uses CSS animations for smooth 60fps scrolling
