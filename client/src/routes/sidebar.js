/** Icons are imported separatly to reduce build time */
import checkAuth from '../app/auth';
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';

import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const role = checkAuth();

let routes = [];

if (role === 'admin') {
  routes = [
    {
      path: '/app/dashboard',
      icon: <Squares2X2Icon className={iconClasses} />,
      name: 'Dashboard'
    },
    {
      path: '/app/users', // url
      icon: <UsersIcon className={iconClasses} />, // icon component
      name: 'Users' // name that appear in Sidebar
    }
  ];
} else {
  routes = [
    {
      path: '/app/dashboard',
      icon: <Squares2X2Icon className={iconClasses} />,
      name: 'Dashboard'
    }
  ];
}

export default routes;
