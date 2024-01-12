import DashboardStats from './components/DashboardStats';
import AmountStats from './components/AmountStats';
import PageStats from './components/PageStats';

import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import CircleStackIcon from '@heroicons/react/24/outline/CircleStackIcon';
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon';
import UserChannels from './components/UserChannels';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import DashboardTopBar from './components/DashboardTopBar';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import DoughnutChart from './components/DoughnutChart';
import { useEffect, useState, useRef } from 'react';

import axios from 'axios';

const statsData = [
  {
    key: 'totalIncome',
    title: 'Total Income',
    value: 'Php 500',
    icon: <CreditCardIcon className="w-8 h-8" />,
    description: ''
  }
  // {
  //   title: 'New Users',
  //   value: '100',
  //   icon: <UserGroupIcon className="w-8 h-8" />,
  //   description: ''
  // },

  // {
  //   title: 'Pending Match',
  //   value: '450',
  //   icon: <CircleStackIcon className="w-8 h-8" />,
  //   description: ''
  // },
  // {
  //   title: 'Active Users',
  //   value: '50',
  //   icon: <UsersIcon className="w-8 h-8" />,
  //   description: ''
  // }
];

function Dashboard() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState([]);
  const [dashboardData, setDashboardData] = useState(statsData);
  const getDashboardStats = async () => {
    let res = await axios({
      method: 'POST',
      url: 'transaction/getDashboardStats'
    });

    let data = res.data.data;

    let updatedValue = dashboardData.reduce((acc, current) => {
      if (current.key === 'totalIncome') {
        return [
          ...acc,
          {
            ...current,
            value: `PHP ${data.totalIncome}`
          }
        ];
      } else {
        return [...acc];
      }
    }, []);

    setIsLoaded(true);
    setDashboardData(updatedValue);
  };
  useEffect(() => {
    getDashboardStats();
  }, []);

  const updateDashboardPeriod = newRange => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1
      })
    );
  };

  return (
    <>
      {/** ---------------------- Select Period Content ------------------------- */}
      <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />

      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-3 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {dashboardData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>

      {/** ---------------------- Different charts ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        {/* <LineChart />
        <BarChart /> */}
      </div>

      {/** ---------------------- Different stats content 2 ------------------------- */}

      <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
        {/* <AmountStats />
        <PageStats /> */}
      </div>

      {/** ---------------------- User source channels table  ------------------------- */}

      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        {/* <UserChannels />
        <DoughnutChart /> */}
      </div>
    </>
  );
}

export default Dashboard;
