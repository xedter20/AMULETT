// All components mapping with path for internal routes

import { lazy } from 'react';
import checkAuth from '../app/auth';
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const NetworkTree = lazy(() => import('../pages/protected/NetworkTree'));
const Welcome = lazy(() => import('../pages/protected/Welcome'));
const Page404 = lazy(() => import('../pages/protected/404'));
const Blank = lazy(() => import('../pages/protected/Blank'));
const Charts = lazy(() => import('../pages/protected/Charts'));
const Leads = lazy(() => import('../pages/protected/Leads'));
const Integration = lazy(() => import('../pages/protected/Integration'));
const Calendar = lazy(() => import('../pages/protected/Calendar'));
const Team = lazy(() => import('../pages/protected/Team'));
const Transactions = lazy(() => import('../pages/protected/Transactions'));
const Bills = lazy(() => import('../pages/protected/Bills'));
const ProfileSettings = lazy(() =>
  import('../pages/protected/ProfileSettings')
);
const GettingStarted = lazy(() => import('../pages/GettingStarted'));
const DocFeatures = lazy(() => import('../pages/DocFeatures'));
const DocComponents = lazy(() => import('../pages/DocComponents'));
const AddMember = lazy(() => import('../pages/protected/Leads'));

const token = checkAuth();

let routes = [];
if (token) {
  routes = [
    {
      path: '/dashboard', // the url
      component: Dashboard // view rendered
    },
    {
      path: '/network_tree', // the url
      component: NetworkTree // view rendered
    },
    {
      path: '/welcome', // the url
      component: Welcome // view rendered
    },
    {
      path: '/leads',
      component: Leads
    },
    {
      path: '/settings-team',
      component: Team
    },
    {
      path: '/calendar',
      component: Calendar
    },
    {
      path: '/users',
      component: Transactions
    },
    {
      path: '/settings-profile',
      component: ProfileSettings
    },
    {
      path: '/settings-profile/:slug',
      component: ProfileSettings
    },
    {
      path: '/addMember',
      component: AddMember
    },

    {
      path: '/features',
      component: DocFeatures
    },
    {
      path: '/components',
      component: DocComponents
    },
    {
      path: '/integration',
      component: Integration
    },
    {
      path: '/charts',
      component: Charts
    },
    {
      path: '/404',
      component: Page404
    },
    {
      path: '/blank',
      component: Blank
    }
  ];
} else {
  routes = [
    {
      path: '/dashboard', // the url
      component: Dashboard // view rendered
    },
    {
      path: '/welcome', // the url
      component: Welcome // view rendered
    },

    {
      path: '/settings-profile',
      component: ProfileSettings
    },

    {
      path: '/404',
      component: Page404
    },
    {
      path: '/blank',
      component: Blank
    }
  ];
}

export default routes;
