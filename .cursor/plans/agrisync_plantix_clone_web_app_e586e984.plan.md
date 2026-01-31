---
name: AgriSync Plantix Clone Web App
overview: Build a fully offline-first agricultural advisory web app using React Native + Expo Web that combines Plantix-style disease detection (rule-based) with crop advisory, soil information, and 48-hour insights. The app will work completely offline with multi-language support (English, Hindi, Marathi) and be deployable as a web app.
todos:
  - id: setup-project
    content: Initialize Expo project with React Native and web support, configure app.json
    status: pending
  - id: setup-database
    content: Create SQLite database schema and initialization logic with all required tables
    status: pending
    dependencies:
      - setup-project
  - id: localization-system
    content: Implement i18next localization with English, Hindi, and Marathi translation files
    status: pending
    dependencies:
      - setup-project
  - id: navigation-structure
    content: Create bottom tab navigator with 5 tabs (Home, Crop, Soil, 48h, Settings) with icon-heavy UI
    status: pending
    dependencies:
      - setup-project
  - id: region-detection
    content: Implement offline region detection engine (GPS + manual selection with preloaded region data)
    status: pending
    dependencies:
      - setup-database
  - id: crop-registration
    content: Build crop registration screen and database integration with growth stage calculation
    status: pending
    dependencies:
      - setup-database
      - region-detection
  - id: soil-engine
    content: Implement soil information engine with crop-to-soil mapping based on region
    status: pending
    dependencies:
      - setup-database
      - crop-registration
  - id: crop-advisory-engine
    content: Create rule-based crop advisory engine for fertilizer, irrigation, and pest alerts
    status: pending
    dependencies:
      - soil-engine
  - id: disease-detection-engine
    content: Build rule-based disease detection engine with image analysis and symptom questionnaire
    status: pending
    dependencies:
      - setup-database
      - crop-registration
  - id: disease-ui
    content: Create DiseaseScreen with image upload, detection results, and treatment advice display
    status: pending
    dependencies:
      - disease-detection-engine
  - id: insight-48h-engine
    content: Implement 48-hour insight computation engine using weather snapshots and crop data
    status: pending
    dependencies:
      - crop-advisory-engine
      - setup-database
  - id: insight-ui
    content: Build Insight48hScreen to display forward-looking advice with proper localization
    status: pending
    dependencies:
      - insight-48h-engine
  - id: settings-screen
    content: Create comprehensive settings screen with all 9 sections and offline persistence
    status: pending
    dependencies:
      - localization-system
      - setup-database
  - id: preload-data
    content: Seed database with crops, soils, diseases, regions, and advisory rules from JSON files
    status: pending
    dependencies:
      - setup-database
  - id: ui-polish
    content: Implement accessibility features (high contrast, large fonts), offline indicator, and icon-heavy UI
    status: pending
    dependencies:
      - navigation-structure
  - id: web-deployment
    content: Configure Expo Web for production build and test web deployment
    status: pending
    dependencies:
      - ui-polish
---

# AgriSync: Plantix Clone with Offline-First Architecture

## Overview

Build a production-ready web application using **React Native + Expo Web** that combines Plantix-style disease detection with comprehensive crop advisory features. The app works **completely offline** with rule-based disease detection, multi-language support, and all core features functioning without internet connectivity.

## Architecture

### Tech Stack

- **Frontend**: React Native with Expo (web deployment via Expo Web)
- **Database**: SQLite via `expo-sqlite` for structured data
- **Storage**: `@react-native-async-storage/async-storage` for settings
- **Localization**: `i18next` with bundled JSON files (en, hi, mr)
- **State Management**: Zustand (lightweight, offline-first)
- **Image Processing**: Canvas API for offline image analysis (rule-based disease detection)

### Core Principles

