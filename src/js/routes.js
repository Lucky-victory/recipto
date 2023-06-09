import HomePage from '../pages/home.jsx';
import AboutPage from '../pages/about.jsx';
import DynamicRoutePage from '../pages/dynamic-route.jsx';
import RequestAndLoad from '../pages/request-and-load.jsx';
import NotFoundPage from '../pages/404.jsx';
import NewRecipePage from '../pages/new-recipe-page.jsx';

import { getDevice } from 'framework7';
import NewPostPage from '../pages/new-post-page.jsx';
import RecipeAddPage from '../pages/recipe/add.jsx';
import PostAddPage from '../pages/post/add.jsx';
import { f7 } from 'framework7-react';
import SignInPage from '../pages/signin.jsx';
import SignupPage from '../pages/signup.jsx';
import OnboardingPage from '../pages/onboarding.jsx';
import VerifyUserPage from '../pages/verify.jsx';
import { appwriteHandler, storageKeys } from './helper.js';
import { Preferences } from '@capacitor/preferences';
import RecipeViewPage from '../pages/recipe/view.jsx';
import PostViewPage from '../pages/post/view.jsx';

const device = getDevice();

const isMobile = device.ios || device.android;
const transition = isMobile ? 'f7-cover' : undefined;
function checkAuth({ to, from, resolve, reject }) {
    console.log({ to, from });
    Preferences.get({ key: storageKeys.USER }).then(({ value }) => {
        const user = JSON.parse(value);
        if (user) {
            resolve();
        } else {
            reject();
        }
    });
}
function checkGuest({ to, from, resolve, reject }) {
    Preferences.get({ key: storageKeys.USER })
        .then(({ value }) => {
            const user = JSON.parse(value);
            console.log({ user });
            if (!user) {
                resolve();
            } else {
                reject();
            }
        })
        .catch((e) => {
            console.log('error before enter', { e });
        });
}
function checkGuestRedirect({ to, resolve, reject }) {
    Preferences.get({ key: storageKeys.USER })
        .then(({ value }) => {
            const user = JSON.parse(value);

            if (!user) {
                resolve('/signin/');
            } else {
                resolve('/home/');
            }
        })
        .catch((e) => {
            console.log('error redirect', { e });
        });
}
function checkPermission({ to, from, resolve, reject }) {
    if (/* some condition to check user edit permission */ 1) {
        resolve();
    } else {
        reject();
    }
}
// function beforeLeave({ to, resolve, reject }) {
//     if (to.path !== '/recipe/add') {
//         f7.dialog.confirm(
//             'Are you sure you want to leave this page without saving data?',
//             function () {
//                 // proceed navigation
//                 resolve();
//             },
//             function () {
//                 // stay on page
//                 reject();
//             }
//         );
//     } else {
//         resolve();
//     }
// }

const routes = [
    {
        path: '/home/',
        component: HomePage,

        // beforeEnter: checkAuth,
    },
    {
        path: '/',
        redirect: checkGuestRedirect,
    },
    {
        path: '/about/',
        component: AboutPage,
    },
    {
        alias: ['/join/', '/login/'],
        path: '/signin/',
        component: SignInPage,
        // beforeEnter: checkGuest,
        // redirect: checkGuestRedirect,
    },
    {
        alias: '/register/',
        path: '/signup/',
        // beforeEnter: checkGuest,
        component: SignupPage,
    },
    {
        path: '/verify/',
        component: VerifyUserPage,
    },
    {
        alias: '/onboard/',
        path: '/welcome/',
        component: OnboardingPage,
    },
    {
        path: '/recipe/',
        component: NewRecipePage,
        beforeEnter: checkAuth,
        routes: [
            {
                path: '/add',
                component: RecipeAddPage,
            },
            {
                path: '/view/:id',
                component: RecipeViewPage,
            },
        ],
    },
    {
        path: '/post/',
        component: NewPostPage,
        beforeEnter: checkAuth,

        routes: [
            {
                path: '/add',

                component: PostAddPage,
            },
            {
                path: '/view/:id',

                component: PostViewPage,
            },
        ],
    },

    {
        path: '/request-and-load/user/:userId/',
        async: function ({ router, to, resolve }) {
            // App instance
            var app = router.app;

            // Show Preloader
            app.preloader.show();

            // User ID from request
            var userId = to.params.userId;

            // Simulate Ajax Request
            setTimeout(function () {
                // We got user data from request
                var user = {
                    firstName: 'Vladimir',
                    lastName: 'Kharlampidi',
                    about: 'Hello, i am creator of Framework7! Hope you like it!',
                    links: [
                        {
                            title: 'Framework7 Website',
                            url: 'http://framework7.io',
                        },
                        {
                            title: 'Framework7 Forum',
                            url: 'http://forum.framework7.io',
                        },
                    ],
                };
                // Hide Preloader
                app.preloader.hide();

                // Resolve route to load page
                resolve(
                    {
                        component: RequestAndLoad,
                    },
                    {
                        props: {
                            user: user,
                        },
                    }
                );
            }, 1000);
        },
    },
    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;
