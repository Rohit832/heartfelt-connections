# Implementation Plan - Home UI Polish & Navigation Fix

The goal is to visually upgrade the Home UI with a professional AI-generated banner and fix the navigation issue where refreshing the page resets the view to Home.

## User Review Required

> [!IMPORTANT]
> **Banner Design**: I will generate a "Professional medical diagnostic center banner featuring a happy Indian family and a doctor, blue and white theme" for the Hero section.
>
> **Navigation Fix**: I will update the app to respect the URL (e.g., `/profile`) on initial load, so refreshing the page doesn't kick you back to the home screen.

## Proposed Changes

### 1. Asset Generation
- **Tool**: `generate_image`
- **Output**: `public/hero_banner.png`
- **Prompt**: "High quality web banner for medical diagnostic lab, clean modern blue theme, happy indian family, professional doctor, negative space on left for text, 4k resolution."

### 2. Navigation Logic Update (`App.jsx`)
- **Current**: `const [currentPage, setCurrentPage] = useState('home');`
- **New**: Initialize state based on `window.location.pathname`.
    - `/` -> `'home'`
    - `/profile` -> `'profile'`
    - `/reports` -> `'reports'`
    - `/cart` -> `'cart'`
- **Sync**: Update `window.history.pushState` when `setCurrentPage` is called to keep URL in sync.

### 3. Home UI Update (`App.jsx`, `App.css`)
- Replace the CSS gradient in the Hero Section with the new `hero_banner.png`.
- Ensure text contrast and layout works with the new background.

## Verification Plan

### Automated Tests
- **Navigation**:
    - Browser Subagent: Visit `/profile` directly -> Verify `UserProfile` component renders.
    - Browser Subagent: Click "Home" -> Verify URL updates to `/` (or matches home view).
- **Visuals**:
    - Browser Subagent: Screenshot Home Page to verify banner placement and quality.

### Manual Verification
- User to check the aesthetic appeal of the new banner.
