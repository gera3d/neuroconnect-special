# AI Assistant Integration

## Overview
The application now features an AI-powered voice assistant to help users find the right healthcare provider based on their needs.

## Features

### Desktop Experience (width > 768px)
- **Vapi Widget**: A floating "Talk with AI" button appears in the bottom-right corner
- Users can click the button to start a voice conversation with the AI assistant
- The widget is provided by Vapi.ai and handles the entire voice interface

### Mobile Experience (width ≤ 768px)
- **Direct Phone Call**: Users tap the button to directly call (561) 757-7914
- The widget is hidden on mobile devices (via CSS)
- Uses native phone calling functionality

## Integration Points

### 1. Main Navigation (`MainNav.tsx`)
- "Get Help" button in the navigation bar
- Desktop: Opens Vapi widget
- Mobile: Initiates phone call

### 2. Live Map Control Panel (`LiveMapDemo.tsx`)
- Prominent "Not sure what you need?" section at the top of the control panel
- Button displays phone number: (561) 757-7914
- Desktop: Opens Vapi widget
- Mobile: Initiates phone call

## Technical Implementation

### HTML Integration (`index.html`)
```html
<!-- Vapi AI Widget Script -->
<script
  src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
  async
  type="text/javascript"
></script>

<!-- Widget Element -->
<vapi-widget 
  assistant-id="06e7ca99-572b-4623-9c79-b9391524def8" 
  public-key="245c6606-babd-43ec-8a6e-fa9736964ef8">
</vapi-widget>
```

### Component Logic
Both components use the same click handler pattern:

```typescript
const handleAIAssistantClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  // Check if it's desktop (width > 768px)
  if (window.innerWidth > 768) {
    e.preventDefault()
    // Trigger the Vapi widget
    const vapiWidget = document.querySelector('vapi-widget') as any
    if (vapiWidget && typeof vapiWidget.open === 'function') {
      vapiWidget.open()
    }
  }
  // On mobile, the tel: link will work naturally
}
```

### CSS Styling (`index.css`)
```css
/* Hide Vapi widget on mobile devices */
@media (max-width: 768px) {
  vapi-widget {
    display: none !important;
  }
}
```

## User Experience Flow

1. **User arrives on Live Map**
   - Sees control panel with "Not sure what you need?" prompt
   - Clear option to get AI help OR search manually

2. **Desktop User**
   - Clicks "(561) 757-7914" button
   - Vapi widget opens with voice interface
   - Can talk to AI to describe their needs
   - AI helps match them with providers

3. **Mobile User**
   - Taps "(561) 757-7914" button
   - Phone dialer opens automatically
   - Can call and speak with AI assistant
   - Same personalized matching experience

## Configuration

### Vapi Assistant Details
- **Assistant ID**: `06e7ca99-572b-4623-9c79-b9391524def8`
- **Public Key**: `245c6606-babd-43ec-8a6e-fa9736964ef8`
- **Phone Number**: (561) 757-7914

## Benefits

1. **Accessibility**: Voice interface helps users who may struggle with complex search filters
2. **Personalization**: AI can understand natural language descriptions of needs
3. **Mobile-first**: Seamless phone calling on mobile devices
4. **Desktop-optimized**: Rich widget experience on desktop browsers
5. **Non-intrusive**: Widget appears only when needed, doesn't block the UI
