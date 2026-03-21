\# OAC API Developer Reference



Generated on: 2026-03-17T14:34:09.8285042+05:30



\## Summary



\- Controllers: 34

\- Endpoints: 282



\## Controller: OidcConfigurationController



\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPGET api/OidcConfiguration/\\\_configuration/{clientId}



\- Action: GetClientRequestParameters

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - clientId : string (query/path) \[\[FromRoute]]



\---



\## Controller: BaseEventController



\- Base route: api/v1



\### HTTPGET api/v1/event/{eventCode}/eventType



\- Action: GetEventTypeIdByEventCode

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - eventCode : string (query/path) \[\[FromRoute]]



\---



\## Controller: AppointmentsController



\- Base route: api/v1



\### HTTPGET api/v1/appointment/{confirmationNumber}



\- Action: GetAppointment

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - confirmationNumber : string (query/path)



\### HTTPPUT api/v1/appointment/{confirmationNumber}/status/{status}



\- Action: UpdateAppointmentStatus

\- Return: IActionResult

\- Auth: None

\- Request body:

&#x20; - confirmationNumber : string

&#x20; - status : AppointmentStatus

&#x20; - null : UpdateAppointmentStatusDto appointmentStatusDto = \[\[FromBody]]



\### HTTPPOST api/v1/appointment



\- Action: CreateAppointment

\- Return: IActionResult

\- Auth: None

\- Request body:

&#x20; - newAppointment : AppointmentDataDto \[\[FromBody]]

&#x20; - true : bool allowOverlappedAppts = \[\[FromQuery]]



\### HTTPPUT api/v1/appointment/{confirmationNumber}



\- Action: EditAppointment

\- Return: IActionResult

\- Auth: None

\- Request body:

&#x20; - confirmationNumber : string

&#x20; - appointment : AppointmentDataDto \[\[FromBody]]

&#x20; - true : bool allowOverlappedAppts = \[\[FromQuery]]



\---



\## Controller: SystemController



\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPGET api/System/CheckCalendarServiceConnectivityStatus



\- Action: CheckCalendarServiceConnectivityStatus

\- Return: async Task<ConnectionStatusResponse>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - adapter : CalendarSyncAdapterType (query/path)

&#x20; - authConfiguration : string (query/path)



\### HTTPGET api/System/CheckCalendarSynchronizationStatus



\- Action: CheckCalendarSynchronizationStatus

\- Return: async Task<List<SyncStatusResponse>>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - adapter : CalendarSyncAdapterType (query/path)

&#x20; - authConfiguration : string (query/path)



\### HTTPGET api/System/Metadata



\- Action: Metadata

\- Return: string

\- Auth: None



\### HTTPPOST api/System/SaveChanges



\- Action: SaveChanges

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/System/PublicLookups



\- Action: PublicLookups

\- Return: object

\- Auth: None



\### HTTPGET api/System/LanguagesLookups



\- Action: LanguagesLookups

\- Return: object

\- Auth: None



\### HTTPGET api/System/InactivityTimeout



\- Action: InactivityTimeout

\- Return: int

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/System/UserSensitiveLookups



\- Action: UserSensitiveLookups

\- Return: object

\- Auth: None



\### HTTPGET api/System/WidgetDisplayText



\- Action: WidgetDisplayText

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/System/OacClients



\- Action: OacClients

\- Return: IQueryable

\- Auth: None



\### HTTPGET api/System/UsersLimited



\- Action: UsersLimited

\- Return: IQueryable

\- Auth: None



\### HTTPGET api/System/LoggedUser



\- Action: LoggedUser

\- Return: AspNetUser

\- Auth: None



\### HTTPGET api/System/LoggedUserPermissions



\- Action: LoggedUserPermissions

\- Return: List<string>

\- Auth: None



\### HTTPGET api/System/GetUserDetails



\- Action: GetUserDetails

\- Return: AspNetUser

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/System/GetUserDetailsWithTimeZone



\- Action: GetUserDetailsWithTimeZone

\- Return: dynamic

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPPOST api/System/SaveProfileChanges



\- Action: SaveProfileChanges

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/System/GetApplicationConfigs



\- Action: GetApplicationConfigs

\- Return: ApplicationConfiguration

\- Auth: AllowAnonymous



\---



\## Controller: ScimUserController



\- Base route: api/\[controller]



\### HTTPPOST api/\[controller]/Create



\- Action: Create

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - scimUser : ACSCIMUser \[\[FromBody]]



\### HTTPGET api/\[controller]/{userCode}



\- Action: IsUserExists

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - userCode : string (query/path)

&#x20; - tenantId : int (query/path) \[\[FromQuery]]



\---



\## Controller: Saml2Controller



\- Auth: \[Authorize]

\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPGET api/Saml2/SsoSpMetaData



\- Action: SsoSpMetaData

\- Return: HttpResponseMessage

\- Auth: AllowAnonymous



\### HTTPGET api/Saml2/SAMLLogin



\- Action: SAMLLogin

\- Return: HttpResponseMessage

\- Auth: AllowAnonymous



\### HTTPPOST api/Saml2/Acs



\- Action: Acs

\- Return: HttpResponseMessage

\- Auth: AllowAnonymous



\---



\## Controller: BankingBookingController



\- Base route: api/v1



\### HTTPGET api/v1/bankingBooking/{bookingCode}



\- Action: GetBankingBookingByCode

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - bookingCode : string (query/path) \[\[FromRoute]]



\### HTTPPOST api/v1/bankingBooking



\- Action: CreateBankingBooking

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - bankingBookingDto : BankingBookingDto \[\[FromBody]]



\### HTTPPUT api/v1/bankingBooking/{bookingCode}



\- Action: UpdateBankingBooking

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - bookingCode : string \[\[FromRoute]]

&#x20; - bankingBookingDto : BankingBookingDto \[\[FromBody]]



\### HTTPPUT api/v1/bankingBooking/{bookingCode}/status/{status}



\- Action: UpdateBankingBookingStatus

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - bookingCode : string \[\[FromRoute]]

&#x20; - status : BookingStatus \[\[FromRoute]]



\### HTTPGET api/v1/bankingBooking/event/{eventCode}



\- Action: GetBookingForEvent

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - eventCode : string (query/path) \[\[FromRoute]]



\### HTTPGET api/v1/bankingBooking/{code}/calendar



\- Action: GetCalendarForBooking

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - code : string (query/path) \[\[FromRoute]]

&#x20; - calendarType : string (query/path) \[\[FromQuery]]



\---



\## Controller: ServiceController



\- Base route: api/v1



\### HTTPGET api/v1/servicecategory/{serviceCategoryCode}/services



\- Action: GetServicesByCategory

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - serviceCategoryCode : string (query/path)

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]

&#x20; - locationCode : string (query/path)



\### HTTPGET api/v1/appointment/{confirmationNumber}/services



\- Action: GetServicesByAppointmentId

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - confirmationNumber : string (query/path)



\### HTTPGET api/v1/location/{locationCode}/parentservice/{serviceCode}/service



\- Action: GetServiceByParentServiceAndLocation

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - locationCode : string (query/path)

&#x20; - serviceCode : string (query/path)



\### HTTPGET api/v1/service/{serviceCode}/parentservice



\- Action: GetParentServiceByServiceCodeCommand

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - serviceCode : string (query/path)



\### HTTPGET api/v1/widgetUrlParamsValid/serviceCatCode/{categoryCode}/serviceCode/{serviceCode}/locationCode/{locationCode}/userCode/{userCode}/isolatedLocationRequested/{isolatedLocationRequested}



\- Action: GetWidgetUrlParamsValid

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - categoryCode : string (query/path)

&#x20; - serviceCode : string (query/path)

&#x20; - locationCode : string (query/path)

&#x20; - userCode : string (query/path)

&#x20; - isolatedLocationRequested : bool (query/path)



\### HTTPGET api/v1/{ccServiceId}/client/{ccTenantId}/serviceUsage



\- Action: GetServiceUsage

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - ccTenantId : int (query/path)

