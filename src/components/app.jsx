import React, { useState } from 'react';
import { getDevice } from 'framework7/lite-bundle';
import {
    f7,
    f7ready,
    App,
    Panel,
    View,
    Page,
    Navbar,
    BlockTitle,
    List,
    ListItem,
} from 'framework7-react';

import capacitorApp from '../js/capacitor-app';
import routes from '../js/routes';
import { isMobile } from '../js/helper';
import { Provider } from 'react-redux';
import { store } from '../js/state/reducers';

const transition = isMobile ? 'f7-cover' : undefined;
const MyApp = () => {
    const device = getDevice();
    // Framework7 Parameters
    const f7params = {
        name: 'Recipto', // App name
        theme: 'md', // Automatic theme detection
        colors: {
            primary: '#4caf50',
        },
        darkMode: 'auto',
        popup: {
            closeByBackdropClick: false,
            backdropUnique: true,
        },
        swipeout: {
            removeElements: false,
        },
        sheet: {
            backdropUnique: true,
        },
        // App routes
        routes: routes,

        // Register service worker (only on production build)
        // serviceWorker:
        //     process.env.NODE_ENV === 'production'
        //         ? {
        //               path: '/service-worker.js',
        //           }
        //         : {},
        // Input settings
        input: {
            scrollIntoViewOnFocus: device.capacitor,
            scrollIntoViewCentered: device.capacitor,
        },
        // Capacitor Statusbar settings
        statusbar: {
            iosOverlaysWebView: true,
            androidOverlaysWebView: false,
        },
    };

    f7ready(() => {
        // Init capacitor APIs (see capacitor-app.js)
        if (f7.device.capacitor) {
            capacitorApp.init(f7);
        }
    });

    return (
        <Provider store={store}>
            <App {...f7params} style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Left panel with cover effect when hidden */}
                {/* <Panel left reveal visibleBreakpoint={960}>
                <View>
                <Page>
                <Navbar title="Left Panel" />

                        <BlockTitle>Control Main View</BlockTitle>
                        <List>
                            <ListItem
                                link="/about/"
                                view=".view-main"
                                panelClose
                                title="About"
                            />
                            <ListItem
                                link="/form/"
                                view=".view-main"
                                panelClose
                                title="Form"
                            />
                            <ListItem
                                link="#"
                                view=".view-main"
                                back
                                panelClose
                                title="Back in history"
                            />
                        </List>
                    </Page>
                </View>
            </Panel> */}

                {/* Right panel with reveal effect
      <Panel right reveal visibleBreakpoint={700}>
        <View>
          <Page>
            <Navbar title="Right Panel" />
            <Block>Right panel content goes here</Block>
            </Page>
            </View>
        </Panel> */}

                {/* Your main view, should have "view-main" class */}
                <View
                    main
                    className="safe-areas"
                    url="/"
                    browserHistory
                    transition={transition}
                    browserHistorySeparator=""
                />
            </App>
        </Provider>
    );
};
export default MyApp;
