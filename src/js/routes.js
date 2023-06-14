import HomePage from '../pages/home.jsx';
import NotFoundPage from '../pages/404.jsx';
import NewRecipePage from '../pages/new-recipe-page.jsx';

import { getDevice } from 'framework7';
import NewPostPage from '../pages/new-post-page.jsx';
import RecipeAddPage from '../pages/recipe/add.jsx';
import PostAddPage from '../pages/post/add.jsx';

import SignInPage from '../pages/signin.jsx';
import SignupPage from '../pages/signup.jsx';
import OnboardingPage from '../pages/onboarding.jsx';
import VerifyUserPage from '../pages/verify.jsx';
import { appwriteHandler } from './helper.js';

import RecipeViewPage from '../pages/recipe/view.jsx';
import PostViewPage from '../pages/post/view.jsx';
import ProfilePage from '../pages/profile.jsx';

const device = getDevice();

const isMobile = device.ios || device.android;
function checkGuestRedirect({ to, resolve, reject }) {
    appwriteHandler.account
        .get()
        .then((user) => {
            if (!user) {
                resolve('/signin/');
            } else {
                resolve('/home/');
            }
        })
        .catch((e) => {
            resolve('/signin/');
            console.log('error redirect', { e });
        });
}
function checkAuth(event, page) {
    // console.log({ event, page });
}
const routes = [
    {
        path: '/home/',
        alias: ['/home'],
        component: HomePage,
        // on: {
        //     pageBeforeIn: checkAuth,
        // },
        // beforeEnter: checkAuth,
    },
    {
        path: '/',
        redirect: checkGuestRedirect,
    },

    {
        alias: ['/join/', '/login/'],
        path: '/signin/',
        component: SignInPage,
        // beforeEnter: checkGuest,
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
        alias: ['/profile'],
        path: '/profile/',
        routes: [
            {
                component: ProfilePage,
                path: '/me',
            },
            {
                component: ProfilePage,
                path: '/user/:id',
            },
        ],
    },
    {
        alias: ['/welcome', '/onboard/'],
        path: '/welcome/',
        component: OnboardingPage,
    },
    {
        path: '/recipe/',
        // component: NewRecipePage,

        routes: [
            {
                path: '/add',
                component: RecipeAddPage,
            },
            {
                path: '/edit/:id',
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
        // component: NewPostPage,

        routes: [
            {
                path: '/add',

                component: PostAddPage,
            },
            {
                path: '/edit/:id',

                component: PostAddPage,
            },
            {
                path: '/view/:id',

                component: PostViewPage,
            },
        ],
    },

    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;