&#x20; - ccServiceId : int (query/path)

&#x20; - default : CancellationToken cancellationToken = (query/path)



\---



\## Controller: BookingController



\- Base route: api/Booking/v3

\- Auth: \[Authorize]



\### HTTPPOST api/Booking/v3/CreateBooking



\- Action: CreateBooking

\- Return: async Task<ActionResult<CreateBookingResponse>>

\- Auth: \[Authorize]

\- Request body:

&#x20; - createBookingRequest : CreateBookingRequest \[\[FromBody]]



\### HTTPPOST api/Booking/v3/UpdateBooking



\- Action: UpdateBooking

\- Return: async Task<ActionResult<UpdateBookingResponse>>

\- Auth: \[Authorize]

\- Request body:

&#x20; - updateBookingRequest : UpdateBookingRequest \[\[FromBody]]



\### HTTPPOST api/Booking/v3/GetBookingStatus



\- Action: GetBookingStatus

\- Return: async Task<ActionResult<GetBookingStatusResponse>>

\- Auth: \[Authorize]

\- Request body:

&#x20; - request : GetBookingStatusRequest \[\[FromBody]]



\### HTTPPOST api/Booking/v3/ListBookings



\- Action: ListBookings

\- Return: async Task<ActionResult<ListBookingsResponse>>

\- Auth: \[Authorize]

\- Request body:

&#x20; - request : ListBookingsRequest \[\[FromBody]]



\---



\## Controller: BaseBookingController



\- Base route: api/v1



\### HTTPGET api/v1/booking/{bookingCode}/bookingType



\- Action: GetBookingTypeIdByBookingCode

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - bookingCode : string (query/path) \[\[FromRoute]]



\---



\## Controller: ConfigurationController



\- Base route: api/v1



\### HTTPGET api/v1/client/config



\- Action: GetClientConfig

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]



\---



\## Controller: AvailabilityController



\- Base route: api/Booking/v3



\### HTTPPOST api/Booking/v3/BatchAvailabilityLookup



\- Action: BatchAvailabilityLookup

\- Return: async Task<ActionResult<BatchAvailabilityLookupResponse>>

\- Auth: None

\- Request body:

&#x20; - availabilityRequest : BatchAvailabilityLookupRequest \[\[FromBody]]



\### HTTPGET api/Booking/v3/availability/location/{locationCode}/service/{serviceCode}/startDateLocal/{startDateLocal}/endDateLocal/{endDateLocal}/firstAvailableDate



\- Action: GetFirstAppointmentAvailableDate

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - locationCode : string (query/path)

&#x20; - serviceCode : string (query/path)

&#x20; - startDateLocal : DateTime (query/path)

&#x20; - endDateLocal : DateTime (query/path)

&#x20; - false : bool requireSpanishSpeaker = (query/path) \[\[FromQuery]]



\---



\## Controller: AuthController



\- Base route: api/auth



\### HTTPGET api/auth/ValidateResourceOwner



\- Action: ValidateResourceOwner

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - model : LoginViewModel (query/path) \[\[FromQuery]]



\### HTTPGET api/auth/ValidateClient



\- Action: ValidateClient

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - model : LoginViewModel (query/path) \[\[FromQuery]]



\### HTTPGET api/auth/ValidateWidget



\- Action: ValidateWidget

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - model : WidgetLoginModel (query/path) \[\[FromQuery]]



\### HTTPGET api/auth/ValidateUser



\- Action: ValidateUser

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - model : ValidateUserModel (query/path) \[\[FromQuery]]



\---



\## Controller: ShapedData



\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPGET api/ShapedData/GetCampaigns



\- Action: GetCampaigns

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - activeStatusId : int (query/path)



\### HTTPGET api/ShapedData/GetCampaign



\- Action: GetCampaign

\- Return: Campaign

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - campaignId : int (query/path)



\### HTTPGET api/ShapedData/CampaignNameAvailable



\- Action: CampaignNameAvailable

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - campaignName : string (query/path)

&#x20; - campaignId : int (query/path)



\### HTTPGET api/ShapedData/GetCampaignByCampaignName



\- Action: GetCampaignByCampaignName

\- Return: Campaign

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - campaignName : string (query/path)



\### HTTPGET api/ShapedData/GetOrgnizationTimeZone



\- Action: GetOrgnizationTimeZone

\- Return: Model.Data.ClientData.TimeZone

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPPOST api/ShapedData/SaveActivateDeActivateCampaign



\- Action: SaveActivateDeActivateCampaign

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/ShapedData/SaveDeleteCampaign



\- Action: SaveDeleteCampaign

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/ShapedData/SaveCampaign



\- Action: SaveCampaign

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/ShapedData/GetWidgetCampaignResults



\- Action: GetWidgetCampaignResults

\- Return: List<GetWidgetCampaignResults\_Result>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - startDate : DateTime (query/path)

&#x20; - endDate : DateTime (query/path)

&#x20; - activeStatusId : int (query/path)

&#x20; - campaigns : string (query/path)

&#x20; - includeNonCampaign : bool (query/path)

&#x20; - getTimesInLoggedInUserTimeZone : bool (query/path)



\### HTTPGET api/ShapedData/GetAppointmentsOfCampaign



\- Action: GetAppointmentsOfCampaign

\- Return: List<CampaignAppoinment>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - campaignId : int (query/path)

&#x20; - preferredTimeZoneStandardName : string (query/path)

&#x20; - startDate : DateTime (query/path)

&#x20; - endDate : DateTime (query/path)



\### HTTPGET api/ShapedData/GetCampaignsForReport



\- Action: GetCampaignsForReport

\- Return: List<ShapedData>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - activeStatusId : int (query/path)



\### HTTPGET api/ShapedData/GetAssignedProductCounts



\- Action: GetAssignedProductCounts

\- Return: List<GetProductServiceWidgetUserEvents\_Result>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - startDate : DateTime (query/path)

&#x20; - endDate : DateTime (query/path)

&#x20; - activeStatusId : int (query/path)

&#x20; - maxProducts : int (query/path)

&#x20; - campaigns : string (query/path)

&#x20; - includeNonCampaign : bool (query/path)

&#x20; - getTimesInLoggedInUserTimeZone : bool (query/path)



\---



\## Controller: HealthController



\- Base route: api/Booking/v3

\- Auth: \[Authorize]



\### HTTPGET api/Booking/v3/HealthCheck



\- Action: HealthCheck

\- Return: IActionResult

\- Auth: \[Authorize]



\---



\## Controller: ProvisioningController



\- Base route: api/provisioning



\### HTTPPOST api/provisioning/ProvisionUsers



\- Action: ProvisionUsers

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - userProvisioningRequest : ProvisioningRequest<ACUserProvisionModel>

&#x20; - default : CancellationToken cancellationToken =



\### HTTPPOST api/provisioning/ProvisionLocations



\- Action: ProvisionLocations

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - locationProvisioningRequest : ProvisioningRequest<ACLocationProvisionModel>

&#x20; - default : CancellationToken cancellationToken =



\### HTTPPOST api/provisioning/ProvisionServiceCategories



\- Action: ProvisionServiceCategories

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - svcCategoryProvisioningRequest : ProvisioningRequest<ACServiceCategoryProvisionModel>

&#x20; - default : CancellationToken cancellationToken =



\### HTTPPOST api/provisioning/ProvisionUserAvailability



\- Action: ProvisionUserAvailability

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - userAvailabilityProvisioningRequest : ProvisioningRequest<ACUserAvailabilityProvisionModel>

&#x20; - default : CancellationToken cancellationToken =



\### HTTPPOST api/provisioning/ProvisionLocationHoursOfOperation



\- Action: ProvisionLocationHoursOfOperation

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - locationHoursOfOperationProvisioningRequest : ProvisioningRequest<ACLocationHoursOfOperationModel>

&#x20; - default : CancellationToken cancellationToken =



\### HTTPPOST api/provisioning/ProvisionHolidays



\- Action: ProvisionHolidays

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - holidaysProvisioningRequest : ProvisioningRequest<ACHolidayProvisionModel>

