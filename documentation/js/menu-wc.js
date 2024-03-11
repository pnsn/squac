'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">squac documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AlertViewComponent.html" data-type="entity-link" >AlertViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthComponent.html" data-type="entity-link" >AuthComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BudComponent.html" data-type="entity-link" >BudComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CalendarComponent.html" data-type="entity-link" >CalendarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelFilterComponent.html" data-type="entity-link" >ChannelFilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelGroupComponent.html" data-type="entity-link" >ChannelGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelGroupDetailComponent.html" data-type="entity-link" >ChannelGroupDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelGroupEditComponent.html" data-type="entity-link" >ChannelGroupEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelGroupFilterComponent.html" data-type="entity-link" >ChannelGroupFilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelGroupMapComponent.html" data-type="entity-link" >ChannelGroupMapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelGroupSelectorComponent.html" data-type="entity-link" >ChannelGroupSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelGroupTableComponent.html" data-type="entity-link" >ChannelGroupTableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChannelGroupViewComponent.html" data-type="entity-link" >ChannelGroupViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmDialogComponent.html" data-type="entity-link" >ConfirmDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CsvUploadComponent.html" data-type="entity-link" >CsvUploadComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardDetailComponent.html" data-type="entity-link" >DashboardDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardEditComponent.html" data-type="entity-link" >DashboardEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardEditEntryComponent.html" data-type="entity-link" >DashboardEditEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardViewComponent.html" data-type="entity-link" >DashboardViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DataTypeSelectorComponent.html" data-type="entity-link" >DataTypeSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DateSelectComponent.html" data-type="entity-link" >DateSelectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetailPageComponent.html" data-type="entity-link" >DetailPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EChartComponent.html" data-type="entity-link" >EChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ErrorComponent.html" data-type="entity-link" >ErrorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ErrorComponent-1.html" data-type="entity-link" >ErrorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GenericWidgetComponent.html" data-type="entity-link" >GenericWidgetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingComponent.html" data-type="entity-link" >LoadingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingOverlayComponent.html" data-type="entity-link" >LoadingOverlayComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingSpinnerComponent.html" data-type="entity-link" >LoadingSpinnerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MapComponent.html" data-type="entity-link" >MapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MatchingRuleEditComponent.html" data-type="entity-link" >MatchingRuleEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MenuComponent.html" data-type="entity-link" >MenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MetricComponent.html" data-type="entity-link" >MetricComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MetricEditComponent.html" data-type="entity-link" >MetricEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MetricEditEntryComponent.html" data-type="entity-link" >MetricEditEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MetricToggleComponent.html" data-type="entity-link" >MetricToggleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MetricViewComponent.html" data-type="entity-link" >MetricViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MonitorAlarmStatusComponent.html" data-type="entity-link" >MonitorAlarmStatusComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MonitorChannelHistoryChartComponent.html" data-type="entity-link" >MonitorChannelHistoryChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MonitorComponent.html" data-type="entity-link" >MonitorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MonitorDetailComponent.html" data-type="entity-link" >MonitorDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MonitorEditComponent.html" data-type="entity-link" >MonitorEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MonitorEditEntryComponent.html" data-type="entity-link" >MonitorEditEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MonitorHistoryChartComponent.html" data-type="entity-link" >MonitorHistoryChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MonitorViewComponent.html" data-type="entity-link" >MonitorViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrganizationDetailComponent.html" data-type="entity-link" >OrganizationDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrganizationEditComponent.html" data-type="entity-link" >OrganizationEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrganizationEditEntryComponent.html" data-type="entity-link" >OrganizationEditEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrganizationsViewComponent.html" data-type="entity-link" >OrganizationsViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ParallelPlotComponent.html" data-type="entity-link" >ParallelPlotComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordResetComponent.html" data-type="entity-link" >PasswordResetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ScatterPlotComponent.html" data-type="entity-link" >ScatterPlotComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchFilterComponent.html" data-type="entity-link" >SearchFilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SharedIndicatorComponent.html" data-type="entity-link" >SharedIndicatorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SharingToggleComponent.html" data-type="entity-link" >SharingToggleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TableViewComponent.html" data-type="entity-link" >TableViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TabularComponent.html" data-type="entity-link" >TabularComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TimechartComponent.html" data-type="entity-link" >TimechartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TimelineComponent.html" data-type="entity-link" >TimelineComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TooltipComponent.html" data-type="entity-link" >TooltipComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserComponent.html" data-type="entity-link" >UserComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserEditComponent.html" data-type="entity-link" >UserEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserSettingsComponent.html" data-type="entity-link" >UserSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WidgetDetailComponent.html" data-type="entity-link" >WidgetDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WidgetEditComponent.html" data-type="entity-link" >WidgetEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WidgetEditEntryComponent.html" data-type="entity-link" >WidgetEditEntryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WidgetEditInfoComponent.html" data-type="entity-link" >WidgetEditInfoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WidgetEditMetricsComponent.html" data-type="entity-link" >WidgetEditMetricsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WidgetEditOptionsComponent.html" data-type="entity-link" >WidgetEditOptionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WidgetMainComponent.html" data-type="entity-link" >WidgetMainComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/LoadingDirective.html" data-type="entity-link" >LoadingDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/TooltipDirective.html" data-type="entity-link" >TooltipDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/WidgetTypeDirective.html" data-type="entity-link" >WidgetTypeDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/WidgetTypeExampleDirective.html" data-type="entity-link" >WidgetTypeExampleDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AggregateListParams.html" data-type="entity-link" >AggregateListParams</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseReadOnlyApiService.html" data-type="entity-link" >BaseReadOnlyApiService</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseWriteableApiService.html" data-type="entity-link" >BaseWriteableApiService</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpCache.html" data-type="entity-link" >HttpCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReadOnlyResourceModel.html" data-type="entity-link" >ReadOnlyResourceModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceModel.html" data-type="entity-link" >ResourceModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Widget.html" data-type="entity-link" >Widget</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AggregateService.html" data-type="entity-link" >AggregateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AlertService.html" data-type="entity-link" >AlertService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChannelGroupService.html" data-type="entity-link" >ChannelGroupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChannelService.html" data-type="entity-link" >ChannelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfirmDialogService.html" data-type="entity-link" >ConfirmDialogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardService.html" data-type="entity-link" >DashboardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DateService.html" data-type="entity-link" >DateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DayArchiveService.html" data-type="entity-link" >DayArchiveService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FakeMeasurementBackend.html" data-type="entity-link" >FakeMeasurementBackend</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HourArchiveService.html" data-type="entity-link" >HourArchiveService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpCacheService.html" data-type="entity-link" >HttpCacheService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InviteService.html" data-type="entity-link" >InviteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStorageService.html" data-type="entity-link" >LocalStorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MatchingRuleService.html" data-type="entity-link" >MatchingRuleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MeasurementService.html" data-type="entity-link" >MeasurementService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageService.html" data-type="entity-link" >MessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MetricService.html" data-type="entity-link" >MetricService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MonitorService.html" data-type="entity-link" >MonitorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MonthArchiveService.html" data-type="entity-link" >MonthArchiveService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NetworkService.html" data-type="entity-link" >NetworkService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrganizationService.html" data-type="entity-link" >OrganizationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrganizationUserService.html" data-type="entity-link" >OrganizationUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PasswordResetService.html" data-type="entity-link" >PasswordResetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TriggerService.html" data-type="entity-link" >TriggerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserMeService.html" data-type="entity-link" >UserMeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ViewService.html" data-type="entity-link" >ViewService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeekArchiveService.html" data-type="entity-link" >WeekArchiveService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WidgetConfigService.html" data-type="entity-link" >WidgetConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WidgetConnectService.html" data-type="entity-link" >WidgetConnectService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WidgetDataService.html" data-type="entity-link" >WidgetDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WidgetManagerService.html" data-type="entity-link" >WidgetManagerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WidgetService.html" data-type="entity-link" >WidgetService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AlertResolver.html" data-type="entity-link" >AlertResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ChannelGroupResolver.html" data-type="entity-link" >ChannelGroupResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/DashboardResolver.html" data-type="entity-link" >DashboardResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/LoggedInGuard.html" data-type="entity-link" >LoggedInGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/MatchingRuleResolver.html" data-type="entity-link" >MatchingRuleResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MetricResolver.html" data-type="entity-link" >MetricResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MonitorResolver.html" data-type="entity-link" >MonitorResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/OrganizationResolver.html" data-type="entity-link" >OrganizationResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/UserResolver.html" data-type="entity-link" >UserResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/WidgetResolver.html" data-type="entity-link" >WidgetResolver</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ArchiveTypeOption.html" data-type="entity-link" >ArchiveTypeOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BreachingChannel.html" data-type="entity-link" >BreachingChannel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChannelData.html" data-type="entity-link" >ChannelData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChannelData-1.html" data-type="entity-link" >ChannelData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChannelData-2.html" data-type="entity-link" >ChannelData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChannelData-3.html" data-type="entity-link" >ChannelData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChannelGroupForm.html" data-type="entity-link" >ChannelGroupForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChannelRow.html" data-type="entity-link" >ChannelRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Color.html" data-type="entity-link" >Color</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColorGradientOption.html" data-type="entity-link" >ColorGradientOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfirmDialogOptions.html" data-type="entity-link" >ConfirmDialogOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContinousVisualMapOption.html" data-type="entity-link" >ContinousVisualMapOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateParams.html" data-type="entity-link" >CreateParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomGradientOption.html" data-type="entity-link" >CustomGradientOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardConfig.html" data-type="entity-link" >DashboardConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardDisplayProperties.html" data-type="entity-link" >DashboardDisplayProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardForm.html" data-type="entity-link" >DashboardForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardProperties.html" data-type="entity-link" >DashboardProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataParams.html" data-type="entity-link" >DataParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteParams.html" data-type="entity-link" >DeleteParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteService.html" data-type="entity-link" >DeleteService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterText.html" data-type="entity-link" >FilterText</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Group.html" data-type="entity-link" >Group</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpOptions.html" data-type="entity-link" >HttpOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListService.html" data-type="entity-link" >ListService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Locale.html" data-type="entity-link" >Locale</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginForm.html" data-type="entity-link" >LoginForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapBounds.html" data-type="entity-link" >MapBounds</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapStation.html" data-type="entity-link" >MapStation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MatchingRoute.html" data-type="entity-link" >MatchingRoute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MatchingRuleForm.html" data-type="entity-link" >MatchingRuleForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MatchingRulesForm.html" data-type="entity-link" >MatchingRulesForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetricForm.html" data-type="entity-link" >MetricForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MonitorForm.html" data-type="entity-link" >MonitorForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OptionForm.html" data-type="entity-link" >OptionForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Options.html" data-type="entity-link" >Options</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OptionsForm.html" data-type="entity-link" >OptionsForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageOptions.html" data-type="entity-link" >PageOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PartialUpdateParams.html" data-type="entity-link" >PartialUpdateParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PartialUpdateService.html" data-type="entity-link" >PartialUpdateService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PasswordsForm.html" data-type="entity-link" >PasswordsForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PiecewiseVisualMapOption.html" data-type="entity-link" >PiecewiseVisualMapOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadOnlyAggregateSerializer.html" data-type="entity-link" >ReadOnlyAggregateSerializer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadOnlyApiService.html" data-type="entity-link" >ReadOnlyApiService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadParams.html" data-type="entity-link" >ReadParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadSerializer.html" data-type="entity-link" >ReadSerializer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadService.html" data-type="entity-link" >ReadService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadUpdateApiService.html" data-type="entity-link" >ReadUpdateApiService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResourceLink.html" data-type="entity-link" >ResourceLink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Row.html" data-type="entity-link" >Row</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RowData.html" data-type="entity-link" >RowData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RowMetric.html" data-type="entity-link" >RowMetric</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchFilter.html" data-type="entity-link" >SearchFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchFilterConfig.html" data-type="entity-link" >SearchFilterConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchProps.html" data-type="entity-link" >SearchProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SharedToggleFilter.html" data-type="entity-link" >SharedToggleFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SolidColorOption.html" data-type="entity-link" >SolidColorOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SquacApiService.html" data-type="entity-link" >SquacApiService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StationData.html" data-type="entity-link" >StationData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StationData-1.html" data-type="entity-link" >StationData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StationRow.html" data-type="entity-link" >StationRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StoplightVisualMapOption.html" data-type="entity-link" >StoplightVisualMapOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableColumn.html" data-type="entity-link" >TableColumn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableControls.html" data-type="entity-link" >TableControls</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableFilters.html" data-type="entity-link" >TableFilters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableLink.html" data-type="entity-link" >TableLink</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableMenuConfig.html" data-type="entity-link" >TableMenuConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableMenuOptionConfig.html" data-type="entity-link" >TableMenuOptionConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableMessages.html" data-type="entity-link" >TableMessages</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableOptions.html" data-type="entity-link" >TableOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Threshold.html" data-type="entity-link" >Threshold</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThresholdForm.html" data-type="entity-link" >ThresholdForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimePeriod.html" data-type="entity-link" >TimePeriod</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimeRange.html" data-type="entity-link" >TimeRange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TitleButtons.html" data-type="entity-link" >TitleButtons</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TriggerForm.html" data-type="entity-link" >TriggerForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateParams.html" data-type="entity-link" >UpdateParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateService.html" data-type="entity-link" >UpdateService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserForm.html" data-type="entity-link" >UserForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserForm-1.html" data-type="entity-link" >UserForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserForm-2.html" data-type="entity-link" >UserForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VisualMapBase.html" data-type="entity-link" >VisualMapBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VisualPiece.html" data-type="entity-link" >VisualPiece</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetConfig.html" data-type="entity-link" >WidgetConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetDisplayOption.html" data-type="entity-link" >WidgetDisplayOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetDisplayProperties.html" data-type="entity-link" >WidgetDisplayProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetForm.html" data-type="entity-link" >WidgetForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetGridsterItem.html" data-type="entity-link" >WidgetGridsterItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetLayout.html" data-type="entity-link" >WidgetLayout</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetProperties.html" data-type="entity-link" >WidgetProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WidgetTypeComponent.html" data-type="entity-link" >WidgetTypeComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WriteableApiService.html" data-type="entity-link" >WriteableApiService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WriteOnlyUserSerializer.html" data-type="entity-link" >WriteOnlyUserSerializer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WriteService.html" data-type="entity-link" >WriteService</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/DataTypePipe.html" data-type="entity-link" >DataTypePipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/GuardTypePipe.html" data-type="entity-link" >GuardTypePipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/MeasurementPipe.html" data-type="entity-link" >MeasurementPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/OrganizationPipe.html" data-type="entity-link" >OrganizationPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/PrecisionPipe.html" data-type="entity-link" >PrecisionPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/UserPipe.html" data-type="entity-link" >UserPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});