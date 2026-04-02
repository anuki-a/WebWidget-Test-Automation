# Spanish Translations Guide

This document explains the structure and usage of Spanish translations in the Web Widget Test Automation project.

## Overview

All Spanish text strings used in the application are now centralized in a single location for better maintainability and consistency.

## File Structure

### 1. Central Translations File
**Location**: `src/data/spanishTranslations.ts`

This file contains all Spanish translations organized by page/component:

```typescript
export const SPANISH_TRANSLATIONS = {
  // Navigation Bar
  NAVIGATION: {
    SERVICE: 'Servicio',
    LOCATION: 'Sitio',
    MEETING_PREFERENCE: 'Preferencia de reunión',
    DATE_TIME: 'Fecha y hora',
    PERSONAL_DETAILS: 'Detalles personales',
    CONFIRMATION: 'Confirmación'
  },
  
  // Service Page
  SERVICE_PAGE: {
    HEADER: 'Elige un servicio',
    SKIP_APPOINTMENT_DIALOG: '¡Buenas Noticias! Usted puede aplicar en linea ahora, saltando la espera',
    // ... more translations
  },
  
  // ... other page translations
}
```

### 2. TypeScript Interface
**Location**: `src/types/bookingTypes.ts`

The `SpanishTranslationsOfPages` interface defines the structure for translations used in fixtures and tests.

### 3. Fixture Integration
**Location**: `src/fixtures/bookingFixture.ts`

The `spanishTranslationsOfPages` fixture provides translations to tests using the centralized constants.

## Usage in Tests

### Using the Fixture

```typescript
import { test as bookingTest } from '../../src/fixtures/bookingFixture';

bookingTest('should verify Spanish translations', async ({ 
  spanishTranslationsOfPages 
}) => {
  // Access translations
  const serviceLabel = spanishTranslationsOfPages.serviceSelection.spanish; // 'Servicio'
  const locationLabel = spanishTranslationsOfPages.location.spanish; // 'Sitio'
  
  // Use in assertions
  await expect(page.getByRole('link', { name: serviceLabel })).toBeVisible();
});
```

### Using Direct Imports

```typescript
import { SPANISH_TRANSLATIONS, getTranslation } from '../data/spanishTranslations';

// Access specific translation
const serviceHeader = SPANISH_TRANSLATIONS.SERVICE_PAGE.HEADER;

// Use helper function
const navigationLabel = getTranslation('NAVIGATION.SERVICE');
```

## Translation Categories

### 1. Navigation Bar
- Service, Location, Meeting Preference, Date & Time, Personal Details, Confirmation

### 2. Service Page
- Page header, skip appointment dialog, dialog buttons

### 3. Location Page
- Page header, search placeholder, dropdown labels

### 4. Meeting Preference Page
- Page header, meeting preference options

### 5. Date & Time Page
- Page header

### 6. Personal Details Page
- Page header, form labels, button text

### 7. Confirmation Page
- Page header

### 8. Common Elements
- Footer, language selector, date formatting

## Date Formatting

Spanish date formatting is supported with:

### Months
```typescript
SPANISH_TRANSLATIONS.SPANISH_MONTHS = {
  'January': 'ene.',
  'February': 'feb.',
  // ... etc
}
```

### Weekdays
```typescript
SPANISH_TRANSLATIONS.SPANISH_WEEKDAYS = {
  'Sunday': 'domingo',
  'Monday': 'lunes',
  // ... etc
}
```

## Helper Functions

### `getTranslation(key: string)`
Get a translation using dot notation:
```typescript
getTranslation('NAVIGATION.SERVICE') // Returns 'Servicio'
getTranslation('SERVICE_PAGE.HEADER') // Returns 'Elige un servicio'
```

### `getNavigationTranslations()`
Returns all navigation translations as an object.

### `getSpanishMonths()`
Returns Spanish month translations.

### `getSpanishWeekdays()`
Returns Spanish weekday translations.

## Adding New Translations

1. Add the translation to the appropriate section in `src/data/spanishTranslations.ts`
2. Update the `SpanishTranslationsOfPages` interface in `src/types/bookingTypes.ts` if needed
3. Update the `spanishTranslationsOfPages` fixture to include the new translation
4. Use the translation in your tests

## Best Practices

1. **Centralized Management**: All Spanish translations should be in the central file, not scattered across components
2. **Consistent Naming**: Use descriptive keys in UPPER_SNAKE_CASE
3. **Type Safety**: Always use TypeScript interfaces for translation objects
4. **Helper Functions**: Use provided helper functions for cleaner code
5. **Documentation**: Update this guide when adding new translation categories

## Migration Notes

Previously, Spanish translations were scattered across:
- Individual page components
- Language switcher component
- Test files

All translations have been consolidated into the central file for:
- Better maintainability
- Single source of truth
- Easier updates and modifications
- Consistent usage across tests

## Testing

The Spanish translations are tested in:
- `tests/widget/OAC-20017_SpanishTranslations.spec.ts`

This test verifies that all Spanish translations are properly displayed in the widget when Spanish language is selected.