&#x20; - default : CancellationToken cancellationToken =



\### HTTPPOST api/provisioning/ProvisionSkills



\- Action: ProvisionSkills

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - skillsProvisioningRequest : ProvisioningRequest<ACUserSkillsProvisionModel>

&#x20; - default : CancellationToken cancellationToken =



\### HTTPPOST api/provisioning/ProvisionServices



\- Action: ProvisionServices

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - serviceProvisioningRequest : ProvisioningRequest<ACServiceProvisionModel>

&#x20; - default : CancellationToken cancellationToken =



\### HTTPPOST api/provisioning/SyncServices



\- Action: SyncServices

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - serviceSyncRequest : ProvisioningRequest<ACServiceSyncModel>

&#x20; - default : CancellationToken cancellationToken =



\### HTTPPOST api/provisioning/SyncHolidays



\- Action: SyncHolidays

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - serviceSyncRequest : ProvisioningRequest<ACHolidaySyncModel>

&#x20; - default : CancellationToken cancellationToken =



\---



\## Controller: DiscrepancyController



\- Base route: api/\[controller]



\### HTTPGET api/\[controller]/GetDiscrepancies



\- Action: GetDiscrepancies

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - entityName : int (query/path) \[\[FromQuery]]

&#x20; - discrepancyType : int (query/path) \[\[FromQuery]]



\---



\## Controller: Req



\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPPOST api/Req/AuthorizeGoToMeeting



\- Action: AuthorizeGoToMeeting

\- Return: bool

\- Auth: None

\- Request body:

&#x20; - req : Req \[\[FromBody]]



\### HTTPPOST api/Req/AuthorizeWebex



\- Action: AuthorizeWebex

\- Return: bool

\- Auth: None

\- Request body:

&#x20; - req : Req \[\[FromBody]]



\### HTTPPOST api/Req/AuthorizeZoomOAuth



\- Action: AuthorizeZoomOAuth

\- Return: bool

\- Auth: None

\- Request body:

&#x20; - req : Req \[\[FromBody]]



\### HTTPGET api/Req/VerifyRefreshToken



\- Action: VerifyRefreshToken

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - aspNetUserId : int (query/path)



\### HTTPGET api/Req/GetUserOAuthConferencingProvider



\- Action: GetUserOAuthConferencingProvider

\- Return: Object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\---



\## Controller: HelpController



\- Base route: api/{controller}/{action} (default WebApiConfig route)



\---



\## Controller: WeatherForecastController



\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPGET api/WeatherForecast/Get



\- Action: Get

\- Return: async Task<IEnumerable<WeatherForecast>>

\- Auth: None



\---



\## Controller: ConferencingController



\- Base route: api/conferencing



\### HTTPGET api/conferencing/client/{ccTenantId}/email/{emailaddress}/conferencingUserId



\- Action: GetConferencingUserId

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - ccTenantId : int (query/path)

&#x20; - emailaddress : string (query/path)

&#x20; - default : CancellationToken cancellationToken = (query/path)



\### HTTPGET api/conferencing/client/{ccTenantId}/conferencingProvider



\- Action: GetVirtualConferencingProviderName

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - ccTenantId : int (query/path)

&#x20; - default : CancellationToken cancellationToken = (query/path)



\### HTTPGET api/conferencing/client/{ccTenantId}/user/{ccUserId}/verifyAndGetCurrentAuthenticationStatus



\- Action: VerifyAndGetCurrentAuthenticationStatus

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - ccTenantId : int (query/path)

&#x20; - ccUserId : string (query/path)

&#x20; - default : CancellationToken cancellationToken = (query/path)



\### HTTPGET api/conferencing/client/{ccTenantId}/conferencingProvider/{conferencingProviderID}/ccUserId/{ccUserId}/conferencingUserId/{conferencingUserId}/validate



\- Action: ValidateconferencingUserId

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - ccTenantId : int (query/path)

&#x20; - conferencingProviderID : int (query/path)

&#x20; - ccUserId : string (query/path)

&#x20; - conferencingUserId : string (query/path)



\---



\## Controller: InterviewEventController



\- Base route: api/v1



\### HTTPGET api/v1/interviewEvents/{eventCode}



\- Action: GetInterviewEventByCode

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - eventCode : string (query/path) \[\[FromRoute]]



\### HTTPGET api/v1/interviewEvents



\- Action: GetInterviewEvents

\- Return: async Task<IActionResult>

\- Auth: None



\### HTTPGET api/v1/interviewEvents/filter



\- Action: GetInterviewEventsByCrieteria

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - eventSearchCrieteria : EventSearchCriteria (query/path) \[\[FromQuery]]

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]



\### HTTPGET api/v1/interviewEvents/date



\- Action: GetInterviewEventsForDate

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - eventSearchByDateCriteria : EventSearchByDateCriteria (query/path) \[\[FromQuery]]



\### HTTPPOST api/v1/interviewEvents



\- Action: CreateInterviewEvent

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - interviewEventDto : InterviewEventDto \[\[FromBody]]



\### HTTPPUT api/v1/interviewEvents/{eventCode}



\- Action: UpdateInterviewEvent

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - interviewEventDto : InterviewEventDto \[\[FromBody]]

&#x20; - eventCode : string \[\[FromRoute]]



\### HTTPGET api/v1/interviewEvents/{eventCode}/timeSlots



\- Action: GetTimeSlotsByEventCode

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - eventCode : string (query/path) \[\[FromRoute]]



\### HTTPPUT api/v1/interviewEvents/{eventCode}/status/{eventStatus}



\- Action: UpdateInterviewEventStatus

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - eventCode : string \[\[FromRoute]]

&#x20; - eventStatus : bool \[\[FromRoute]]



\---



\## Controller: CacheController



\- Base route: api/\[controller]



\### HTTPPOST api/\[controller]/UpdateCache



\- Action: UpdateCache

\- Return: IActionResult

\- Auth: None

\- Request body:

&#x20; - cacheUpdateRequest : CacheUpdateRequest \[\[FromBody]]



\---



\## Controller: LocationController



\- Base route: api/v1



\### HTTPGET api/v1/locations



\- Action: GetLocations

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]

&#x20; - serviceCode : string (query/path)

&#x20; - latitude : double? (query/path)

&#x20; - longitude : double? (query/path)

&#x20; - unit : DistanceMeasurementUnit? (query/path)

&#x20; - LocationStatus.Active : LocationStatus activeStatus = (query/path) \[\[FromQuery]]

&#x20; - LocationType.Branch : LocationType locationType = (query/path)

&#x20; - false : bool showInWidget = (query/path)

&#x20; - false : bool optedInOnly = (query/path)

&#x20; - null : List<MeetingPrefrence> meetingPreference = (query/path)

&#x20; - null : string locationCodes = (query/path)



\### HTTPGET api/v1/location/{locationCode}/openDays



\- Action: GetLocationOpenDays

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - locationCode : string (query/path)



\### HTTPGET api/v1/location/{locationCode}



\- Action: GetLocation

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - locationCode : string (query/path)



\### HTTPGET api/v1/locations/{locationCodes}



\- Action: GetLocations

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - locationCodes : string (query/path)



\### HTTPGET api/v1/location/{locationCode}/holidays



\- Action: GetHolidays

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - locationCode : string (query/path)

&#x20; - fromDateLocale : DateTime? (query/path) \[\[FromQuery]]

&#x20; - toDateLocale : DateTime? (query/path)

&#x20; - pageInfo : PageInfo (query/path)



\### HTTPGET api/v1/location/{address}/coordinates



\- Action: GetLocationCoordinates

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - address : string (query/path)



\### HTTPGET api/v1/location/parentservice/{parentServiceCode}/filter/{locationFilterCodes}/locations



\- Action: GetLocationsEligibleToHandleProvidedService

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - parentServiceCode : string (query/path)

&#x20; - locationFilterCodes : string (query/path)



\### HTTPGET api/v1/location/{locationCode}/appointments



\- Action: GetAppointments

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]