1. **100% Offline-First**: All features work without internet
2. **Rule-Based Logic**: No black-box ML; transparent, explainable rules
3. **Multi-Language**: English, Hindi, Marathi with offline switching
4. **Accessibility**: Large fonts, high contrast, icon-heavy UI
5. **Web Deployable**: Works as PWA via Expo Web

## Project Structure

```
agrisync/
├── src/
│   ├── components/
│   │   ├── Navigation/
│   │   │   └── BottomTabNavigator.jsx      # 5-tab footer (Home, Crop, Soil, 48h, Settings)
│   │   ├── CropCard/
│   │   │   └── CropCard.jsx                # Display registered crops
│   │   ├── SoilCard/
│   │   │   └── SoilCard.jsx                # Soil information display
│   │   ├── DiseaseDetector/
│   │   │   ├── DiseaseDetector.jsx         # Plantix-like image upload + detection
│   │   │   ├── SymptomQuestionnaire.jsx    # Fallback when no image
│   │   │   └── DiseaseResult.jsx           # Display detection results
│   │   ├── InsightCard/
│   │   │   └── InsightCard.jsx             # 48-hour insight cards
│   │   ├── OfflineIndicator/
│   │   │   └── OfflineIndicator.jsx        # Always-visible offline status
│   │   └── LanguageSelector/
│   │       └── LanguageSelector.jsx       # Language switcher
│   │
│   ├── screens/
│   │   ├── HomeScreen.jsx                  # Dashboard with crop overview
│   │   ├── CropScreen.jsx                 # Crop registration & management
│   │   ├── SoilScreen.jsx                 # Soil information & mapping
│   │   ├── Insight48hScreen.jsx            # 48-hour forward-looking advice
│   │   ├── DiseaseScreen.jsx              # Disease detection (Plantix feature)
│   │   └── SettingsScreen.jsx             # Comprehensive settings
│   │
│   ├── engines/
│   │   ├── cropAdvisoryEngine.js           # Rule-based crop advisory
│   │   ├── soilEngine.js                  # Soil type mapping & analysis
│   │   ├── diseaseEngine.js               # Rule-based disease detection (Plantix)
│   │   ├── insight48hEngine.js            # 48-hour insight computation
│   │   └── regionDetectionEngine.js       # GPS + manual region detection
│   │
│   ├── db/
│   │   ├── initDB.js                      # SQLite initialization
│   │   ├── schema.js                      # Database schema definitions
│   │   ├── migrations.js                  # Database migrations
│   │   └── queries/
│   │       ├── cropQueries.js
│   │       ├── soilQueries.js
│   │       ├── diseaseQueries.js
│   │       ├── insightQueries.js
│   │       └── userQueries.js
│   │
│   ├── localization/
│   │   ├── i18n.js                        # i18next configuration
│   │   ├── en.json                        # English translations
│   │   ├── hi.json                        # Hindi translations
│   │   └── mr.json                        # Marathi translations
│   │
│   ├── data/
│   │   ├── preloadData.js                 # Data preloading logic
│   │   └── seedData.js                    # Initial data seeding
│   │
│   ├── utils/
│   │   ├── constants.js                   # App constants
│   │   ├── validators.js                  # Input validation
│   │   ├── imageProcessor.js              # Offline image analysis
│   │   └── helpers.js                     # Utility functions
│   │
│   ├── hooks/
│   │   ├── useOfflineStatus.js            # Offline connectivity hook
│   │   ├── useLanguage.js                 # Language management hook
│   │   └── useSettings.js                 # Settings management hook
│   │
│   ├── store/
│   │   └── appStore.js                    # Zustand state management
│   │
│   └── App.jsx                            # Root component
│
├── data/
│   ├── crops.json                         # Crop database (50+ crops)
│   ├── soils.json                         # Soil types & properties
│   ├── crop_soil_map.json                 # Region + crop → soil mapping
│   ├── regions.json                       # State/District/Village hierarchy
│   ├── diseases.json                      # Disease rules & signatures
│   ├── disease_symptoms.json              # Symptom-to-disease mapping
│   ├── fertilizer_rules.json              # Fertilizer advisory rules
│   ├── irrigation_rules.json              # Irrigation advisory rules
│   └── weather_snapshots.json             # Sample weather data
│
├── docs/
│   ├── OFFLINE_ARCHITECTURE.md            # Architecture documentation
│   ├── DISEASE_ENGINE.md                  # Disease detection logic
│   ├── SYNC_PROTOCOL.md                   # Future sync protocol (optional)
│   └── LANGUAGE_DESIGN.md                 # Localization guide
│
├── public/
│   ├── index.html
│   └── assets/
│       ├── icons/                         # App icons
│       └── images/                        # Placeholder images
│
├── app.json                               # Expo configuration
├── package.json
├── .gitignore
└── README.md
```

