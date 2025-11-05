# 🎯 Neurodivergent-Focused Filtering

## Overview

The Google Places API integration has been **specifically configured** to focus exclusively on healthcare providers who serve the neurodivergent community. Generic medical practices and general healthcare providers are automatically filtered out.

---

## 🔍 What Gets Included

### Neurodivergent-Focused Providers Only

The system **only shows** providers whose names, descriptions, or specialties include:

✅ **Autism & ASD**
- Autism specialists
- ASD therapy centers
- Autism spectrum services
- Asperger's support

✅ **ADHD & ADD**
- ADHD specialists
- Attention deficit therapy
- Executive function coaches

✅ **Developmental Conditions**
- Developmental pediatricians
- Neurodevelopmental specialists
- Early intervention programs
- Child development centers

✅ **Learning Differences**
- Dyslexia specialists
- Learning disability support
- Reading specialists
- Educational therapists

✅ **Therapeutic Services**
- Speech therapy (neurodivergent-focused)
- Occupational therapy (sensory integration)
- Applied Behavior Analysis (ABA)
- Behavioral therapy for autism
- Sensory processing therapy

✅ **Specialized Care**
- Special needs pediatricians
- Pediatric neurologists
- Child psychologists (developmental focus)

---

## 🚫 What Gets Filtered Out

### Excluded Provider Types

The system **automatically excludes**:

❌ Urgent care centers
❌ Emergency rooms
❌ Walk-in clinics
❌ Primary care physicians (general)
❌ Family medicine (general practice)
❌ Internal medicine (general)
❌ General practice doctors

**Why?** These providers don't specialize in neurodivergent care and would dilute the search results with irrelevant options.

---

## 🎨 Specialty Search Types

### Available Filters

When using live data, you can filter by specific neurodivergent specialties:

#### 1. **Autism Specialists** 🧩
- Search term: `"autism specialist"`
- Focuses on: ASD diagnosis, autism therapy, autism support services
- Best for: Core autism spectrum services

#### 2. **ADHD Specialists** 🎯
- Search term: `"ADHD specialist"`
- Focuses on: ADHD diagnosis, attention therapy, executive function
- Best for: Attention and focus-related challenges

#### 3. **Speech Therapy (ASD)** 🗣️
- Search term: `"speech therapy autism"`
- Focuses on: Communication therapy for neurodivergent children
- Best for: Speech delays, communication disorders

#### 4. **Occupational Therapy** ✋
- Search term: `"occupational therapy sensory"`
- Focuses on: Sensory integration, fine motor skills, daily living skills
- Best for: Sensory processing, motor development

#### 5. **Developmental Pediatricians** 👶
- Search term: `"developmental pediatrician"`
- Focuses on: Developmental assessments, medical management
- Best for: Diagnosis, medical oversight, developmental monitoring

#### 6. **ABA Therapists** 📊
- Search term: `"ABA therapy autism"`
- Focuses on: Applied Behavior Analysis, behavioral intervention
- Best for: Structured behavioral therapy programs

#### 7. **All Neurodivergent Care** 🌟
- Comprehensive search across all neurodivergent specialties
- Best for: Initial broad search

---

## 💻 How to Use the Filters

### In the Live Map Demo

1. **Navigate to "Live Map"** tab
2. **Toggle on** "Live Google Places Data"
3. **Select specialty** from the dropdown:
   - Autism Specialists
   - ADHD Specialists
   - Speech Therapy (ASD)
   - Occupational Therapy
   - Developmental Pediatricians
   - ABA Therapists
   - All Neurodivergent Care
4. **Click "Refresh"** to fetch filtered results

### In Code

```tsx
import { useHealthcareProviders } from '@/hooks/use-google-places'

// Autism specialists only
const { professionals } = useHealthcareProviders({
  location: { lat: 34.0195, lng: -118.4912 },
  radius: 5000,
  searchType: 'autism'
})

// ADHD specialists only
const { professionals } = useHealthcareProviders({
  location: { lat: 34.0195, lng: -118.4912 },
  radius: 5000,
  searchType: 'adhd'
})

// Speech therapists (neurodivergent focus)
const { professionals } = useHealthcareProviders({
  location: { lat: 34.0195, lng: -118.4912 },
  radius: 5000,
  searchType: 'speech'
})
```

### Direct API Service Methods

```tsx
import { googlePlacesService } from '@/services/googlePlaces'

// Specific specialty searches
const autismSpecialists = await googlePlacesService.searchAutismSpecialists(
  { lat: 34.0195, lng: -118.4912 },
  5000
)

const adhdSpecialists = await googlePlacesService.searchADHDSpecialists(
  { lat: 34.0195, lng: -118.4912 },
  5000
)

const speechTherapists = await googlePlacesService.searchSpeechTherapists(
  { lat: 34.0195, lng: -118.4912 },
  5000
)

const otTherapists = await googlePlacesService.searchOccupationalTherapists(
  { lat: 34.0195, lng: -118.4912 },
  5000
)

const devPediatricians = await googlePlacesService.searchDevelopmentalPediatricians(
  { lat: 34.0195, lng: -118.4912 },
  5000
)

const abaTherapists = await googlePlacesService.searchABATherapists(
  { lat: 34.0195, lng: -118.4912 },
  5000
)
```