&#x20; - locationCode : string (query/path)

&#x20; - startTimeUtc : string (query/path) \[\[FromQuery]]

&#x20; - endTimeUtc : string (query/path) \[\[FromQuery]]

&#x20; - appointmentStatus : string (query/path) \[\[FromQuery]]



\### HTTPGET api/v1/GetAll



\- Action: GetAll

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - default : CancellationToken cancellationToken = (query/path)



\### HTTPGET api/v1/eventLocations/parentLocation/{parentLocationCode}/locationType/{locationType}



\- Action: GetInterviewEventEligibleLocations

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - parentLocationCode : string (query/path) \[\[FromRoute]]

&#x20; - locationType : LocationType (query/path) \[\[FromRoute]]



\---



\## Controller: BankingEventController



\- Base route: api/v1



\### HTTPGET api/v1/bankingEvent/{eventCode}



\- Action: GetBankingEventByCode

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - eventCode : string (query/path) \[\[FromRoute]]



\### HTTPGET api/v1/bankingEvent



\- Action: GetBankingEvents

\- Return: async Task<IActionResult>

\- Auth: None



\### HTTPGET api/v1/bankingEvent/filter



\- Action: GetBankingEventsByCrieteria

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - eventSearchCrieteria : EventSearchCriteria (query/path) \[\[FromQuery]]

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]



\### HTTPGET api/v1/bankingEvent/date



\- Action: GetBankingEventsForDate

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - eventSearchByDateCriteria : EventSearchByDateCriteria (query/path) \[\[FromQuery]]



\### HTTPPOST api/v1/bankingEvent



\- Action: CreateBankingEvent

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - bankingEventDto : BankingEventDto \[\[FromBody]]



\### HTTPPUT api/v1/bankingEvent/{eventCode}



\- Action: UpdateBankingEvent

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - bankingEventDto : BankingEventDto \[\[FromBody]]

&#x20; - eventCode : string \[\[FromRoute]]



\### HTTPGET api/v1/bankingEvent/{eventCode}/timeSlots



\- Action: GetTimeSlotsByEventCode

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - eventCode : string (query/path) \[\[FromRoute]]



\### HTTPPUT api/v1/bankingEvent/{eventCode}/status/{eventStatus}



\- Action: UpdateBankingEventStatus

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - eventCode : string \[\[FromRoute]]

&#x20; - eventStatus : bool \[\[FromRoute]]



\---



\## Controller: ResourceExternalId



\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPGET api/ResourceExternalId/LocationServicesWithRootServices



\- Action: LocationServicesWithRootServices

\- Return: Collection<object>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - serviceCategoryId : int? (query/path)

&#x20; - activeStatus : int (query/path)



\### HTTPGET api/ResourceExternalId/UserNameValid



\- Action: UserNameValid

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - UserName : string (query/path)



\### HTTPGET api/ResourceExternalId/ServiceCategories



\- Action: ServiceCategories

\- Return: IQueryable<ServiceCategory>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/ResourceExternalId/System\_Roles



\- Action: System\_Roles

\- Return: IQueryable<System\_Role>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/ResourceExternalId/AvailableRolesForUser



\- Action: AvailableRolesForUser

\- Return: IQueryable<System\_Role>

\- Auth: None

\- Request parameters:

&#x20; - aspNetUserId : int (query/path)

&#x20; - clientId : int (query/path)



\### HTTPGET api/ResourceExternalId/ManageUsersGridData



\- Action: ManageUsersGridData

\- Return: IQueryable<UserGridItem>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - activeStatus : int (query/path)

&#x20; - roleId : int (query/path)

&#x20; - includeSubLocations : bool (query/path)



\### HTTPGET api/ResourceExternalId/UserEmailAddresses



\- Action: UserEmailAddresses

\- Return: List<EmailAddressResult>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - userId : int (query/path)



\### HTTPPOST api/ResourceExternalId/ExportUserDetailsByUserIds



\- Action: ExportUserDetailsByUserIds

\- Return: HttpResponseMessage

\- Auth: None



\### HTTPGET api/ResourceExternalId/UserRelated



\- Action: UserRelated

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - userId : int (query/path)

&#x20; - -1 : int weekNumber = (query/path)



\### HTTPGET api/ResourceExternalId/GetRotations



\- Action: GetRotations

\- Return: List<object>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - startDate : DateTime (query/path)

&#x20; - endDate : DateTime (query/path)

&#x20; - numRotations : int (query/path)

&#x20; - rotationNum : int? (query/path)

&#x20; - 0 : int dayOne = (query/path)



\### HTTPGET api/ResourceExternalId/LocationsOfClient



\- Action: LocationsOfClient

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPPOST api/ResourceExternalId/SaveUserRelated



\- Action: SaveUserRelated

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/ResourceExternalId/SaveActivateDeActivateUsers



\- Action: SaveActivateDeActivateUsers

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/ResourceExternalId/GetDefaultLocation



\- Action: GetDefaultLocation

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/ResourceExternalId/GetLocationAvailability



\- Action: GetLocationAvailability

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/ResourceExternalId/GetAvailableLocationsForUser



\- Action: GetAvailableLocationsForUser

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/ResourceExternalId/GetUser



\- Action: GetUser

\- Return: User

\- Auth: None

\- Request parameters:

&#x20; - userId : int (query/path)

&#x20; - clientId : int (query/path)



\### HTTPGET api/ResourceExternalId/GetCurrentLoggedInUser



\- Action: GetCurrentLoggedInUser

\- Return: Model.Data.ClientData.User

\- Auth: None



\### HTTPGET api/ResourceExternalId/GetCurrentLoggedInUserDisplayName



\- Action: GetCurrentLoggedInUserDisplayName

\- Return: String

\- Auth: None



\### HTTPGET api/ResourceExternalId/GetUserInfo



\- Action: GetUserInfo

\- Return: Model.Data.ClientData.User

\- Auth: None

\- Request parameters:

&#x20; - systemUserId : int (query/path)

&#x20; - clientId : int (query/path)



\### HTTPGET api/ResourceExternalId/GetUserRecord



\- Action: GetUserRecord

\- Return: User

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - aspNetId : int (query/path)



\### HTTPGET api/ResourceExternalId/SkillsByService



\- Action: SkillsByService

\- Return: List<int>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - serviceId : int (query/path)

&#x20; - employeeIds : int\[] (query/path) \[\[FromUri]]



\### HTTPGET api/ResourceExternalId/GetUserWorkLocations



\- Action: GetUserWorkLocations

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - userId : int (query/path)



\### HTTPGET api/ResourceExternalId/GetUserListForSKill



\- Action: GetUserListForSKill

\- Return: List<UserInfo>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - serviceCode : string (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/ResourceExternalId/GenerateQRCode



\- Action: GenerateQRCode

\- Return: HttpResponseMessage

\- Auth: None

\- Request parameters:

&#x20; - key : string (query/path)

&#x20; - username : string (query/path)



\### HTTPGET api/ResourceExternalId/GetTimezoneByTzName



\- Action: GetTimezoneByTzName

\- Return: Oac.Model.Data.ClientData.TimeZone

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - tzName : string (query/path)



\### HTTPGET api/ResourceExternalId/ExtractVirtualConferenceUserID



\- Action: ExtractVirtualConferenceUserID

\- Return: Object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - userName : string (query/path)



\### HTTPGET api/ResourceExternalId/ValidateResourceExternalUserID



\- Action: ValidateResourceExternalUserID

\- Return: Object

\- Auth: None

\- Request parameters:

&#x20; - userId : int (query/path)

&#x20; - clientId : int (query/path)

&#x20; - resourceExternalID : string (query/path)



\### HTTPGET api/ResourceExternalId/AtleastOneWorkAvailabilityTimeRangeEntryExistsWithOnlyMeetingPreferenceSetAsProvidedPreference



\- Action: AtleastOneWorkAvailabilityTimeRangeEntryExistsWithOnlyMeetingPreferenceSetAsProvidedPreference

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - clientUserId : int (query/path)

&#x20; - providedMeetingPreferenceId : int (query/path)



\### HTTPPOST api/ResourceExternalId/ProvisionTenantSwitchingUserToClient



\- Action: ProvisionTenantSwitchingUserToClient

\- Return: int

\- Auth: None

\- Request body:

&#x20; - clientId : int



\---



\## Controller: UserController



\- Base route: api/v1



\### HTTPGET api/v1/users



\- Action: GetUsers

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]

