/**
 * Centralized Spanish translations for the Web Widget application.
 * This file contains all Spanish text strings used across the application.
 */

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
    CONTINUE_SCHEDULING_BUTTON: 'No, continuar con la planificación de una cita',
    SKIP_WAIT_BUTTON: 'Sí, omitir la espera'
  },

  // Location Page
  LOCATION_PAGE: {
    HEADER: 'Escoge un lugar',
    SEARCH_PLACEHOLDER: 'Ingrese ciudad y estado, o código postal',
    LOCATIONS_DROPDOWN: 'Sitios'
  },

  // Meeting Preference Page
  MEETING_PREFERENCE_PAGE: {
    HEADER: 'Elija una preferencia de reunión',
    IN_PERSON: 'Conocer en persona',
    VIRTUAL: 'Virtual',
    PHONE_CALL: 'Reunirse a través de una llamada telefónica'
  },

  // Date & Time Page
  DATE_TIME_PAGE: {
    HEADER: 'Elige una fecha y hora'
  },

  // Personal Details Page
  PERSONAL_DETAILS_PAGE: {
    HEADER: 'Detalles personales',
    FIRST_NAME_LABEL: 'Primer Nombre *',
    LAST_NAME_LABEL: 'Apellido *',
    EMAIL_LABEL: 'Correo electrónico *',
    PHONE_LABEL: 'Número de teléfono *',
    NOTES_LABEL: 'Por favor proporcione detalles adicionales:',
    BOOK_APPOINTMENT_BUTTON: 'Reservar mi cita'
  },

  // Confirmation Page
  CONFIRMATION_PAGE: {
    HEADER: 'tu cita ha sido programada'
  },

  // Footer
  FOOTER: 'Desarrollado por FMSI',

  // Language Selector
  LANGUAGE_OPTION: 'Español',

  // Date formatting - Spanish months
  SPANISH_MONTHS: {
    'January': 'ene.',
    'February': 'feb.',
    'March': 'mar.',
    'April': 'abr.',
    'May': 'may.',
    'June': 'jun.',
    'July': 'jul.',
    'August': 'ago.',
    'September': 'sep.',
    'October': 'oct.',
    'November': 'nov.',
    'December': 'dic.'
  },

  // Spanish weekdays (for date formatting)
  SPANISH_WEEKDAYS: {
    'Sunday': 'domingo',
    'Monday': 'lunes',
    'Tuesday': 'martes',
    'Wednesday': 'miércoles',
    'Thursday': 'jueves',
    'Friday': 'viernes',
    'Saturday': 'sábado'
  }
} as const;

/**
 * Type definition for Spanish translations object.
 */
export type SpanishTranslations = typeof SPANISH_TRANSLATIONS;

/**
 * Helper function to get a specific translation.
 * @param key - The translation key in dot notation (e.g., 'NAVIGATION.SERVICE')
 * @returns The Spanish translation string
 */
export function getTranslation(key: string): string {
  const keys = key.split('.');
  let value: any = SPANISH_TRANSLATIONS;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  return value as string;
}

/**
 * Get all navigation translations.
 * @returns Navigation translations object
 */
export function getNavigationTranslations() {
  return SPANISH_TRANSLATIONS.NAVIGATION;
}

/**
 * Get all Spanish month translations.
 * @returns Spanish months object
 */
export function getSpanishMonths() {
  return SPANISH_TRANSLATIONS.SPANISH_MONTHS;
}

/**
 * Get all Spanish weekday translations.
 * @returns Spanish weekdays object
 */
export function getSpanishWeekdays() {
  return SPANISH_TRANSLATIONS.SPANISH_WEEKDAYS;
}
