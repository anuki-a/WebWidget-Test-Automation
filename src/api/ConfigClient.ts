import { ApiClient } from './apiClient';

/**
 * Interface for widget configuration data.
 */
export interface WidgetConfig {
  isEnabled: boolean;
  allowOnlineApplication: boolean;
  requireSpanishSpeaker: boolean;
  enableStaffSelection: boolean;
  meetingPreferenceMode: 'single' | 'multiple' | 'none';
  validationRules: {
    emailRequired: boolean;
    phoneRequired: boolean;
    emailFormat: string;
    phoneFormat: string;
  };
  skipBehavior: {
    enabled: boolean;
    redirectUrl?: string;
  };
  checklist: {
    enabled: boolean;
    items: string[];
  };
}

/**
 * Interface for meeting preference configuration.
 */
export interface MeetingPreferenceConfig {
  mode: 'single' | 'multiple' | 'none';
  options: {
    inPerson: boolean;
    virtual: boolean;
    phone: boolean;
  };
  validationRequired: boolean;
}

/**
 * Client for configuration API operations including widget settings and meeting preferences.
 * Extends the base ApiClient with domain-specific methods for test configuration.
 */
export class ConfigClient extends ApiClient {
  /**
   * Get client configuration.
   * @param clientId - The client ID
   * @returns Promise resolving to client configuration
   */
  async getClientConfig(clientId: number = 1): Promise<any> {
    return this.get('/api/v1/client/config', {
      clientId,
    });
  }

  /**
   * Enable the appointment widget.
   * @param clientId - The client ID
   * @param widgetCode - Widget code/identifier
   * @returns Promise resolving to the enable result
   */
  async enableWidget(clientId: number = 1, widgetCode: string): Promise<any> {
    return this.post('/api/v1/widget/enable', {
      clientId,
      widgetCode,
      isEnabled: true,
    });
  }

  /**
   * Configure meeting preferences for the widget.
   * @param config - Meeting preference configuration
   * @returns Promise resolving to the configuration result
   */
  async configureMeetingPreferences(config: MeetingPreferenceConfig): Promise<any> {
    return this.post('/api/v1/config/meetingPreferences', config);
  }

  /**
   * Configure validation rules for the widget.
   * @param validationRules - Validation rules configuration
   * @returns Promise resolving to the configuration result
   */
  async configureValidationRules(validationRules: WidgetConfig['validationRules']): Promise<any> {
    return this.post('/api/v1/config/validationRules', validationRules);
  }

  /**
   * Configure skip behavior for the widget.
   * @param skipConfig - Skip behavior configuration
   * @returns Promise resolving to the configuration result
   */
  async configureSkipBehavior(skipConfig: WidgetConfig['skipBehavior']): Promise<any> {
    return this.post('/api/v1/config/skipBehavior', skipConfig);
  }

  /**
   * Configure checklist for the widget.
   * @param checklistConfig - Checklist configuration
   * @returns Promise resolving to the configuration result
   */
  async configureChecklist(checklistConfig: WidgetConfig['checklist']): Promise<any> {
    return this.post('/api/v1/config/checklist', checklistConfig);
  }

  /**
   * Configure Spanish speaker requirement.
   * @param requireSpanishSpeaker - Whether Spanish speaker is required
   * @returns Promise resolving to the configuration result
   */
  async configureSpanishSpeaker(requireSpanishSpeaker: boolean): Promise<any> {
    return this.post('/api/v1/config/spanishSpeaker', {
      requireSpanishSpeaker,
    });
  }

  /**
   * Enable manual staff selection.
   * @param enableStaffSelection - Whether manual staff selection is enabled
   * @returns Promise resolving to the configuration result
   */
  async enableManualStaffSelection(enableStaffSelection: boolean): Promise<any> {
    return this.post('/api/v1/config/staffSelection', {
      enableStaffSelection,
    });
  }

  /**
   * Apply complete widget configuration.
   * @param config - Complete widget configuration
   * @returns Promise resolving to the configuration result
   */
  async applyWidgetConfig(config: WidgetConfig): Promise<any> {
    return this.post('/api/v1/config/widget', config);
  }

  /**
   * Get widget display text for localization.
   * @param clientId - The client ID
   * @returns Promise resolving to display text configuration
   */
  async getWidgetDisplayText(clientId: number = 1): Promise<any> {
    return this.get('/api/System/WidgetDisplayText', {
      clientId,
    });
  }

  /**
   * Validate widget URL parameters.
   * @param params - URL parameters to validate
   * @returns Promise resolving to validation result
   */
  async validateWidgetParams(params: {
    categoryCode: string;
    serviceCode: string;
    locationCode: string;
    userCode: string;
    isolatedLocationRequested: boolean;
  }): Promise<any> {
    return this.get('/api/v1/widgetUrlParamsValid/serviceCatCode/{categoryCode}/serviceCode/{serviceCode}/locationCode/{locationCode}/userCode/{userCode}/isolatedLocationRequested/{isolatedLocationRequested}', params);
  }

  /**
   * Static factory method to create a ConfigClient instance.
   * @param baseUrl - The base URL for API requests
   * @param options - Optional configuration for request context
   * @returns Promise resolving to ConfigClient instance
   */
  static override async create(baseUrl: string, options?: { extraHTTPHeaders?: Record<string, string> }): Promise<ConfigClient> {
    const client = await ApiClient.create(baseUrl, options) as ConfigClient;
    return client;
  }
}