&#x20; - locationCode : string (query/path)

&#x20; - UserStatus.All : UserStatus userStatus = (query/path)

&#x20; - false : bool includeSubLocationUsers = (query/path)



\### HTTPGET api/v1/user/{userCode}



\- Action: GetUser

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - userCode : string (query/path)



\### HTTPGET api/v1/users/locationCode/{locationCode}/serviceCode/{serviceCode}/meetingPreference/{meetingPreference}



\- Action: GetEligibleUsersforMeetingPreference

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]

&#x20; - locationCode : string (query/path)

&#x20; - serviceCode : string (query/path)

&#x20; - meetingPreference : MeetingPrefrence (query/path)



\### HTTPGET api/v1/user/{userCode}/appointments



\- Action: GetAppointments

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]

&#x20; - userCode : string (query/path)

&#x20; - startTimeUtc : string (query/path) \[\[FromQuery]]

&#x20; - endTimeUtc : string (query/path) \[\[FromQuery]]

&#x20; - appointmentStatus : string (query/path) \[\[FromQuery]]



\### HTTPGET api/v1/users/location/{locationId}/eventconductors



\- Action: GetInterviewEventEligibleConductors

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - locationId : int (query/path) \[\[FromRoute]]



\### HTTPGET api/v1/users



\- Action: GetInterviewEventOwners

\- Return: IActionResult

\- Auth: None



\### HTTPGET api/v1/users/{userId}



\- Action: GetUser

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - userId : int (query/path) \[\[FromRoute]]



\### HTTPGET api/v1/users/system/{userId}



\- Action: GetSystemUser

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - userId : int (query/path) \[\[FromRoute]]



\---



\## Controller: ClientController



\- Base route: api/client



\### HTTPGET api/client/{ccTenantId}/meetingPreferences



\- Action: GetClientMeetingPreferences

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - ccTenantId : int (query/path)

&#x20; - default : CancellationToken cancellationToken = (query/path)



\### HTTPGET api/client/{ccTenantId}/config



\- Action: GetClientConfiguration

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - ccTenantId : int (query/path)

&#x20; - default : CancellationToken cancellationToken = (query/path)



\### HTTPGET api/client/ShowEveryAppointmentForLocation



\- Action: ShowEveryAppointmentForLocation

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - userId : int (query/path)

&#x20; - from : DateTime (query/path)

&#x20; - to : DateTime (query/path)



\### HTTPGET api/client/LookupDDLServices



\- Action: LookupDDLServices

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - 2 : byte? activeStatusType = (query/path)



\### HTTPGET api/client/LookupServicesForCategory



\- Action: LookupServicesForCategory

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - categoryId : int (query/path)

&#x20; - false : bool alphaSort = (query/path)



\### HTTPGET api/client/LookupDDLAppointmentLocation



\- Action: LookupDDLAppointmentLocation

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/LookupDDLAppointmentTypes



\- Action: LookupDDLAppointmentTypes

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/ShowFilteredAppointmentForLocation



\- Action: ShowFilteredAppointmentForLocation

\- Return: List<AppointmentEvent>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - userId : int (query/path)

&#x20; - from : DateTime (query/path)

&#x20; - to : DateTime (query/path)

&#x20; - servicefilter : string (query/path)

&#x20; - categoryfilter : string (query/path)

&#x20; - apptstatustypefilter : string (query/path)

&#x20; - employeefilter : string (query/path)

&#x20; - getTimesInLoggedInUserTimeZone : bool (query/path)

&#x20; - preferredTimeZoneId : int (query/path)

&#x20; - false : bool isphoneonlyfilter = (query/path)



\### HTTPGET api/client/LookupDDLEmployees



\- Action: LookupDDLEmployees

\- Return: List<StaffCheckList>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - userId : int (query/path)



\### HTTPGET api/client/LookupDDLAppointmentStatus



\- Action: LookupDDLAppointmentStatus

\- Return: List<AppointmentStatu>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - userId : int (query/path)



\### HTTPGET api/client/LookupDDLCalendarItems



\- Action: LookupDDLCalendarItems

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/LookupExceptionEmployees



\- Action: LookupExceptionEmployees

\- Return: IList<UserInfo>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/LookupExceptionTypes



\- Action: LookupExceptionTypes

\- Return: List<WorkExceptionType>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/LookupExceptionLocations



\- Action: LookupExceptionLocations

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/LookupFloatLocations



\- Action: LookupFloatLocations

\- Return: List<spGetAggregatedFloatLocations\_Result>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/ExceptionLookups



\- Action: ExceptionLookups

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/AppointmentsForTrendViewReport



\- Action: AppointmentsForTrendViewReport

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocation : int (query/path)

&#x20; - firstDate : DateTime (query/path)

&#x20; - lastDate : DateTime (query/path)

&#x20; - getTimesInLoggedInUserTimeZone : bool (query/path)



\### HTTPGET api/client/AppointmentsForDetailsReport



\- Action: AppointmentsForDetailsReport

\- Return: List<fnGetAppointmentsForDetailReport\_Result>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocation : int (query/path)

&#x20; - firstDate : DateTime (query/path)

&#x20; - lastDate : DateTime (query/path)

&#x20; - getTimesInLoggedInUserTimeZone : bool (query/path)



\### HTTPGET api/client/SelectorInfoForDetailsReport



\- Action: SelectorInfoForDetailsReport

\- Return: SelectorInfoForDetailsReport\_Result

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocation : int (query/path)



\### HTTPGET api/client/GetSelectorDataForAppointmentDetailReport



\- Action: GetSelectorDataForAppointmentDetailReport

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocation : int (query/path)



\### HTTPGET api/client/ActionCenterAppointments



\- Action: ActionCenterAppointments

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocation : int (query/path)

&#x20; - firstDate : DateTime (query/path)

&#x20; - lastDate : DateTime (query/path)

&#x20; - changeAssignedUser : int (query/path)

&#x20; - selectedLocation : int (query/path)

&#x20; - false : bool getTimesInLoggedInUserTimeZone = (query/path)

&#x20; - "" : string searchText = (query/path)



\### HTTPPOST api/client/SaveAppointmentServices



\- Action: SaveAppointmentServices

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/client/BulkDeleteAppointments



\- Action: BulkDeleteAppointments

\- Return: bool

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/client/SaveAppointmentComment



\- Action: SaveAppointmentComment

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/client/SaveAppointments



\- Action: SaveAppointments

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/GetAppointmentsById



\- Action: GetAppointmentsById

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - AppointmentIds : int\[] (query/path) \[\[FromUri]]

&#x20; - ClientID : int (query/path)



\### HTTPPOST api/client/SaveAllAppointmentEntities



\- Action: SaveAllAppointmentEntities

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/ShowWorkExceptionForLocation



\- Action: ShowWorkExceptionForLocation

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - userId : int (query/path)

&#x20; - from : string (query/path)

&#x20; - to : string (query/path)

&#x20; - employeefilter : string (query/path)

&#x20; - getTimesInLoggedInUserTimeZone : bool (query/path)

&#x20; - preferredTimeZoneId : int (query/path)

&#x20; - false : bool isKendo = (query/path)



\### HTTPGET api/client/GetResourceExceptionsForLocation



\- Action: GetResourceExceptionsForLocation

\- Return: List<AppointmentEvent>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - userId : int (query/path)

&#x20; - from : DateTime (query/path)

&#x20; - to : DateTime (query/path)

&#x20; - getTimesInLoggedInUserTimeZone : bool (query/path)

&#x20; - preferredTimeZoneId : int (query/path)



\### HTTPGET api/client/GetResourcesForLocation



