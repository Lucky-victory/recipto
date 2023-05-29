
import HomePage from '../pages/home.jsx';
import AboutPage from '../pages/about.jsx';
import DynamicRoutePage from '../pages/dynamic-route.jsx';
import RequestAndLoad from '../pages/request-and-load.jsx';
import NotFoundPage from '../pages/404.jsx';
import NewRecipePage from '../pages/new-recipe-page.jsx';

import { getDevice } from 'framework7/types';

const device=getDevice();

const isMobile=device.ios||device.android;
const transition=isMobile?'f7-cover':undefined;
const routes = [
  {
    path: '/',
    component: HomePage,
    options:{
      transition
    }
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/add-recipe/',
    component:NewRecipePage,
    options:{
      transition
    }
    
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
          ]
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
            }
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
