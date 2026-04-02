import { test as base } from '@playwright/test';
import { BookingData, ServiceData, SpanishTranslationsOfPages } from '../types/bookingTypes';
import { TestDataBuilder } from '../utils/testDataBuilder';
import { DateUtils } from '../utils/dateUtils';
import { MeetingPreference } from '@/pages/MeetingPreferencePage';
import { SPANISH_TRANSLATIONS } from '../data/spanishTranslations';

export const test = base.extend<{ 
  bookingData: BookingData;
  cancelPathBookingData: BookingData;
  editBookingData: BookingData;
  secondBookingData: BookingData;
  secondServiceData: ServiceData;
  notAllowedEditCancelData: BookingData;
  skipEnabledBookingData: BookingData;
  personalDetailsMandatory: BookingData;
  multipleMPBookingData: BookingData;
  pastDateBookingData: BookingData;
  notaryServiceBookingData: BookingData;
  singleMeetingPreferenceBookingData: BookingData;
  spanishTranslationsBookingData: BookingData;
  fullHodidayHandlingData: BookingData;
  spanishTranslationsOfPages: SpanishTranslationsOfPages; 
}>({
  bookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const today = DateUtils.getToday();
    const formattedDate = DateUtils.formatDateForUI(today);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

        const rawName1 = 'Estate Accounts  75 Mins';
    const cleanName1 = "Estate Accounts";

    // Create complete booking data
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: today,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

        const data2: BookingData = {
      service: {
        category: 'Estate Accounts',
        name: rawName1,
        displayName: cleanName1,
        duration: 75
      },
      location: {
        code: '75002',
        name: 'Allen 404 E Stacy Rd. Allen,',
        confirmationName: 'Allen'
      },
      dateTime: {
        date: today,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };
    await use(data);
  },

  cancelPathBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const nextBusinessDay = DateUtils.addBusinessDays(DateUtils.getToday(), 1)
    const formattedDate = DateUtils.formatDateForUI(nextBusinessDay);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create complete booking data for cancellation path (copy of bookingData)
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: nextBusinessDay,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },

  editBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder for edit scenario
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data for edit scenario (use today to ensure availability)
    const today = DateUtils.getToday();
    const formattedDate = DateUtils.formatDateForUI(today);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create booking data specifically for edit scenario
    // Using different location to avoid conflicts with other fixtures
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: today,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM', // Original time for edit scenario
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },

  secondBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder (same customer for consistency in Book Another flow)
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data for second booking (tomorrow)
    const tomorrow = DateUtils.addBusinessDays(DateUtils.getToday(), 1);
    const formattedDate = DateUtils.formatDateForUI(tomorrow);

    // Create booking data for second booking (OAC-20005 Book Another scenario)
     const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create booking data specifically for edit scenario
    // Using different location to avoid conflicts with other fixtures
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: tomorrow,
        formattedDate: formattedDate.fullDateString,
        time: '2:00 PM', // Different time from first booking
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },

  secondServiceData: async ({}, use: (data: ServiceData) => Promise<void>) => {
    // Service data for second booking in Book Another flow
    const data: ServiceData = {
      category: 'Estate Accounts',
      name: 'Estate Accounts  75 Mins',
      displayName: 'Estate Accounts',
      duration: 75
    };

    await use(data);
  },

  notAllowedEditCancelData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder (same customer for consistency in Book Another flow)
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data for second booking (tomorrow)
    const tomorrow = DateUtils.addBusinessDays(DateUtils.getToday(), 1);
    const formattedDate = DateUtils.formatDateForUI(tomorrow);

    // Create booking data for second booking (OAC-20005 Book Another scenario)
     const rawName = 'IRA (Individual Retirement Account)';
    //const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create booking data specifically for edit scenario
    // Using different location to avoid conflicts with other fixtures
    const data: BookingData = {
      service: {
        category: 'Speak with a Department',
        name: rawName,
        displayName: rawName,
        duration: 45
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: tomorrow,
        formattedDate: formattedDate.fullDateString,
        time: '2:00 PM', // Different time from first booking
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },

  skipEnabledBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder for edit scenario
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data for edit scenario (use today to ensure availability)
    const today = DateUtils.getToday();
    const formattedDate = DateUtils.formatDateForUI(today);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create booking data specifically for edit scenario
    // Using different location to avoid conflicts with other fixtures
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: today,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM', // Original time for edit scenario
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },

  personalDetailsMandatory: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder for edit scenario
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data for edit scenario (use today to ensure availability)
    const tomorrow = DateUtils.addBusinessDays(DateUtils.getToday(), 1);
    const formattedDate = DateUtils.formatDateForUI(tomorrow);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create booking data specifically for edit scenario
    // Using different location to avoid conflicts with other fixtures
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: tomorrow,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM', // Original time for edit scenario
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },
  
  multipleMPBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const nextBusinessDay = DateUtils.addBusinessDays(DateUtils.getToday(), 1)
    const formattedDate = DateUtils.formatDateForUI(nextBusinessDay);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create complete booking data for cancellation path (copy of bookingData)
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: nextBusinessDay,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },

  pastDateBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const nextBusinessDay = DateUtils.addBusinessDays(DateUtils.getToday(), 1)
    const formattedDate = DateUtils.formatDateForUI(nextBusinessDay);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create complete booking data for cancellation path (copy of bookingData)
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: nextBusinessDay,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },


  singleMeetingPreferenceBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const nextBusinessDay = DateUtils.addBusinessDays(DateUtils.getToday(), 1)
    const formattedDate = DateUtils.formatDateForUI(nextBusinessDay);
    
    const rawName = 'Notary  30 Mins Notary';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create complete booking data for cancellation path (copy of bookingData)
    const data: BookingData = {
      service: {
        category: 'Notary and Medallion Services',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '78154',
        name: 'Northcliffe 22015 N IH 35',
        confirmationName: 'Northcliffe'
      },
      dateTime: {
        date: nextBusinessDay,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        notes: 'important note for booking'
      },
      meetingPreference: {
        type: 'in-person', //in-person, phone, virtual
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },


  spanishTranslationsBookingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const nextBusinessDay = DateUtils.addBusinessDays(DateUtils.getToday(), 1)
    const formattedDate = DateUtils.formatDateForUI(nextBusinessDay);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create complete booking data for cancellation path (copy of bookingData)
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: nextBusinessDay,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },

  //add new fixture for spanish translations
  spanishTranslationsOfPages: async ({}, use: (data: SpanishTranslationsOfPages) => Promise<void>) => {
    const data: SpanishTranslationsOfPages = {
      // Navigation Bar
      serviceSelection: {
        english: 'Service',
        spanish: SPANISH_TRANSLATIONS.NAVIGATION.SERVICE
      },
      location: {
        english: 'Location',
        spanish: SPANISH_TRANSLATIONS.NAVIGATION.LOCATION
      },
      meetingPreference: {
        english: 'Meeting Preference',
        spanish: SPANISH_TRANSLATIONS.NAVIGATION.MEETING_PREFERENCE
      },
      dateTime: {
        english: 'Date & Time',
        spanish: SPANISH_TRANSLATIONS.NAVIGATION.DATE_TIME
      },
      personalDetails: {
        english: 'Personal Details',
        spanish: SPANISH_TRANSLATIONS.NAVIGATION.PERSONAL_DETAILS
      },
      confirmation: {
        english: 'Confirmation',
        spanish: SPANISH_TRANSLATIONS.NAVIGATION.CONFIRMATION
      },

      // Service Page
      serviceSelectionHeader: {
        english: 'Select a Service',
        spanish: SPANISH_TRANSLATIONS.SERVICE_PAGE.HEADER
      },
      userInsertedTranslation: {
        english: 'User Inserted Translation',
        spanish: 'Traducción Insertada por el Usuario'
      },
      skipAppointmentDialog: {
        english: 'Good News! You can apply online now, skipping the wait',
        spanish: SPANISH_TRANSLATIONS.SERVICE_PAGE.SKIP_APPOINTMENT_DIALOG
      },
      continueSchedulingButton: {
        english: 'No, continue with scheduling an appointment',
        spanish: SPANISH_TRANSLATIONS.SERVICE_PAGE.CONTINUE_SCHEDULING_BUTTON
      },
      skipWaitButton: {
        english: 'Yes, skip the wait',
        spanish: SPANISH_TRANSLATIONS.SERVICE_PAGE.SKIP_WAIT_BUTTON
      },

      // Location Page
      selectLocation: {
        english: 'Select a Location',
        spanish: SPANISH_TRANSLATIONS.LOCATION_PAGE.HEADER
      },
      searchLocationPlaceholder: {
        english: 'Enter city and state, or postal code',
        spanish: SPANISH_TRANSLATIONS.LOCATION_PAGE.SEARCH_PLACEHOLDER
      },
      locationsDropdown: {
        english: 'Locations',
        spanish: SPANISH_TRANSLATIONS.LOCATION_PAGE.LOCATIONS_DROPDOWN
      },

      // Meeting Preference Page
      meetingPreferenceHeader: {
        english: 'Select a Meeting Preference',
        spanish: SPANISH_TRANSLATIONS.MEETING_PREFERENCE_PAGE.HEADER
      },
      inPersonOption: {
        english: 'Meet in Person',
        spanish: SPANISH_TRANSLATIONS.MEETING_PREFERENCE_PAGE.IN_PERSON
      },
      virtualOption: {
        english: 'Virtual',
        spanish: SPANISH_TRANSLATIONS.MEETING_PREFERENCE_PAGE.VIRTUAL
      },
      phoneCallOption: {
        english: 'Meet via Phone Call',
        spanish: SPANISH_TRANSLATIONS.MEETING_PREFERENCE_PAGE.PHONE_CALL
      },

      // Date & Time Page
      dateTimeHeader: {
        english: 'Select a Date and Time',
        spanish: SPANISH_TRANSLATIONS.DATE_TIME_PAGE.HEADER
      },

      // Personal Details Page
      personalDetailsHeader: {
        english: 'Personal Details',
        spanish: SPANISH_TRANSLATIONS.PERSONAL_DETAILS_PAGE.HEADER
      },
      firstNameLabel: {
        english: 'First Name *',
        spanish: SPANISH_TRANSLATIONS.PERSONAL_DETAILS_PAGE.FIRST_NAME_LABEL
      },
      lastNameLabel: {
        english: 'Last Name *',
        spanish: SPANISH_TRANSLATIONS.PERSONAL_DETAILS_PAGE.LAST_NAME_LABEL
      },
      emailLabel: {
        english: 'Email *',
        spanish: SPANISH_TRANSLATIONS.PERSONAL_DETAILS_PAGE.EMAIL_LABEL
      },
      phoneLabel: {
        english: 'Phone Number *',
        spanish: SPANISH_TRANSLATIONS.PERSONAL_DETAILS_PAGE.PHONE_LABEL
      },
      notesLabel: {
        english: 'Please provide additional details:',
        spanish: SPANISH_TRANSLATIONS.PERSONAL_DETAILS_PAGE.NOTES_LABEL
      },
      bookAppointmentButton: {
        english: 'Book my appointment',
        spanish: SPANISH_TRANSLATIONS.PERSONAL_DETAILS_PAGE.BOOK_APPOINTMENT_BUTTON
      },

      // Confirmation Page
      confirmationHeader: {
        english: 'Your appointment has been scheduled',
        spanish: SPANISH_TRANSLATIONS.CONFIRMATION_PAGE.HEADER
      },

      // Footer
      footer: {
        english: 'Powered by FMSI',
        spanish: SPANISH_TRANSLATIONS.FOOTER
      },

      // Language Selector
      languageOption: {
        english: 'Spanish',
        spanish: SPANISH_TRANSLATIONS.LANGUAGE_OPTION
      },

      // Date formatting (Spanish months)
      spanishMonths: SPANISH_TRANSLATIONS.SPANISH_MONTHS
    };

    await use(data);
  },


  fullHodidayHandlingData: async ({}, use: (data: BookingData) => Promise<void>) => {
    // Generate customer data using TestDataBuilder
    const customer = TestDataBuilder.generateCustomer();
    
    // Generate date/time data
    const nextBusinessDay = DateUtils.addBusinessDays(DateUtils.getToday(), 3)
    const formattedDate = DateUtils.formatDateForUI(nextBusinessDay);
    
    const rawName = 'Update Personal Account  60';
    const cleanName = rawName.replace(/\s?[^\w\s].*$/, '').trim();

    // Create complete booking data for cancellation path (copy of bookingData)
    const data: BookingData = {
      service: {
        category: 'Personal Accounts',
        name: rawName,
        displayName: cleanName,
        duration: 60
      },
      location: {
        code: '75071',
        name: 'McKinney 2093 N. Central',
        confirmationName: 'McKinney'
      },
      dateTime: {
        date: nextBusinessDay,
        formattedDate: formattedDate.fullDateString,
        time: '10:00 AM',
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      },
      meetingPreference: {
        type: 'in-person',
        displayName: MeetingPreference.IN_PERSON
      }
    };

    await use(data);
  },
});