---

## 🔧 How the Filtering Works

### Two-Layer Filtering System

#### Layer 1: Keyword-Based Search
```javascript
// Search with neurodivergent-specific keywords
const keywords = [
  'autism specialist',
  'autism therapy',
  'ASD specialist',
  'developmental pediatrician',
  'neurodevelopmental specialist',
  'ADHD specialist',
  'sensory integration therapy',
  'pediatric occupational therapy autism',
  'speech therapy autism',
  'behavioral therapy autism',
  'ABA therapy',
  'special needs pediatrician',
  'dyslexia specialist',
  'learning disability specialist'
]
```

#### Layer 2: Post-Search Filtering
```javascript
// Filter results to ensure neurodivergent focus
const neurodivergentIndicators = [
  'autism', 'asd', 'asperger', 'adhd', 'add',
  'developmental', 'neurodevelopmental',
  'special needs', 'sensory', 'dyslexia',
  'learning disability', 'aba', 'applied behavior',
  'speech therapy', 'occupational therapy',
  'behavioral therapy', 'pediatric therapy',
  'child development', 'early intervention', 'spectrum'
]

// Exclude general practice
const generalPracticeIndicators = [
  'urgent care', 'emergency', 'walk-in clinic',
  'primary care', 'family medicine',
  'internal medicine', 'general practice'
]
```

---

## 📊 Search Quality

### What to Expect

**High Quality Results:**
- ✅ Specialists who focus on neurodivergent care
- ✅ Therapy centers with autism/ADHD programs
- ✅ Developmental pediatricians
- ✅ ABA therapy providers
- ✅ Sensory integration specialists

**Filtered Out:**
- ❌ General pediatricians (unless neurodevelopmental focus)
- ❌ Primary care doctors
- ❌ Urgent care centers
- ❌ General family practice

### Result Accuracy

The filtering is based on:
1. **Provider name** - Does it mention autism, ADHD, developmental, etc.?
2. **Business type** - Is it a specialty therapy center?
3. **Description** - Does it indicate neurodivergent focus?
4. **Reviews** - Do patients mention neurodivergent care?

---

## 🎯 Best Practices

### For Best Results:

1. **Start Specific**
   - Use specialty filters (Autism, ADHD, etc.)
   - Narrow down to exactly what you need

2. **Expand if Needed**
   - If few results, use "All Neurodivergent Care"
   - Increase search radius

3. **Combine with User Location**
   - Use "My Location" button for nearby results
   - Ensures relevant geographic matches

4. **Check Provider Details**
   - Click markers to view full profiles
   - Read reviews for confirmation of specialty

5. **Refresh Periodically**
   - New providers added regularly
   - Click "Refresh" to get latest results

---

## 🔍 Example Use Cases

### Scenario 1: Finding Autism Specialists Near You
```tsx
const { professionals } = useHealthcareProviders({
  location: userLocation,
  searchType: 'autism',
  radius: 5000
})
```
**Result:** Only providers specializing in autism spectrum disorders

### Scenario 2: Finding ADHD Support
```tsx
const { professionals } = useHealthcareProviders({
  location: { lat: 34.0195, lng: -118.4912 },
  searchType: 'adhd',
  radius: 10000 // 10km for wider search
})
```
**Result:** Only ADHD-focused specialists and therapists

### Scenario 3: Speech Therapy for Neurodivergent Children
```tsx
const { professionals } = useHealthcareProviders({
  location: userLocation,
  searchType: 'speech',
  radius: 5000
})
```
**Result:** Speech therapists who work with autism/neurodivergent children

---

## 🎊 Summary

### What Makes This Special

**✨ Neurodivergent-First Approach**
- Every search is filtered for neurodivergent focus
- Generic providers automatically excluded
- Results are relevant to your community

**🎯 Precision Filtering**
- Multiple layers of filtering
- Keyword-based search
- Post-search validation
- Type-based exclusions

**🚀 Easy to Use**
- Simple dropdown selection
- One-click specialty switching
- Real-time filtering
- Cached for performance

**💙 Community-Focused**
- Built specifically for neurodivergent families
- No irrelevant results
- Quality over quantity
- Specialist providers only

---

## 📚 Additional Resources

- See `GOOGLE_PLACES_API_CAPABILITIES.md` for full API details
- See `GOOGLE_PLACES_INTEGRATION.md` for implementation guide
- See `INTEGRATION_COMPLETE.md` for quick start

---

**Your search results will ONLY show providers who specialize in serving the neurodivergent community.** 🌟
