import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import TitleCard from '../../components/Cards/TitleCard';
// import { RECENT_TRANSACTIONS } from '../../utils/dummyData';
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import SearchBar from '../../components/Input/SearchBar';
import { NavLink, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ViewColumnsIcon from '@heroicons/react/24/outline/EyeIcon';
import PlusCircleIcon from '@heroicons/react/24/outline/PlusCircleIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';

import TreeStucture from './../TreeStucture/Dex';

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
  const [filterParam, setFilterParam] = useState('');
  const [searchText, setSearchText] = useState('');

  const locationFilters = [''];

  const showFiltersAndApply = params => {
    applyFilter(params);
    setFilterParam(params);
  };

  const removeAppliedFilter = () => {
    removeFilter();
    setFilterParam('');
    setSearchText('');
  };

  useEffect(() => {
    if (searchText === '') {
      removeAppliedFilter();
    } else {
      applySearch(searchText);
    }
  }, [searchText]);

  return (
    <div className="inline-block float-right">
      <SearchBar
        searchText={searchText}
        styleClass="mr-4"
        setSearchText={setSearchText}
      />
      {filterParam != '' && (
        <button
          onClick={() => removeAppliedFilter()}
          className="btn btn-xs mr-2 btn-active btn-ghost normal-case">
          {filterParam}
          <XMarkIcon className="w-4 ml-2" />
        </button>
      )}
      <Link to={`/app/addMember`}>
        <button className="btn btn-sm">
          Add Member
          <PlusCircleIcon className="h-6 w-6 text-green-500" />
        </button>
      </Link>{' '}
      {/* <div className="dropdown dropdown-bottom dropdown-end">
        <label tabIndex={0} className="btn btn-sm btn-outline">
          <FunnelIcon className="w-5 mr-2" />
          Filter
        </label>
        <ul
          tabIndex={0}
          className="z-40 dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
          {locationFilters.map((l, k) => {
            return (
              <li key={k}>
                <a onClick={() => showFiltersAndApply(l)}>{l}</a>
              </li>
            );
          })}
          <div className="divider mt-0 mb-0"></div>
          <li>
            <a onClick={() => removeAppliedFilter()}>Remove Filter</a>
          </li>
        </ul>
      </div> */}
    </div>
  );
};

function Transactions() {
  const [users, setUser] = useState([]);

  const fetchUsers = async () => {
    let res = await axios({
      method: 'GET',
      url: 'user/list'
    });
    let list = res.data;
    setUser(list);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const removeFilter = async () => {
    let res = await axios({
      method: 'GET',
      url: 'user/list'
    });
    let list = res.data;

    console.log({ list });
    setUser(list);
  };

  const applyFilter = params => {
    let filteredUsers = users.filter(t => {
      return t.address === params;
    });
    setUser(filteredUsers);
  };

  // Search according to name
  const applySearch = value => {
    let filteredUsers = users.filter(t => {
      return (
        t.email.toLowerCase().includes(value.toLowerCase()) ||
        t.firstName.toLowerCase().includes(value.toLowerCase()) ||
        t.lastName.toLowerCase().includes(value.toLowerCase())
      );
    });
    setUser(filteredUsers);
  };

  return (
    <>
      <TitleCard
        title="Users"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            applySearch={applySearch}
            applyFilter={applyFilter}
            removeFilter={removeFilter}
          />
        }>
        {/* Team Member list in table format loaded constant */}
        <div className="overflow-x-auto w-full">
          {/* <TreeStucture /> */}
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                {/* <th>Email</th> */}
                <th>Address</th>
                <th>Amulet Package</th>
                <th>Date Signed</th>
                <th>Action(s)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((l, k) => {
                return (
                  <tr key={k}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-circle w-12 h-20">
                            <img
                              src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg?w=740"
                              alt="Avatar"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="font-bold">
                            {l.firstName} {l.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* <td>{l.email}</td> */}
                    <td>{l.address}</td>
                    <td>{l.amulet_package}</td>
                    <td>{moment(l.date_sign).format('MMM D YYYY')}</td>
                    <td>
                      <div className="flex">
                        <Link to={`/app/settings-profile/user?userId=${l.ID}`}>
                          <button className="btn btn-sm">
                            View
                            <ViewColumnsIcon className="h-4 w-4 text-blue-500" />
                          </button>
                        </Link>{' '}
                        <button className="btn btn-sm ml-2">
                          Delete
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default Transactions;