## Key Features Implementation

### 1. Disease Detection Engine (Plantix Clone - Rule-Based)

**File**: `src/engines/diseaseEngine.js`

**Approach**: 100% rule-based, no ML required

- **Image Analysis**: Extract visual features using Canvas API (color patterns, spot density, lesion shapes)
- **Symptom Matching**: Match extracted features against pre-defined disease signatures
- **Questionnaire Fallback**: If no image, use symptom-based questionnaire
- **Confidence Scoring**: Transparent scoring based on matched symptoms

**Key Methods**:

- `detectFromImage(imageData, cropName)` - Analyze uploaded image
- `detectViaQuestionnaire(responses, cropName)` - Symptom-based detection
- `extractVisualFeatures(imageData)` - Offline image processing
- `scoreMatch(features, diseaseRules)` - Rule-based matching
- `getTreatmentAdvice(diseaseId, cropName, language)` - Localized advice

**Disease Rules Structure**:

```javascript
{
  rice: {
    blast: {
      visualFeatures: ['gray_lesions', 'spindle_shape', 'leaf_spots'],
      symptoms: ['leaf_spots', 'gray_lesions'],
      confidence: 0.85,
      treatmentKey: 'rice_blast_treatment'
    },
    brownSpot: {
      visualFeatures: ['circular_brown_spots', 'target_pattern'],
      symptoms: ['brown_spots', 'target_pattern'],
      confidence: 0.75,
      treatmentKey: 'rice_brown_spot_treatment'
    }
  }
  // ... more crops and diseases
}
```

### 2. 48-Hour Insight Engine

**File**: `src/engines/insight48hEngine.js`

**Logic**: Local computation using stored weather snapshot + soil + crop stage

- Fetch last weather snapshot from local DB
- Calculate crop growth stage from sowing date
- Apply rule-based logic for irrigation, pest alerts, fertilizer timing
- Generate actionable insights in user's language
- Cache insights for 24 hours

**Insight Types**:

- Irrigation timing ("Irrigate within next 24 hours")
- Pest alerts ("High pest risk in next 48 hours")
- Fertilizer recommendations ("Apply nitrogen fertilizer")
- Harvest readiness ("Crop ready for harvest in 7-10 days")
- Weather warnings ("Rain expected, do NOT irrigate")

### 3. Database Schema (SQLite)

**File**: `src/db/schema.js`

**Tables**:

- `user_profile` - User settings, language, region
- `crops` - Registered crops with sowing dates, growth stages
- `soil_info` - Soil type mappings per region
- `disease_log` - Disease detection history
- `insights_cache` - Cached 48-hour insights
- `weather_snapshots` - Last known weather data
- `region_data` - State/District/Village hierarchy

### 4. Localization System

**Files**: `src/localization/en.json`, `hi.json`, `mr.json`

**Features**:

- All UI strings externalized
- Language switching works offline
- Disease names, advice, and insights translated
- Simple sentences for semi-literate users

### 5. Region Detection

**File**: `src/engines/regionDetectionEngine.js`

**Priority**:

