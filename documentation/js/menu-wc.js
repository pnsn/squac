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
                    <a href="index.html" data-type="index-link">squac-ui documentation</a>
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
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-63efcc8c1a07ae955a855aeb2366458b7c822bb06c2bd20d1252fcff9a7aee6092e316e9233d2f3515f00c5cb7e7bd69fa14a81f30630bcdcb14f21171676951"' : 'data-target="#xs-components-links-module-AppModule-63efcc8c1a07ae955a855aeb2366458b7c822bb06c2bd20d1252fcff9a7aee6092e316e9233d2f3515f00c5cb7e7bd69fa14a81f30630bcdcb14f21171676951"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-63efcc8c1a07ae955a855aeb2366458b7c822bb06c2bd20d1252fcff9a7aee6092e316e9233d2f3515f00c5cb7e7bd69fa14a81f30630bcdcb14f21171676951"' :
                                            'id="xs-components-links-module-AppModule-63efcc8c1a07ae955a855aeb2366458b7c822bb06c2bd20d1252fcff9a7aee6092e316e9233d2f3515f00c5cb7e7bd69fa14a81f30630bcdcb14f21171676951"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AuthComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ChannelGroupModule.html" data-type="entity-link" >ChannelGroupModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ChannelGroupModule-eb95177228de6f3c4a31820e331745e2afb8da4cf22ad84774112d107644ee4fdcb5e6edd3f181b9d349edef789d4f8c1c6ed5de34961751979c12ca3a7bc925"' : 'data-target="#xs-components-links-module-ChannelGroupModule-eb95177228de6f3c4a31820e331745e2afb8da4cf22ad84774112d107644ee4fdcb5e6edd3f181b9d349edef789d4f8c1c6ed5de34961751979c12ca3a7bc925"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ChannelGroupModule-eb95177228de6f3c4a31820e331745e2afb8da4cf22ad84774112d107644ee4fdcb5e6edd3f181b9d349edef789d4f8c1c6ed5de34961751979c12ca3a7bc925"' :
                                            'id="xs-components-links-module-ChannelGroupModule-eb95177228de6f3c4a31820e331745e2afb8da4cf22ad84774112d107644ee4fdcb5e6edd3f181b9d349edef789d4f8c1c6ed5de34961751979c12ca3a7bc925"' }>
                                            <li class="link">
                                                <a href="components/ChannelGroupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelGroupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChannelGroupDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelGroupDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChannelGroupEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelGroupEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChannelGroupFilterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelGroupFilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChannelGroupMapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelGroupMapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChannelGroupTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelGroupTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChannelGroupViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelGroupViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CsvUploadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CsvUploadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MatchingRuleEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MatchingRuleEditComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChannelGroupRoutingModule.html" data-type="entity-link" >ChannelGroupRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link" >DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DashboardModule-f797c70ca1ba5d724423d6cded05f4a5c7fd15c7c0d4beecaf47cd6d60d77bea591f2e5a2dfa7292dac6cc92456b82319450f5bcb3fe3a39241cfba35afbbafa"' : 'data-target="#xs-components-links-module-DashboardModule-f797c70ca1ba5d724423d6cded05f4a5c7fd15c7c0d4beecaf47cd6d60d77bea591f2e5a2dfa7292dac6cc92456b82319450f5bcb3fe3a39241cfba35afbbafa"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-f797c70ca1ba5d724423d6cded05f4a5c7fd15c7c0d4beecaf47cd6d60d77bea591f2e5a2dfa7292dac6cc92456b82319450f5bcb3fe3a39241cfba35afbbafa"' :
                                            'id="xs-components-links-module-DashboardModule-f797c70ca1ba5d724423d6cded05f4a5c7fd15c7c0d4beecaf47cd6d60d77bea591f2e5a2dfa7292dac6cc92456b82319450f5bcb3fe3a39241cfba35afbbafa"' }>
                                            <li class="link">
                                                <a href="components/ChannelFilterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelFilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardEditEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardEditEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataTypeSelectorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataTypeSelectorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardRoutingModule.html" data-type="entity-link" >DashboardRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link" >MaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MetricModule.html" data-type="entity-link" >MetricModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MetricModule-6587af925727fe198e50841655c97bb669064b60b7a1363eca091517c9c05c000c04e696b0f6f7713529aa8c791ed2623f420ed4781e1e685039df6961dfdc3c"' : 'data-target="#xs-components-links-module-MetricModule-6587af925727fe198e50841655c97bb669064b60b7a1363eca091517c9c05c000c04e696b0f6f7713529aa8c791ed2623f420ed4781e1e685039df6961dfdc3c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MetricModule-6587af925727fe198e50841655c97bb669064b60b7a1363eca091517c9c05c000c04e696b0f6f7713529aa8c791ed2623f420ed4781e1e685039df6961dfdc3c"' :
                                            'id="xs-components-links-module-MetricModule-6587af925727fe198e50841655c97bb669064b60b7a1363eca091517c9c05c000c04e696b0f6f7713529aa8c791ed2623f420ed4781e1e685039df6961dfdc3c"' }>
                                            <li class="link">
                                                <a href="components/MetricComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetricComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MetricEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetricEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MetricEditEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetricEditEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MetricViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetricViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MetricRoutingModule.html" data-type="entity-link" >MetricRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MonitorModule.html" data-type="entity-link" >MonitorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MonitorModule-7fd605c9f05ff1ca1db035e58da822168273ed5e4f625dadebb2cbf773369e3aa11199b21ff5b7203cd1a2e33cbd9c10be50029bb6f5252a47939c79ec92b349"' : 'data-target="#xs-components-links-module-MonitorModule-7fd605c9f05ff1ca1db035e58da822168273ed5e4f625dadebb2cbf773369e3aa11199b21ff5b7203cd1a2e33cbd9c10be50029bb6f5252a47939c79ec92b349"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MonitorModule-7fd605c9f05ff1ca1db035e58da822168273ed5e4f625dadebb2cbf773369e3aa11199b21ff5b7203cd1a2e33cbd9c10be50029bb6f5252a47939c79ec92b349"' :
                                            'id="xs-components-links-module-MonitorModule-7fd605c9f05ff1ca1db035e58da822168273ed5e4f625dadebb2cbf773369e3aa11199b21ff5b7203cd1a2e33cbd9c10be50029bb6f5252a47939c79ec92b349"' }>
                                            <li class="link">
                                                <a href="components/AlertViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlertViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MonitorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MonitorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MonitorEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MonitorEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MonitorEditEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MonitorEditEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MonitorViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MonitorViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MonitorRoutingModule.html" data-type="entity-link" >MonitorRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' : 'data-target="#xs-components-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' :
                                            'id="xs-components-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' }>
                                            <li class="link">
                                                <a href="components/ChannelGroupSelectorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChannelGroupSelectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DateSelectComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DateSelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErrorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoadingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoadingOverlayComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingOverlayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoadingSpinnerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingSpinnerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchFilterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchFilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SharedIndicatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SharedIndicatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SnackbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SnackbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' : 'data-target="#xs-directives-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' :
                                        'id="xs-directives-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' }>
                                        <li class="link">
                                            <a href="directives/LoadingDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' : 'data-target="#xs-pipes-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' :
                                            'id="xs-pipes-links-module-SharedModule-a0560bd46d4cfc3515f380ccadc1e10a4c7f4a861641c6c574d98988ac36737922893448b138dba98899cef8c1fee2a8b95231ebe3815f455e5f83c1c11daae8"' }>
                                            <li class="link">
                                                <a href="pipes/PrecisionPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrecisionPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ReplacePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReplacePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SquacapiModule.html" data-type="entity-link" >SquacapiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SquacapiModule-bfd07faf21431a9aa6a738bece71b7ff8b02fccf0d0b2b813e4b82c8a4bd15a08a9216a1076f8365801e5382a636d3dd2ac28873051134f10a4217b1befcdcd5"' : 'data-target="#xs-pipes-links-module-SquacapiModule-bfd07faf21431a9aa6a738bece71b7ff8b02fccf0d0b2b813e4b82c8a4bd15a08a9216a1076f8365801e5382a636d3dd2ac28873051134f10a4217b1befcdcd5"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SquacapiModule-bfd07faf21431a9aa6a738bece71b7ff8b02fccf0d0b2b813e4b82c8a4bd15a08a9216a1076f8365801e5382a636d3dd2ac28873051134f10a4217b1befcdcd5"' :
                                            'id="xs-pipes-links-module-SquacapiModule-bfd07faf21431a9aa6a738bece71b7ff8b02fccf0d0b2b813e4b82c8a4bd15a08a9216a1076f8365801e5382a636d3dd2ac28873051134f10a4217b1befcdcd5"' }>
                                            <li class="link">
                                                <a href="pipes/MeasurementPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MeasurementPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/OrganizationPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrganizationPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/UserPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UserModule-9a7905a0e1eb8244d3fa3957ed234f0a048c67f05c604bce2c47f7b49704234a91e24ebd9e070fefd389bb95e0e95f12f182fba9e0c9804fe906b4ad5478c424"' : 'data-target="#xs-components-links-module-UserModule-9a7905a0e1eb8244d3fa3957ed234f0a048c67f05c604bce2c47f7b49704234a91e24ebd9e070fefd389bb95e0e95f12f182fba9e0c9804fe906b4ad5478c424"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UserModule-9a7905a0e1eb8244d3fa3957ed234f0a048c67f05c604bce2c47f7b49704234a91e24ebd9e070fefd389bb95e0e95f12f182fba9e0c9804fe906b4ad5478c424"' :
                                            'id="xs-components-links-module-UserModule-9a7905a0e1eb8244d3fa3957ed234f0a048c67f05c604bce2c47f7b49704234a91e24ebd9e070fefd389bb95e0e95f12f182fba9e0c9804fe906b4ad5478c424"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrganizationDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrganizationDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrganizationEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrganizationEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrganizationEditEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrganizationEditEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrganizationsViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrganizationsViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordResetComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PasswordResetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserSettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserRoutingModule.html" data-type="entity-link" >UserRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/WidgetModule.html" data-type="entity-link" >WidgetModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WidgetModule-d67de9666ba3f0ed3fd92139c3c4e59cc848c5406e80843c3e75ecd9261b0f499dad4a6df3ff945aac4e1389987a6f1c9d2d889ef8d575daf126b3cef2eb445f"' : 'data-target="#xs-components-links-module-WidgetModule-d67de9666ba3f0ed3fd92139c3c4e59cc848c5406e80843c3e75ecd9261b0f499dad4a6df3ff945aac4e1389987a6f1c9d2d889ef8d575daf126b3cef2eb445f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WidgetModule-d67de9666ba3f0ed3fd92139c3c4e59cc848c5406e80843c3e75ecd9261b0f499dad4a6df3ff945aac4e1389987a6f1c9d2d889ef8d575daf126b3cef2eb445f"' :
                                            'id="xs-components-links-module-WidgetModule-d67de9666ba3f0ed3fd92139c3c4e59cc848c5406e80843c3e75ecd9261b0f499dad4a6df3ff945aac4e1389987a6f1c9d2d889ef8d575daf126b3cef2eb445f"' }>
                                            <li class="link">
                                                <a href="components/BoxPlotComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BoxPlotComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalendarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalendarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MetricToggleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetricToggleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ParallelPlotComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParallelPlotComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScatterPlotComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScatterPlotComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabularComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabularComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimechartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimechartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimelineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimelineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WidgetDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WidgetEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WidgetEditEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetEditEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WidgetEditInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetEditInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WidgetEditMetricsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetEditMetricsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WidgetEditOptionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetEditOptionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WidgetMainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetMainComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-WidgetModule-d67de9666ba3f0ed3fd92139c3c4e59cc848c5406e80843c3e75ecd9261b0f499dad4a6df3ff945aac4e1389987a6f1c9d2d889ef8d575daf126b3cef2eb445f"' : 'data-target="#xs-directives-links-module-WidgetModule-d67de9666ba3f0ed3fd92139c3c4e59cc848c5406e80843c3e75ecd9261b0f499dad4a6df3ff945aac4e1389987a6f1c9d2d889ef8d575daf126b3cef2eb445f"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-WidgetModule-d67de9666ba3f0ed3fd92139c3c4e59cc848c5406e80843c3e75ecd9261b0f499dad4a6df3ff945aac4e1389987a6f1c9d2d889ef8d575daf126b3cef2eb445f"' :
                                        'id="xs-directives-links-module-WidgetModule-d67de9666ba3f0ed3fd92139c3c4e59cc848c5406e80843c3e75ecd9261b0f499dad4a6df3ff945aac4e1389987a6f1c9d2d889ef8d575daf126b3cef2eb445f"' }>
                                        <li class="link">
                                            <a href="directives/WidgetTypeDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetTypeDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/WidgetTypeExampleDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetTypeExampleDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/EChartComponent.html" data-type="entity-link" >EChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GenericWidgetComponent.html" data-type="entity-link" >GenericWidgetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MenuComponent.html" data-type="entity-link" >MenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OrganizationDetailComponent.html" data-type="entity-link" >OrganizationDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordResetComponent.html" data-type="entity-link" >PasswordResetComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserComponent.html" data-type="entity-link" >UserComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserEditComponent.html" data-type="entity-link" >UserEditComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Aggregate.html" data-type="entity-link" >Aggregate</a>
                            </li>
                            <li class="link">
                                <a href="classes/AggregateListParams.html" data-type="entity-link" >AggregateListParams</a>
                            </li>
                            <li class="link">
                                <a href="classes/Alert.html" data-type="entity-link" >Alert</a>
                            </li>
                            <li class="link">
                                <a href="classes/Archive.html" data-type="entity-link" >Archive</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseApiService.html" data-type="entity-link" >BaseApiService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Channel.html" data-type="entity-link" >Channel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChannelGroup.html" data-type="entity-link" >ChannelGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/Dashboard.html" data-type="entity-link" >Dashboard</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpCache.html" data-type="entity-link" >HttpCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/MatchingRule.html" data-type="entity-link" >MatchingRule</a>
                            </li>
                            <li class="link">
                                <a href="classes/Measurement.html" data-type="entity-link" >Measurement</a>
                            </li>
                            <li class="link">
                                <a href="classes/Metric.html" data-type="entity-link" >Metric</a>
                            </li>
                            <li class="link">
                                <a href="classes/Monitor.html" data-type="entity-link" >Monitor</a>
                            </li>
                            <li class="link">
                                <a href="classes/Network.html" data-type="entity-link" >Network</a>
                            </li>
                            <li class="link">
                                <a href="classes/Organization.html" data-type="entity-link" >Organization</a>
                            </li>
                            <li class="link">
                                <a href="classes/Threshold.html" data-type="entity-link" >Threshold</a>
                            </li>
                            <li class="link">
                                <a href="classes/Trigger.html" data-type="entity-link" >Trigger</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/Widget.html" data-type="entity-link" >Widget</a>
                            </li>
                            <li class="link">
                                <a href="classes/WidgetDisplayOption.html" data-type="entity-link" >WidgetDisplayOption</a>
                            </li>
                            <li class="link">
                                <a href="classes/WidgetType.html" data-type="entity-link" >WidgetType</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AggregateAdapter.html" data-type="entity-link" >AggregateAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AggregateService.html" data-type="entity-link" >AggregateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AlertAdapter.html" data-type="entity-link" >AlertAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AlertService.html" data-type="entity-link" >AlertService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ArchiveAdapter.html" data-type="entity-link" >ArchiveAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChannelAdapter.html" data-type="entity-link" >ChannelAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChannelGroupAdapter.html" data-type="entity-link" >ChannelGroupAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChannelGroupService.html" data-type="entity-link" >ChannelGroupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChannelService.html" data-type="entity-link" >ChannelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigurationService.html" data-type="entity-link" >ConfigurationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfirmDialogService.html" data-type="entity-link" >ConfirmDialogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardAdapter.html" data-type="entity-link" >DashboardAdapter</a>
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
                                    <a href="injectables/MatchingRuleAdapter.html" data-type="entity-link" >MatchingRuleAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MatchingRuleService.html" data-type="entity-link" >MatchingRuleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MeasurementAdapter.html" data-type="entity-link" >MeasurementAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MeasurementService.html" data-type="entity-link" >MeasurementService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MessageService.html" data-type="entity-link" >MessageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MetricAdapter.html" data-type="entity-link" >MetricAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MetricService.html" data-type="entity-link" >MetricService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MonitorAdapter.html" data-type="entity-link" >MonitorAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MonitorService.html" data-type="entity-link" >MonitorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MonthArchiveService.html" data-type="entity-link" >MonthArchiveService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NetworkAdapter.html" data-type="entity-link" >NetworkAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NetworkService.html" data-type="entity-link" >NetworkService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrganizationAdapter.html" data-type="entity-link" >OrganizationAdapter</a>
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
                                    <a href="injectables/TriggerAdapter.html" data-type="entity-link" >TriggerAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TriggerService.html" data-type="entity-link" >TriggerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserAdapter.html" data-type="entity-link" >UserAdapter</a>
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
                                    <a href="injectables/WidgetAdapter.html" data-type="entity-link" >WidgetAdapter</a>
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
                                <li class="link">
                                    <a href="injectables/WidgetTypeService.html" data-type="entity-link" >WidgetTypeService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/CacheInterceptor.html" data-type="entity-link" >CacheInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/HttpErrorInterceptor.html" data-type="entity-link" >HttpErrorInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
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
                                <a href="guards/MetricResolver.html" data-type="entity-link" >MetricResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MonitorResolver.html" data-type="entity-link" >MonitorResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/OrganizationResolver.html" data-type="entity-link" >OrganizationResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/PermissionGuard.html" data-type="entity-link" >PermissionGuard</a>
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
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Adapter.html" data-type="entity-link" >Adapter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfirmDialogOptions.html" data-type="entity-link" >ConfirmDialogOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardProperties.html" data-type="entity-link" >DashboardProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardResolved.html" data-type="entity-link" >DashboardResolved</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteService.html" data-type="entity-link" >DeleteService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListService.html" data-type="entity-link" >ListService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapBounds.html" data-type="entity-link" >MapBounds</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadAggregate.html" data-type="entity-link" >ReadAggregate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadOnlyApiService.html" data-type="entity-link" >ReadOnlyApiService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadService.html" data-type="entity-link" >ReadService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReadUpdateApiService.html" data-type="entity-link" >ReadUpdateApiService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SquacApiService.html" data-type="entity-link" >SquacApiService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SquacObject.html" data-type="entity-link" >SquacObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateService.html" data-type="entity-link" >UpdateService</a>
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
                                <a href="interfaces/WriteService.html" data-type="entity-link" >WriteService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
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
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});