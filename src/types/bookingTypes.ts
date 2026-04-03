import { CustomerData } from '../utils/testDataBuilder';

/**
 * Complete booking data for appointment booking tests.
 * Contains all data needed for end-to-end booking verification.
 */
export interface BookingData {
  service: ServiceData;
  location: LocationData;
  customer: CustomerData;
  meetingPreference: MeetingPreference;
  dateTime: DateTimeData;
}

/**
 * Complete booking data for appointment booking tests.
 * Contains all data needed for end-to-end booking verification.
 */
export interface PartialHolidayBookingData {
  service: ServiceData;
  location: LocationData;
  customer: CustomerData;
  meetingPreference: MeetingPreference;
  partialHolidayDateTime: PartialHolidayDateTimeData;
}

/**
 * Service selection data.
 */
export interface ServiceData {
  category: string;
  name: string;
  displayName?: string;
  duration?: number;
}

/**
 * Location selection data.
 */
export interface LocationData {
  code: string;
  name: string;
  confirmationName?: string;
}

/**
 * Meeting preference selection data.
 */
export interface MeetingPreference {
  type: string;
  displayName: string;
}

/**
 * Date and time selection data.
 */
export interface DateTimeData {
  date: Date;
  formattedDate: string;
  time: string;
}

/**
 * Date and time selection data for partial holiday.
 */
export interface PartialHolidayDateTimeData {
  date: Date;
  formattedDate: string;
  startTime:string;
  endTime:string;
}

/**
 * Spanish translations for navigation bar and page elements.
 */
export interface SpanishTranslationsOfPages {
  // Navigation Bar
  serviceSelection: {
    english: string;
    spanish: string;
  };
  location: {
    english: string;
    spanish: string;
  };
  meetingPreference: {
    english: string;
    spanish: string;
  };
  dateTime: {
    english: string;
    spanish: string;
  };
  personalDetails: {
    english: string;
    spanish: string;
  };
  confirmation: {
    english: string;
    spanish: string;
  };

  // Service Page
  serviceSelectionHeader: {
    english: string;
    spanish: string;
  };
  userInsertedTranslation: {
    english: string;
    spanish: string;
  };
  skipAppointmentDialog: {
    english: string;
    spanish: string;
  };
  continueSchedulingButton: {
    english: string;
    spanish: string;
  };
  skipWaitButton: {
    english: string;
    spanish: string;
  };

  // Location Page
  selectLocation: {
    english: string;
    spanish: string;
  };
  searchLocationPlaceholder: {
    english: string;
    spanish: string;
  };
  locationsDropdown: {
    english: string;
    spanish: string;
  };

  // Meeting Preference Page
  meetingPreferenceHeader: {
    english: string;
    spanish: string;
  };
  inPersonOption: {
    english: string;
    spanish: string;
  };
  virtualOption: {
    english: string;
    spanish: string;
  };
  phoneCallOption: {
    english: string;
    spanish: string;
  };

  // Date & Time Page
  dateTimeHeader: {
    english: string;
    spanish: string;
  };

  // Personal Details Page
  personalDetailsHeader: {
    english: string;
    spanish: string;
  };
  firstNameLabel: {
    english: string;
    spanish: string;
  };
  lastNameLabel: {
    english: string;
    spanish: string;
  };
  emailLabel: {
    english: string;
    spanish: string;
  };
  phoneLabel: {
    english: string;
    spanish: string;
  };
  notesLabel: {
    english: string;
    spanish: string;
  };
  bookAppointmentButton: {
    english: string;
    spanish: string;
  };

  // Confirmation Page
  confirmationHeader: {
    english: string;
    spanish: string;
  };

  // Footer
  footer: {
    english: string;
    spanish: string;
  };

  // Language Selector
  languageOption: {
    english: string;
    spanish: string;
  };

  // Date formatting (Spanish months)
  spanishMonths: {
    [key: string]: string;
  };
}