1. GPS location (if permission granted) → offline coordinate-to-region mapping
2. Manual selection (State → District → Village dropdown)

**Offline Mapping**: Pre-loaded bounding boxes for coordinate-to-region conversion

### 6. Settings Module

**File**: `src/screens/SettingsScreen.jsx`

**Sections**:

1. Account Profile (name, language, region, crops)
2. Appearance (theme, font size, high contrast)
3. UI & Accessibility (simple/advanced mode, haptic feedback)
4. Offline Data (last update, recompute advice, clear cache)
5. Alerts & Reminders
6. Region & Location (auto-detect/manual)
7. Privacy & Security (optional PIN lock)
8. Help & Support (offline)
9. About AgriSync

All settings persist locally using AsyncStorage + SQLite.

## Implementation Phases

### Phase 1: Foundation

1. Initialize Expo project with web support
2. Set up SQLite database with schema
3. Implement localization system (i18next)
4. Create basic navigation structure
5. Set up state management (Zustand)

### Phase 2: Core Features

1. Crop registration & management
2. Soil information engine
3. Region detection (GPS + manual)
4. Basic advisory engine
5. Settings screen with persistence

### Phase 3: Disease Detection (Plantix Feature)

1. Image upload component
2. Rule-based disease detection engine
3. Symptom questionnaire fallback
4. Disease result display with treatment advice
5. Disease detection history

### Phase 4: 48-Hour Insights

1. Weather snapshot storage
2. Insight computation engine
3. Insight display screen
4. Daily recalculation logic
5. Alert notifications

### Phase 5: UI/UX Polish

1. Icon-heavy footer navigation
2. High contrast mode
3. Large font support
4. Offline indicator
5. Accessibility improvements

### Phase 6: Data Preloading

1. Seed crops database
2. Seed soils database
3. Seed disease rules
4. Seed region hierarchy
5. Seed fertilizer/irrigation rules

## Code Quality Standards

1. **Comments**: Every function must have JSDoc comments explaining:

   - Purpose
   - Parameters
   - Return values
   - Offline behavior
   - Edge cases

2. **No Hardcoded Strings**: All text via i18next

3. **Error Handling**: Graceful degradation when offline

4. **Modularity**: Each engine is independent and testable

5. **Readability**: Clear variable names, consistent formatting

## Deployment

**Expo Web Configuration**:

```json
{
  "expo": {
    "name": "AgriSync",
    "slug": "agrisync",
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-sqlite"
    ]
  }
}
```

**Build Commands**:

- Development: `npx expo start --web`
- Production: `npx expo export --platform web`

## Key Files to Implement

1. [src/engines/diseaseEngine.js](src/engines/diseaseEngine.js) - Rule-based disease detection
2. [src/engines/insight48hEngine.js](src/engines/insight48hEngine.js) - 48-hour insight computation
3. [src/db/schema.js](src/db/schema.js) - Database schema
4. [src/screens/DiseaseScreen.jsx](src/screens/DiseaseScreen.jsx) - Disease detection UI
5. [src/components/DiseaseDetector/DiseaseDetector.jsx](src/components/DiseaseDetector/DiseaseDetector.jsx) - Image upload & processing
6. [src/localization/en.json](src/localization/en.json) - English translations
7. [src/localization/hi.json](src/localization/hi.json) - Hindi translations
8. [src/localization/mr.json](src/localization/mr.json) - Marathi translations

## Success Criteria

- ✅ App works completely offline (no internet required)
- ✅ Disease detection works via image analysis (rule-based)
- ✅ 48-hour insights generated locally
- ✅ Multi-language support (en, hi, mr) with offline switching
- ✅ All settings persist after app restart
- ✅ Region detection works offline (GPS + manual)
- ✅ Code is well-commented and readable
- ✅ Web app deployable via Expo Web
- ✅ Accessible UI (large fonts, high contrast, icon-heavy)