\- Action: GetResourcesForLocation

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPPOST api/client/SaveWorkException



\- Action: SaveWorkException

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/client/SaveResourceException



\- Action: SaveResourceException

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/GetClientUserId



\- Action: GetClientUserId

\- Return: int

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - userId : int (query/path)



\### HTTPGET api/client/GetWorkExceptionById



\- Action: GetWorkExceptionById

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - exceptionId : int (query/path)

&#x20; - false : bool includeChangeLog = (query/path)



\### HTTPGET api/client/GetResourceExceptionById



\- Action: GetResourceExceptionById

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - exceptionId : int (query/path)

&#x20; - false : bool includeChangeLog = (query/path)



\### HTTPGET api/client/DeleteResourceExceptionById



\- Action: DeleteResourceExceptionById

\- Return: SaveResult

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - exceptionId : int (query/path)



\### HTTPGET api/client/DeleteWorkExceptionById



\- Action: DeleteWorkExceptionById

\- Return: SaveResult

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - userId : int (query/path)

&#x20; - exceptionId : int (query/path)



\### HTTPGET api/client/GetClientGlobalConfig



\- Action: GetClientGlobalConfig

\- Return: ClientConfiguration

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - userId : int (query/path)



\### HTTPGET api/client/CheckUserAvailability



\- Action: CheckUserAvailability

\- Return: List<GetUserConflictingApptWithinDateRange>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - fkUserId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - startTime : DateTime (query/path)

&#x20; - endTime : DateTime (query/path)

&#x20; - utcOffset : int (query/path)

&#x20; - preferredTimeZoneId : int (query/path)



\### HTTPGET api/client/LandingPageDashboardData



\- Action: LandingPageDashboardData

\- Return: List<object>

\- Auth: None

\- Request parameters:

&#x20; - dtString : string (query/path)

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - getTimesInLoggedInUserTimeZone : bool (query/path)



\### HTTPGET api/client/GetMessageTemplatesForActionCenter



\- Action: GetMessageTemplatesForActionCenter

\- Return: List<MessageTemplate>

\- Auth: None



\### HTTPPOST api/client/SendBulkEmails



\- Action: SendBulkEmails

\- Return: object

\- Auth: None

\- Request body:

&#x20; - paramsList : JObject



\### HTTPGET api/client/Metadata



\- Action: Metadata

\- Return: string

\- Auth: None



\### HTTPGET api/client/Users



\- Action: Users

\- Return: IQueryable<User>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/client/LocationList



\- Action: LocationList

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocation : int (query/path)



\### HTTPGET api/client/GetAllActiveLocations



\- Action: GetAllActiveLocations

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/client/GetAllActiveBranchLocations



\- Action: GetAllActiveBranchLocations

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/client/LocationContext



\- Action: LocationContext

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocation : int (query/path)



\### HTTPGET api/client/GetUserHomeLocation



\- Action: GetUserHomeLocation

\- Return: Location

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - userId : int (query/path)



\### HTTPGET api/client/CurrentLocation



\- Action: CurrentLocation

\- Return: Location

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPPOST api/client/SaveLocationSettings



\- Action: SaveLocationSettings

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/AllHolidays



\- Action: AllHolidays

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocationId : int (query/path)



\### HTTPGET api/client/SelectedHoliday



\- Action: SelectedHoliday

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - holidayId : int (query/path)

&#x20; - currentLocationId : int (query/path)

&#x20; - orgHolidayId : int (query/path)



\### HTTPGET api/client/HolidaysByDate



\- Action: HolidaysByDate

\- Return: IEnumerable<Holiday>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocationId : int (query/path)

&#x20; - dt : DateTime (query/path)

&#x20; - opt : int (query/path)



\### HTTPGET api/client/LocationHierarchy



\- Action: LocationHierarchy

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocationId : int (query/path)



\### HTTPGET api/client/GetAllChildren



\- Action: GetAllChildren

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocationId : int (query/path)



\### HTTPPOST api/client/SaveHoliday



\- Action: SaveHoliday

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/client/DeleteHoliday



\- Action: DeleteHoliday

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/GetActiveHolidaysForBranch



\- Action: GetActiveHolidaysForBranch

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - year : int (query/path)



\### HTTPGET api/client/Services



\- Action: Services

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocation : int (query/path)

&#x20; - 2 : byte? activeStatusType = (query/path)



\### HTTPGET api/client/GetServices



\- Action: GetServices

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - false : bool alphaSort = (query/path)



\### HTTPGET api/client/SelectedService



\- Action: SelectedService

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - serviceId : int (query/path)

&#x20; - currentLocation : int (query/path)

&#x20; - includeSubLocation : bool (query/path)



\### HTTPGET api/client/ServiceByIdOnly



\- Action: ServiceByIdOnly

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - serviceId : int (query/path)



\### HTTPGET api/client/GetLocationHierarchy



\- Action: GetLocationHierarchy

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - currentUserID : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/GetUsersServiceByLocationId



\- Action: GetUsersServiceByLocationId

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - includeSubLocations : int (query/path)

&#x20; - fkServiceId : int (query/path)



\### HTTPGET api/client/GetUsersByLocationId



\- Action: GetUsersByLocationId

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - includeSubLocations : bool (query/path)



\### HTTPGET api/client/CanAddServices



\- Action: CanAddServices

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - currentLocation : int (query/path)



\### HTTPPOST api/client/SaveService



\- Action: SaveService

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/PublicLookups



\- Action: PublicLookups

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/client/TimeZones



\- Action: TimeZones

\- Return: List<Oac.Model.Data.ClientData.TimeZone>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/client/GetTemplateAttributes



\- Action: GetTemplateAttributes

\- Return: IList<NotificationMessageTemplateAttributeDto>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - templateId : int (query/path)

&#x20; - localizationLanguage : int (query/path)



\### HTTPGET api/client/GetConvertedNotificationMessageTemplateByFilterCriteria



\- Action: GetConvertedNotificationMessageTemplateByFilterCriteria

\- Return: NotificationMessageTemplate

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - language : int (query/path)

&#x20; - recipient : int (query/path)

&#x20; - emailType : int (query/path)

&#x20; - meetingPreference : int? (query/path)

&#x20; - additionalProperties : string (query/path)

&#x20; - sendVia : string (query/path)



\### HTTPPOST api/client/SaveCustomNotificationMessageTemplate



\- Action: SaveCustomNotificationMessageTemplate

\- Return: void

\- Auth: None



\### HTTPPOST api/client/ResetNotificationMessageTemplateToDefaultContent



\- Action: ResetNotificationMessageTemplateToDefaultContent

\- Return: void

\- Auth: None



\### HTTPPOST api/client/DispatchTestEmail



\- Action: DispatchTestEmail

\- Return: void

\- Auth: None



\### HTTPGET api/client/GetResourcesForApptDetailReport



\- Action: GetResourcesForApptDetailReport

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - activeStatus : int (query/path)



\### HTTPGET api/client/GetResourcesForActionCenter



\- Action: GetResourcesForActionCenter

\- Return: IQueryable

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - activeStatus : int (query/path)



\### HTTPGET api/client/GetResourceByCode



\- Action: GetResourceByCode

\- Return: Resource

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - resourceCode : string (query/path)



\### HTTPGET api/client/IsResourceCodeUnique



\- Action: IsResourceCodeUnique

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - resourceId : int? (query/path)

&#x20; - resourceCode : string (query/path)



\### HTTPGET api/client/IsResourceEmailUnique



\- Action: IsResourceEmailUnique

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - resourceId : int? (query/path)

&#x20; - resourceEmail : string (query/path)



\### HTTPPOST api/client/SaveResources



\- Action: SaveResources

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/GetLocationCurrentTime



\- Action: GetLocationCurrentTime

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/GetWorkAvailTemplateForUser



\- Action: GetWorkAvailTemplateForUser

\- Return: IQueryable<WorkAvailTemplate>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - userId : int (query/path)



\### HTTPGET api/client/GetWorkAvailTemplateForLocation



