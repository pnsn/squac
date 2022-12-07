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
                                            'data-target="#components-links-module-AppModule-4714935af9600a77beb4128341ac9bb1b5d2e2cede92153dee6f1f41d190c50d0654126f4c77ee4e3fb813ec71e9d31f141048fc0d8fcca993a22d448cea39dd"' : 'data-target="#xs-components-links-module-AppModule-4714935af9600a77beb4128341ac9bb1b5d2e2cede92153dee6f1f41d190c50d0654126f4c77ee4e3fb813ec71e9d31f141048fc0d8fcca993a22d448cea39dd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-4714935af9600a77beb4128341ac9bb1b5d2e2cede92153dee6f1f41d190c50d0654126f4c77ee4e3fb813ec71e9d31f141048fc0d8fcca993a22d448cea39dd"' :
                                            'id="xs-components-links-module-AppModule-4714935af9600a77beb4128341ac9bb1b5d2e2cede92153dee6f1f41d190c50d0654126f4c77ee4e3fb813ec71e9d31f141048fc0d8fcca993a22d448cea39dd"' }>
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
                                <a href="modules/CalendarModule.html" data-type="entity-link" >CalendarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CalendarModule-8856e7073d20d2c792b5c44b8891c39f9d691788f60b4c584baff43bfe0f95711a92452c96517548f1c10c625573ad475bb837c664bc77046ccbfd993789c7ab"' : 'data-target="#xs-components-links-module-CalendarModule-8856e7073d20d2c792b5c44b8891c39f9d691788f60b4c584baff43bfe0f95711a92452c96517548f1c10c625573ad475bb837c664bc77046ccbfd993789c7ab"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CalendarModule-8856e7073d20d2c792b5c44b8891c39f9d691788f60b4c584baff43bfe0f95711a92452c96517548f1c10c625573ad475bb837c664bc77046ccbfd993789c7ab"' :
                                            'id="xs-components-links-module-CalendarModule-8856e7073d20d2c792b5c44b8891c39f9d691788f60b4c584baff43bfe0f95711a92452c96517548f1c10c625573ad475bb837c664bc77046ccbfd993789c7ab"' }>
                                            <li class="link">
                                                <a href="components/CalendarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalendarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
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
                                            'data-target="#components-links-module-DashboardModule-448bfbe2c6d6f37b27288c3391ab3d6d7056dc0e2ab8bc78c3a88b71bc9ad0f9740a7b6e931170e7f3271a59cb0beaac02abd99a33463f099900bb294ead3d17"' : 'data-target="#xs-components-links-module-DashboardModule-448bfbe2c6d6f37b27288c3391ab3d6d7056dc0e2ab8bc78c3a88b71bc9ad0f9740a7b6e931170e7f3271a59cb0beaac02abd99a33463f099900bb294ead3d17"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-448bfbe2c6d6f37b27288c3391ab3d6d7056dc0e2ab8bc78c3a88b71bc9ad0f9740a7b6e931170e7f3271a59cb0beaac02abd99a33463f099900bb294ead3d17"' :
                                            'id="xs-components-links-module-DashboardModule-448bfbe2c6d6f37b27288c3391ab3d6d7056dc0e2ab8bc78c3a88b71bc9ad0f9740a7b6e931170e7f3271a59cb0beaac02abd99a33463f099900bb294ead3d17"' }>
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
                                            <li class="link">
                                                <a href="components/MetricToggleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetricToggleComponent</a>
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
                                        'data-target="#directives-links-module-DashboardModule-448bfbe2c6d6f37b27288c3391ab3d6d7056dc0e2ab8bc78c3a88b71bc9ad0f9740a7b6e931170e7f3271a59cb0beaac02abd99a33463f099900bb294ead3d17"' : 'data-target="#xs-directives-links-module-DashboardModule-448bfbe2c6d6f37b27288c3391ab3d6d7056dc0e2ab8bc78c3a88b71bc9ad0f9740a7b6e931170e7f3271a59cb0beaac02abd99a33463f099900bb294ead3d17"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-DashboardModule-448bfbe2c6d6f37b27288c3391ab3d6d7056dc0e2ab8bc78c3a88b71bc9ad0f9740a7b6e931170e7f3271a59cb0beaac02abd99a33463f099900bb294ead3d17"' :
                                        'id="xs-directives-links-module-DashboardModule-448bfbe2c6d6f37b27288c3391ab3d6d7056dc0e2ab8bc78c3a88b71bc9ad0f9740a7b6e931170e7f3271a59cb0beaac02abd99a33463f099900bb294ead3d17"' }>
                                        <li class="link">
                                            <a href="directives/WidgetTypeExampleDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetTypeExampleDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardRoutingModule.html" data-type="entity-link" >DashboardRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MapModule.html" data-type="entity-link" >MapModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MapModule-af13e1a7cbe934ed8a37b95b90c372ba589bcc3e45ae8f3c2f81692516c13b1d83a1be29e42f679d5e730994faeab35ad96f22d4cfd354f1e16a630b0a28c3eb"' : 'data-target="#xs-components-links-module-MapModule-af13e1a7cbe934ed8a37b95b90c372ba589bcc3e45ae8f3c2f81692516c13b1d83a1be29e42f679d5e730994faeab35ad96f22d4cfd354f1e16a630b0a28c3eb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MapModule-af13e1a7cbe934ed8a37b95b90c372ba589bcc3e45ae8f3c2f81692516c13b1d83a1be29e42f679d5e730994faeab35ad96f22d4cfd354f1e16a630b0a28c3eb"' :
                                            'id="xs-components-links-module-MapModule-af13e1a7cbe934ed8a37b95b90c372ba589bcc3e45ae8f3c2f81692516c13b1d83a1be29e42f679d5e730994faeab35ad96f22d4cfd354f1e16a630b0a28c3eb"' }>
                                            <li class="link">
                                                <a href="components/MapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapComponent</a>
                                            </li>
                                        </ul>
                                    </li>
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
                                <a href="modules/ParallelModule.html" data-type="entity-link" >ParallelModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ParallelModule-4abaff5a3bccc561c8393235972ed0bb8b8d9712e4d9ed2a2429b2ce49a9b4503d6c2e1ed95782c0ff96d452b89bfed6afbdfa4577318a8175706da6da21475c"' : 'data-target="#xs-components-links-module-ParallelModule-4abaff5a3bccc561c8393235972ed0bb8b8d9712e4d9ed2a2429b2ce49a9b4503d6c2e1ed95782c0ff96d452b89bfed6afbdfa4577318a8175706da6da21475c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ParallelModule-4abaff5a3bccc561c8393235972ed0bb8b8d9712e4d9ed2a2429b2ce49a9b4503d6c2e1ed95782c0ff96d452b89bfed6afbdfa4577318a8175706da6da21475c"' :
                                            'id="xs-components-links-module-ParallelModule-4abaff5a3bccc561c8393235972ed0bb8b8d9712e4d9ed2a2429b2ce49a9b4503d6c2e1ed95782c0ff96d452b89bfed6afbdfa4577318a8175706da6da21475c"' }>
                                            <li class="link">
                                                <a href="components/ParallelPlotComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParallelPlotComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ScatterModule.html" data-type="entity-link" >ScatterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ScatterModule-ee83c0d8fe871a1cafe24012b3c02eec6d37182ae894fd6035f38b6deef229a7d3c1cb100a2a89d648ef69179c55e14bb11716e1767ffd07fabf6675a5f98eee"' : 'data-target="#xs-components-links-module-ScatterModule-ee83c0d8fe871a1cafe24012b3c02eec6d37182ae894fd6035f38b6deef229a7d3c1cb100a2a89d648ef69179c55e14bb11716e1767ffd07fabf6675a5f98eee"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ScatterModule-ee83c0d8fe871a1cafe24012b3c02eec6d37182ae894fd6035f38b6deef229a7d3c1cb100a2a89d648ef69179c55e14bb11716e1767ffd07fabf6675a5f98eee"' :
                                            'id="xs-components-links-module-ScatterModule-ee83c0d8fe871a1cafe24012b3c02eec6d37182ae894fd6035f38b6deef229a7d3c1cb100a2a89d648ef69179c55e14bb11716e1767ffd07fabf6675a5f98eee"' }>
                                            <li class="link">
                                                <a href="components/ScatterPlotComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScatterPlotComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' : 'data-target="#xs-components-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' :
                                            'id="xs-components-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' }>
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
                                        'data-target="#directives-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' : 'data-target="#xs-directives-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' :
                                        'id="xs-directives-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' }>
                                        <li class="link">
                                            <a href="directives/LoadingDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' : 'data-target="#xs-pipes-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' :
                                            'id="xs-pipes-links-module-SharedModule-11d108ad47388ed3618beac96e6aa0db41caeff6979b8d2c769e55fc86c7ee661322238b71f76bdf44ea456f5cee1451ecd9563de72223d971e4bfcb2f910523"' }>
                                            <li class="link">
                                                <a href="pipes/ReplacePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReplacePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-ff77f90b2249ec2804a77cfa9457b983db66550556641becabeb57d510456c2f38b525977c8a6fb85f01c3f82b5a335319eedf4d18c59a46bd69b32f2c96013b-1"' : 'data-target="#xs-pipes-links-module-SharedModule-ff77f90b2249ec2804a77cfa9457b983db66550556641becabeb57d510456c2f38b525977c8a6fb85f01c3f82b5a335319eedf4d18c59a46bd69b32f2c96013b-1"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-ff77f90b2249ec2804a77cfa9457b983db66550556641becabeb57d510456c2f38b525977c8a6fb85f01c3f82b5a335319eedf4d18c59a46bd69b32f2c96013b-1"' :
                                            'id="xs-pipes-links-module-SharedModule-ff77f90b2249ec2804a77cfa9457b983db66550556641becabeb57d510456c2f38b525977c8a6fb85f01c3f82b5a335319eedf4d18c59a46bd69b32f2c96013b-1"' }>
                                            <li class="link">
                                                <a href="pipes/GuardTypePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GuardTypePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/PrecisionPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrecisionPipe</a>
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
                                <a href="modules/TabularModule.html" data-type="entity-link" >TabularModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TabularModule-e46eb1fcd1efe8761758656626c0f11f00820a758f376309ec525a56550d904e874423858738221068cdcb87114fc24efafece5db6da1003ff7275f1fd7e7838"' : 'data-target="#xs-components-links-module-TabularModule-e46eb1fcd1efe8761758656626c0f11f00820a758f376309ec525a56550d904e874423858738221068cdcb87114fc24efafece5db6da1003ff7275f1fd7e7838"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TabularModule-e46eb1fcd1efe8761758656626c0f11f00820a758f376309ec525a56550d904e874423858738221068cdcb87114fc24efafece5db6da1003ff7275f1fd7e7838"' :
                                            'id="xs-components-links-module-TabularModule-e46eb1fcd1efe8761758656626c0f11f00820a758f376309ec525a56550d904e874423858738221068cdcb87114fc24efafece5db6da1003ff7275f1fd7e7838"' }>
                                            <li class="link">
                                                <a href="components/TabularComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabularComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TimechartModule.html" data-type="entity-link" >TimechartModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TimechartModule-b63505f1abb12270ec016f633f06342eca08abfaafb58744e80319eba83e96b4ae215b13f2366dd7e9e1eaa9f79b18526abcd2a34768fc8a1ad87e96127cd80e"' : 'data-target="#xs-components-links-module-TimechartModule-b63505f1abb12270ec016f633f06342eca08abfaafb58744e80319eba83e96b4ae215b13f2366dd7e9e1eaa9f79b18526abcd2a34768fc8a1ad87e96127cd80e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TimechartModule-b63505f1abb12270ec016f633f06342eca08abfaafb58744e80319eba83e96b4ae215b13f2366dd7e9e1eaa9f79b18526abcd2a34768fc8a1ad87e96127cd80e"' :
                                            'id="xs-components-links-module-TimechartModule-b63505f1abb12270ec016f633f06342eca08abfaafb58744e80319eba83e96b4ae215b13f2366dd7e9e1eaa9f79b18526abcd2a34768fc8a1ad87e96127cd80e"' }>
                                            <li class="link">
                                                <a href="components/TimechartComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimechartComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TimelineModule.html" data-type="entity-link" >TimelineModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TimelineModule-e8ed8e6d2f267b8e988588b8ff677d2725d51833aadd93273db9cc07351d7d92295cc17b45a560e816968e3847c0a995727a596287f86b651a6ae457aff34cc3"' : 'data-target="#xs-components-links-module-TimelineModule-e8ed8e6d2f267b8e988588b8ff677d2725d51833aadd93273db9cc07351d7d92295cc17b45a560e816968e3847c0a995727a596287f86b651a6ae457aff34cc3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TimelineModule-e8ed8e6d2f267b8e988588b8ff677d2725d51833aadd93273db9cc07351d7d92295cc17b45a560e816968e3847c0a995727a596287f86b651a6ae457aff34cc3"' :
                                            'id="xs-components-links-module-TimelineModule-e8ed8e6d2f267b8e988588b8ff677d2725d51833aadd93273db9cc07351d7d92295cc17b45a560e816968e3847c0a995727a596287f86b651a6ae457aff34cc3"' }>
                                            <li class="link">
                                                <a href="components/TimelineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimelineComponent</a>
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
                                <a href="modules/WidgetsModule.html" data-type="entity-link" >WidgetsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WidgetsModule-df2e6f2c2c0195ad4d39720b7ea6d32fae4a42f244eeb1187f8f8c8a60d7d2e82047a190dba4515f32070cdb650cb8f1afbc0cfb721662f11bcdcdb447b91910"' : 'data-target="#xs-components-links-module-WidgetsModule-df2e6f2c2c0195ad4d39720b7ea6d32fae4a42f244eeb1187f8f8c8a60d7d2e82047a190dba4515f32070cdb650cb8f1afbc0cfb721662f11bcdcdb447b91910"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WidgetsModule-df2e6f2c2c0195ad4d39720b7ea6d32fae4a42f244eeb1187f8f8c8a60d7d2e82047a190dba4515f32070cdb650cb8f1afbc0cfb721662f11bcdcdb447b91910"' :
                                            'id="xs-components-links-module-WidgetsModule-df2e6f2c2c0195ad4d39720b7ea6d32fae4a42f244eeb1187f8f8c8a60d7d2e82047a190dba4515f32070cdb650cb8f1afbc0cfb721662f11bcdcdb447b91910"' }>
                                            <li class="link">
                                                <a href="components/ErrorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErrorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-WidgetsModule-df2e6f2c2c0195ad4d39720b7ea6d32fae4a42f244eeb1187f8f8c8a60d7d2e82047a190dba4515f32070cdb650cb8f1afbc0cfb721662f11bcdcdb447b91910"' : 'data-target="#xs-directives-links-module-WidgetsModule-df2e6f2c2c0195ad4d39720b7ea6d32fae4a42f244eeb1187f8f8c8a60d7d2e82047a190dba4515f32070cdb650cb8f1afbc0cfb721662f11bcdcdb447b91910"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-WidgetsModule-df2e6f2c2c0195ad4d39720b7ea6d32fae4a42f244eeb1187f8f8c8a60d7d2e82047a190dba4515f32070cdb650cb8f1afbc0cfb721662f11bcdcdb447b91910"' :
                                        'id="xs-directives-links-module-WidgetsModule-df2e6f2c2c0195ad4d39720b7ea6d32fae4a42f244eeb1187f8f8c8a60d7d2e82047a190dba4515f32070cdb650cb8f1afbc0cfb721662f11bcdcdb447b91910"' }>
                                        <li class="link">
                                            <a href="directives/WidgetTypeDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WidgetTypeDirective</a>
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
                                <a href="components/AuthComponent.html" data-type="entity-link" >AuthComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EChartComponent.html" data-type="entity-link" >EChartComponent</a>
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
                                <a href="classes/Trigger.html" data-type="entity-link" >Trigger</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/Widget.html" data-type="entity-link" >Widget</a>
                            </li>
                            <li class="link">
                                <a href="classes/Widget-1.html" data-type="entity-link" >Widget</a>
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
                                <a href="interfaces/ArchiveTypeOption.html" data-type="entity-link" >ArchiveTypeOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChannelRow.html" data-type="entity-link" >ChannelRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChannelRow-1.html" data-type="entity-link" >ChannelRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Color.html" data-type="entity-link" >Color</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfirmDialogOptions.html" data-type="entity-link" >ConfirmDialogOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContinousVisualMapOption.html" data-type="entity-link" >ContinousVisualMapOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardProperties.html" data-type="entity-link" >DashboardProperties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DashboardResolved.html" data-type="entity-link" >DashboardResolved</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataParams.html" data-type="entity-link" >DataParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteService.html" data-type="entity-link" >DeleteService</a>
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
                                <a href="interfaces/MapBounds.html" data-type="entity-link" >MapBounds</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Options.html" data-type="entity-link" >Options</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PartialUpdateService.html" data-type="entity-link" >PartialUpdateService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PiecewiseVisualMapOption.html" data-type="entity-link" >PiecewiseVisualMapOption</a>
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
                                <a href="interfaces/RowData.html" data-type="entity-link" >RowData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RowData-1.html" data-type="entity-link" >RowData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RowMetric.html" data-type="entity-link" >RowMetric</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SquacApiService.html" data-type="entity-link" >SquacApiService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SquacObject.html" data-type="entity-link" >SquacObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StationRow.html" data-type="entity-link" >StationRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StationRow-1.html" data-type="entity-link" >StationRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StoplightVisualMapOption.html" data-type="entity-link" >StoplightVisualMapOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Threshold.html" data-type="entity-link" >Threshold</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThresholdForm.html" data-type="entity-link" >ThresholdForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimeRange.html" data-type="entity-link" >TimeRange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateService.html" data-type="entity-link" >UpdateService</a>
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