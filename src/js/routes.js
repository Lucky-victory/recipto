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

const device = getDevice();

const isMobile = device.ios || device.android;
const transition = isMobile ? 'f7-cover' : undefined;
function checkAuth({ to, from, resolve, reject }) {
    if (/* some condition to check user is logged in */ 1) {
        resolve();
    } else {
        reject();
    }
}
function checkPermission({ to, from, resolve, reject }) {
    if (/* some condition to check user edit permission */ 1) {
        resolve();
    } else {
        reject();
    }
}
function beforeLeave({ to, resolve, reject }) {
    if (to.path !== '/recipe/add') {
        const s = f7.popup.create({
            content: ` <div class="popup page-leave-popup" >
  <div class="view">
    <div class="page">
    
      <div class="page-content">
        ...
      </div>
    </div>
  </div>
  ...
</div>`,
            on: {},
        });
        s.open();
        f7.dialog.confirm(
            'Are you sure you want to leave this page without saving data?',
            function () {
                // proceed navigation
                resolve();
            },
            function () {
                // stay on page
                reject();
            }
        );
    } else {
        resolve();
    }
}

const routes = [
    {
        path: '/',
        component: HomePage,
        options: {
            transition,
        },
    },
    {
        path: '/about/',
        component: AboutPage,
    },
    {
        path: '/recipe/',
        component: NewRecipePage,
        routes: [
            {
                path: '/add',
                component: RecipeAddPage,
                beforeLeave,
            },
        ],
    },
    {
        path: '/post/',
        component: NewPostPage,
        routes: [
            {
                path: '/add',

                component: PostAddPage,
                beforeLeave,
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