\- Action: GetWorkAvailTemplateForLocation

\- Return: IQueryable<WorkAvailTemplate>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPPOST api/client/SaveWorkAvailTemplateForLocation



\- Action: SaveWorkAvailTemplateForLocation

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/GetAppointmentLookups



\- Action: GetAppointmentLookups

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - startDate : DateTime (query/path)

&#x20; - locationTimeZone : string (query/path)

&#x20; - meetingPreference : int (query/path)



\### HTTPGET api/client/GetAppointmentRelatedById



\- Action: GetAppointmentRelatedById

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - appointmentId : int (query/path)

&#x20; - includeRelated : bool (query/path)



\### HTTPPOST api/client/SaveAppointment



\- Action: SaveAppointment

\- Return: bool

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/client/AutoAssignAppointment



\- Action: AutoAssignAppointment

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/AutoAssignAppointmentUser



\- Action: AutoAssignAppointmentUser

\- Return: int

\- Auth: None

\- Request parameters:

&#x20; - serviceId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - intervalInMins : int (query/path)

&#x20; - startDate : DateTime (query/path)

&#x20; - endDate : DateTime (query/path)



\### HTTPGET api/client/GetConflictingAppointments



\- Action: GetConflictingAppointments

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - fkUserId : int (query/path)

&#x20; - apptId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - startTime : DateTime (query/path)

&#x20; - endTime : DateTime (query/path)

&#x20; - confNum : string (query/path)

&#x20; - serviceId : int (query/path)

&#x20; - futureOnly : bool (query/path)

&#x20; - spanish : bool (query/path)

&#x20; - resourceId : int (query/path)

&#x20; - virtualConferenceEnableUserRequired : bool (query/path)

&#x20; - isInPersonAppointment : bool (query/path)

&#x20; - isPhoneAppointment : bool (query/path)



\### HTTPGET api/client/GetConflictingResourceExceptions



\- Action: GetConflictingResourceExceptions

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - startTime : DateTime (query/path)

&#x20; - endTime : DateTime (query/path)

&#x20; - startTimeUtcOffset : int (query/path)

&#x20; - endTimeUtcOffset : int (query/path)

&#x20; - resourceId : int (query/path)

&#x20; - preferredTimeZoneId : int (query/path)

&#x20; - false : bool isAllDay = (query/path)



\### HTTPGET api/client/GetNumberOfAvailUsersForService



\- Action: GetNumberOfAvailUsersForService

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - fkUserId : int (query/path)

&#x20; - locationId : int (query/path)

&#x20; - startTime : DateTime (query/path)

&#x20; - endTime : DateTime (query/path)

&#x20; - serviceId : int (query/path)

&#x20; - futureOnly : bool (query/path)

&#x20; - spanish : bool (query/path)

&#x20; - virtualConferenceEnableUserRequired : bool (query/path)

&#x20; - isInpersonAppointmentbool : bool (query/path)

&#x20; - isPhoneAppointment : bool (query/path)



\### HTTPGET api/client/GetConcurrencyMode



\- Action: GetConcurrencyMode

\- Return: object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/GetLocationUtcOffset



\- Action: GetLocationUtcOffset

\- Return: double

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - locationId : int (query/path)



\### HTTPGET api/client/GetProductCategories



\- Action: GetProductCategories

\- Return: List<object>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - true : bool showCategoriesWithNoServices = (query/path)

&#x20; - false : bool alphaSort = (query/path)



\### HTTPGET api/client/GetProductsAndServicesForSort



\- Action: GetProductsAndServicesForSort

\- Return: List<object>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)



\### HTTPGET api/client/GetSelectedProductCategory



\- Action: GetSelectedProductCategory

\- Return: ServiceCategory

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - productCatId : int (query/path)



\### HTTPGET api/client/ServiceCodeIsUnique



\- Action: ServiceCodeIsUnique

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - serviceId : int (query/path)

&#x20; - serviceCode : string (query/path)



\### HTTPGET api/client/ServiceNameIsUnique



\- Action: ServiceNameIsUnique

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - serviceId : int (query/path)

&#x20; - serviceName : string (query/path)



\### HTTPGET api/client/AtleastOneServiceOrUserAvailableWithOnlyMeetingPreferenceSetAsProvidedPreference



\- Action: AtleastOneServiceOrUserAvailableWithOnlyMeetingPreferenceSetAsProvidedPreference

\- Return: bool

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - providedMeetingPreferenceId : int (query/path)



\### HTTPPOST api/client/SaveProductAndServiceSortOrder



\- Action: SaveProductAndServiceSortOrder

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/client/SaveProductCategory



\- Action: SaveProductCategory

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPGET api/client/AppointmentExistsForService



\- Action: AppointmentExistsForService

\- Return: Object

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - serviceId : int (query/path)



\### HTTPPOST api/client/DeleteAndReassignService



\- Action: DeleteAndReassignService

\- Return: SaveResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\### HTTPPOST api/client/UpdateServiceActiveStatus



\- Action: UpdateServiceActiveStatus

\- Return: IHttpActionResult

\- Auth: None

\- Request body:

&#x20; - saveBundle : JObject



\---



\## Controller: EntityDiscrepancyDto



\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPGET api/EntityDiscrepancyDto/GetDiscrepancies



\- Action: GetDiscrepancies

\- Return: List<EntityDiscrepancyDto>

\- Auth: None

\- Request parameters:

&#x20; - clientId : int (query/path)

&#x20; - entityName : int (query/path)

&#x20; - discrepancyType : int (query/path)



\---



\## Controller: NotificationController



\- Base route: api/v1



\### HTTPGET api/v1/textMessages



\- Action: GetTextMessages

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]

&#x20; - dateFromUTC : DateTime? (query/path) \[\[FromQuery]]

&#x20; - dateToUTC : DateTime? (query/path) \[\[FromQuery]]

&#x20; - includeEventMessages : bool (query/path) \[\[FromQuery]]

&#x20; - includeAppointmentMessages : bool (query/path) \[\[FromQuery]]



\---



\## Controller: LookupsController



\- Base route: api/v1



\### HTTPGET api/v1/localization/locale



\- Action: GetLanguages

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]



\### HTTPGET api/v1/localization/{languageCode}/module/{moduleCode}/text



\- Action: GetDisplayText

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]

&#x20; - languageCode : string (query/path)

&#x20; - moduleCode : int (query/path)



\### HTTPGET api/v1/theme/settings/module/{moduleCode}



\- Action: GetThemeSettings

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - moduleCode : string (query/path)

&#x20; - pageInfo : PageInfo (query/path) \[\[FromQuery]]



\### HTTPGET api/v1/resource/client/{clientCode}/logo



\- Action: GetClientLogo

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - clientCode : string (query/path)



\### HTTPGET api/v1/calendar/{calendarType}/confirmationCode/{confirmationCode}



\- Action: GetThirdPartyCalendar

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - calendarType : CalendarType (query/path)

&#x20; - confirmationCode : string (query/path)

&#x20; - messageType : MessageType (query/path) \[\[FromQuery]]



\### HTTPGET api/v1/client/urlcode/{urlCode}/webwidgeturl



\- Action: GetWebWidgetUrl

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - urlCode : string (query/path)



\---



\## Controller: InterviewBookingController



\- Base route: api/v1



\### HTTPGET api/v1/interviewBooking/{bookingCode}



\- Action: GetInterviewBookingByCode

\- Return: IActionResult

\- Auth: None

\- Request parameters:

&#x20; - bookingCode : string (query/path) \[\[FromRoute]]



\### HTTPPOST api/v1/interviewBooking



\- Action: CreateInterviewBooking

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - interviewBookingDto : InterviewBookingDto \[\[FromBody]]



\### HTTPPUT api/v1/interviewBooking/{bookingCode}



\- Action: UpdateInterviewBooking

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - bookingCode : string \[\[FromRoute]]

&#x20; - interviewBookingDto : InterviewBookingDto \[\[FromBody]]



\### HTTPPUT api/v1/interviewBooking/{bookingCode}/status/{status}



\- Action: UpdateInterviewBookingStatus

\- Return: async Task<IActionResult>

\- Auth: None

\- Request body:

&#x20; - bookingCode : string \[\[FromRoute]]

&#x20; - status : BookingStatus \[\[FromRoute]]



\### HTTPGET api/v1/interviewBooking/event/{eventCode}



\- Action: GetBookingForEvent

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - eventCode : string (query/path) \[\[FromRoute]]



\### HTTPGET api/v1/interviewBooking/{code}/calendar



\- Action: GetCalendarForBooking

\- Return: async Task<IActionResult>

\- Auth: None

\- Request parameters:

&#x20; - code : string (query/path) \[\[FromRoute]]

&#x20; - calendarType : string (query/path) \[\[FromQuery]]



\### HTTPPOST api/v1/Create



\- Action: Create

\- Return: async Task<ActionResult<long>>

\- Auth: Authorize

\- Request body:

&#x20; - command : CreateInterviewBookingCommand



\### HTTPPUT api/v1/{id}



\- Action: Update

\- Return: async Task<ActionResult>

\- Auth: \[Authorize]

\- Request body:

&#x20; - id : long

&#x20; - command : UpdateInterviewBookingCommand \[\[FromBody]]



\### HTTPPUT api/v1/\[action]



\- Action: Cancel

\- Return: async Task<ActionResult>

\- Auth: \[Authorize]

\- Request body:

&#x20; - id : long

&#x20; - command : CancelBookingCommand



\---



\## Controller: AccountController



\- Auth: \[Authorize]

\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPGET api/Account/GetUserInfo



\- Action: GetUserInfo

\- Return: UserInfo

\- Auth: \[Authorize]



\### HTTPPOST api/Account/Logout



\- Action: Logout

\- Return: IHttpActionResult

\- Auth: \[Authorize]



\### HTTPPOST api/Account/ForgotPassword



\- Action: ForgotPassword

\- Return: IHttpActionResult

\- Auth: \[Authorize]

\- Request body:

&#x20; - resetModel : ResetPasswordEmailBindingModel



\### HTTPPOST api/Account/ResetPassword



\- Action: ResetPassword

\- Return: IHttpActionResult

\- Auth: \[Authorize]

\- Request body:

&#x20; - model : SetPasswordBindingModel



\### HTTPPOST api/Account/ChangePassword



\- Action: ChangePassword

\- Return: IHttpActionResult

\- Auth: \[Authorize]

\- Request body:

&#x20; - model : ChangePasswordBindingModel



\### HTTPGET api/Account/GetClaimTypes



\- Action: GetClaimTypes

\- Return: Dictionary<string, string>

\- Auth: \[Authorize]



\### HTTPGET api/Account/UserLookup



\- Action: UserLookup

\- Return: SystemUserInfo

\- Auth: AllowAnonymous

\- Request parameters:

&#x20; - username : string (query/path)



\---



\## Controller: TokenData



\- Auth: \[Authorize]

\- Base route: api/{controller}/{action} (default WebApiConfig route)



\### HTTPPOST api/TokenData/CreateOidcToken



\- Action: CreateOidcToken

\- Return: async Task<IHttpActionResult>

\- Auth: AllowAnonymous

\- Request body:

&#x20; - token : TokenData \[\[FromBody]]



\---



\## Data Schemas



Identified BindingModel/Dto model count: 8



\### AppointmentDataDto



\- Defined in: D:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\GoogleReserve\\GoogleReserve.Domain.Model\\DataTransferModel\\Appointment\\AppointmentDataDto.cs



\- string Code

\- IdentifierDto Location

\- IdentifierDto StaffMember

\- string ConfirmationNumber

\- DateTime StartTimeUtc

\- DateTime EndTimeUtc

\- string Status

\- string Type

\- string CustomerFirstName

\- string CustomerLastName

\- string Email

\- string Phone

\- bool EmailReminder

\- bool SMSReminder

\- string CustomerNotes

\- string Comment

\- DateTime OltCheckInTimeUtc

\- bool SpanishRequested

\- bool IsPhoneAppointment

\- bool FloatAppointment

\- List<IdentifierDtoService> Services

\- bool DisableCancellation

\- bool FixedStaffMember

\- bool IsVirtualConference

\- string VirtualConferenceUrl

\- string VirtuallConferenceId

\- string VirtualConferencingProviderId

\- bool IsInPersonAppointment

\- string CreatedBy

\- string CancelationNotes

\- byte ActiveStatus



\### BankingBookingDto



\- Defined in: D:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Kronos.FMSI.OAC.EventBooking\\src\\Domain\\DataTransferModels\\BankingBookingDto.cs



\- string EventCode

\- int TimeSlotId

\- string UserFirstName

\- string UserLastName

\- string UserEmail

\- string UserContactNumber

\- bool SubscribeForTextMessageNotifications



\### BankingEventDto



\- Defined in: D:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Kronos.FMSI.OAC.EventBooking\\src\\Domain\\DataTransferModels\\BankingEventDto.cs



\- string Name

\- DateTime DateFrom

\- DateTime DateTo

\- bool ActiveStatus

\- int LocationId

\- int OwnerId

\- IList<int> EventConductorIds

\- string Code

\- int EventType

\- bool TriggerNotificationViaGraphApiMailFlow

\- IList<TimeSlotDto> Slots

\- bool ScheduledOnMonday

\- bool ScheduledOnTuesday

\- bool ScheduledOnWednesday

\- bool ScheduledOnThursday

\- bool ScheduledOnFriday

\- bool ScheduledOnSaturday

\- bool ScheduledOnSunday



\### ChangePasswordBindingModel



\- Defined in: D:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Oac\\Controllers\\AccountController.cs



\- string OldPassword

\- string NewPassword

\- string ConfirmPassword



\### IdentifierDto



\- Defined in: d:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Kronos.FMSI.OAC.AppointmentsAPI\\Models\\IdentifierDto.cs



\- string Code

\- string Name



\### IdentifierDtoService



\- Defined in: d:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Kronos.FMSI.OAC.AppointmentsAPI\\Models\\IdentifierDtoService.cs



\- int Id

\- string Code

\- string Name

\- string CheckListEnglish

\- string ChecklistSpanish



\### TimeSlotDto



\- Defined in: d:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Kronos.FMSI.OAC.AppointmentsAPI\\Availability\\V1\\Models\\TimeSlotDto.cs



\- DateTime StartTimeUtc



\### InterviewBookingDto



\- Defined in: D:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Kronos.FMSI.OAC.EventBooking\\src\\Domain\\DataTransferModels\\InterviewBookingDto.cs



\- string EventCode

\- int TimeSlotId

\- string UserFirstName

\- string UserLastName

\- string UserEmail

\- string UserContactNumber

\- bool SubscribeForTextMessageNotifications



\### InterviewEventDto



\- Defined in: D:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Kronos.FMSI.OAC.EventBooking\\src\\Domain\\DataTransferModels\\InterviewEventDto.cs



\- string Name

\- DateTime DateFrom

\- DateTime DateTo

\- bool ActiveStatus

\- int LocationId

\- int OwnerId

\- IList<int> EventConductorIds

\- string Code

\- int EventType

\- IList<TimeSlotDto> Slots

\- bool ScheduledOnMonday

\- bool ScheduledOnTuesday

\- bool ScheduledOnWednesday

\- bool ScheduledOnThursday

\- bool ScheduledOnFriday

\- bool ScheduledOnSaturday

\- bool ScheduledOnSunday

\- string JobPositionTitle

\- string JobRequisitionTitle

\- bool TriggerNotificationViaGraphApiMailFlow



\### ResetPasswordEmailBindingModel



\- Defined in: D:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Oac\\ViewModels\\SecurityModels.cs



\- string username



\### SetPasswordBindingModel



\- Defined in: D:\\UKG (FMSI) Project - starting from 2026-02\\AC repo\\AC\\Oac\\Oac\\ViewModels\\SecurityModels.cs



\- string ResetCode

\- string NewPassword

\- string ConfirmPassword



