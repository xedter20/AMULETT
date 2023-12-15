import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TitleCard from '../../../components/Cards/TitleCard';
import { showNotification } from '../../common/headerSlice';
import InputText from '../../../components/Input/InputText';
import TextAreaInput from '../../../components/Input/TextAreaInput';
import ToogleInput from '../../../components/Input/ToogleInput';

import RadioText from '../../../components/Input/Radio';
import { Formik, useField, useFormik, Form } from 'formik';
import * as Yup from 'yup';
import {
  mdiAccount,
  mdiBallotOutline,
  mdiGithub,
  mdiMail,
  mdiUpload,
  mdiAccountPlusOutline,
  mdiPhone,
  mdiLock,
  mdiVanityLight,
  mdiLockOutline,
  mdiMapMarker,
  mdiCalendarRange,
  mdiCreditCardOutline
} from '@mdi/js';

import axios from 'axios';
import { useLocation } from 'react-router';
function ProfileSettings(props) {
  const search = useLocation().search;
  const id = new URLSearchParams(search).get('userId');
  const userId = id || '12345';

  // let userId = props.match.params.userId;
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState({});
  const [openTab, setOpenTab] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const amulet_packageSelection = [
    {
      label: 'SGEP 8 Package',
      value: 'sgep_8'
    },
    {
      label: 'SGEP 10 Package',
      value: 'sgep_10'
    },
    {
      label: 'SGEP 50 Package',
      value: 'sgep_50'
    },
    {
      label: 'SGEP 100 Package',
      value: 'sgep_100'
    }
  ];

  const getUser = async () => {
    let res = await axios({
      method: 'GET',
      url: `user/${userId}`
    });
    let user = res.data.data;

    setSelectedUser(user);
    setIsLoading(false);
  };
  useEffect(() => {
    getUser();
  }, []);

  // Call API to update profile settings changes
  const updateProfile = () => {
    dispatch(showNotification({ message: 'Profile Updated', status: 1 }));
  };

  const updateFormValue = ({ updateType, value }) => {
    console.log(updateType);
  };
  const formikConfig = () => {
    return {
      initialValues: {
        ...selectedUser
      },
      validationSchema: Yup.object({
        email: Yup.string().email('Invalid email address').required('Required')
      }),
      onSubmit: async (
        values,
        { setSubmitting, setFieldValue, setErrorMessage, setErrors }
      ) => {}
    };
  };
  let color = 'blue';
  return (
    <>
      {!isLoading && (
        <Formik {...formikConfig()}>
          {({
            handleSubmit,
            handleChange,
            handleBlur, // handler for onBlur event of form elements
            values,
            touched,
            errors,
            setFieldValue
          }) => {
            console.log({ values });
            return (
              <TitleCard title="Member Information" topMargin="mt-0">
                <div className="flex flex-wrap">
                  <div className="w-full">
                    <ul
                      className="flex mb-0 list-none flex-wrap pt-0 pb-4 flex-row"
                      role="tablist">
                      <li className="mr-2 last:mr-0 flex-auto text-center">
                        <a
                          className={
                            'text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal ' +
                            (openTab === 1
                              ? 'text-white bg-green-500 rounded-lg shadow-lg'
                              : 'text-green-500 bg-green-50 shadow-md')
                          }
                          onClick={e => {
                            e.preventDefault();
                            setOpenTab(1);
                          }}
                          data-toggle="tab"
                          href="#link1"
                          role="tablist">
                          Personal Information
                        </a>
                      </li>
                      <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a
                          className={
                            'text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal ' +
                            (openTab === 2
                              ? 'text-white bg-green-500 rounded-lg shadow-lg'
                              : 'text-green-500 bg-green-50 shadow-md')
                          }
                          onClick={e => {
                            e.preventDefault();
                            setOpenTab(2);
                          }}
                          data-toggle="tab"
                          href="#link2"
                          role="tablist">
                          Placement Information
                        </a>
                      </li>
                      <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a
                          className={
                            'text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal ' +
                            (openTab === 3
                              ? 'text-white bg-green-500 rounded-lg shadow-lg'
                              : 'text-green-500 bg-green-50 shadow-md')
                          }
                          onClick={e => {
                            e.preventDefault();
                            setOpenTab(3);
                          }}
                          data-toggle="tab"
                          href="#link3"
                          role="tablist">
                          Payment Information
                        </a>
                      </li>
                    </ul>
                    <div className="">
                      <div className="">
                        <div>
                          <div
                            className={openTab === 1 ? 'block' : 'hidden'}
                            id="link1">
                            <div className="personalInfo">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputText
                                  icons={mdiAccount}
                                  label="Username"
                                  name="userName"
                                  type="text"
                                  placeholder=""
                                  value={values.userName}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiAccount}
                                  label="Email"
                                  name="email"
                                  type="email"
                                  placeholder=""
                                  value={values.email}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                              </div>
                              {/* <div className="divider"></div> */}
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 ">
                                <InputText
                                  icons={mdiAccount}
                                  label="Last name"
                                  name="lastName"
                                  type="text"
                                  placeholder=""
                                  value={values.lastName}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiAccount}
                                  label="First name"
                                  name="firstName"
                                  type="text"
                                  placeholder=""
                                  value={values.firstName}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiAccount}
                                  label="Middle Name"
                                  name="middleName"
                                  type="text"
                                  placeholder=""
                                  value={values.middleName}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                              </div>
                              <InputText
                                icons={mdiMapMarker}
                                label="Address"
                                name="address"
                                type="text"
                                placeholder=""
                                value={values.address}
                                onBlur={handleBlur} // This apparently updates `touched`?
                              />
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 ">
                                <InputText
                                  icons={mdiCalendarRange}
                                  label="Birthday"
                                  name="birthday"
                                  type="date"
                                  placeholder=""
                                  value={values.birthday}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiAccount}
                                  label="Age"
                                  name="age"
                                  type="number"
                                  placeholder=""
                                  value={values.age}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiAccount}
                                  label="Civil Status"
                                  name="civilStatus"
                                  type="text"
                                  placeholder=""
                                  value={values.civilStatus}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            className={openTab === 2 ? 'block' : 'hidden'}
                            id="link2">
                            <div className="placementInfo">
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                                <InputText
                                  icons={mdiAccount}
                                  label="Sponsor Name"
                                  name="sponsorName"
                                  type="text"
                                  placeholder=""
                                  value={values.sponsorName}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiAccount}
                                  label="Sponsor ID Number"
                                  name="sponsorIdNumber"
                                  type="text"
                                  placeholder=""
                                  value={values.sponsorIdNumber}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                                <InputText
                                  icons={mdiAccount}
                                  label="Placement Name"
                                  name="placementName"
                                  type="text"
                                  placeholder=""
                                  value={values.placementName}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiAccount}
                                  label="Placement ID Number"
                                  name="placementIdNumber"
                                  type="text"
                                  placeholder=""
                                  value={values.placementIdNumber}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                                <InputText
                                  icons={mdiAccount}
                                  label="Signature of Sponsor"
                                  name="signatureOfSponsor"
                                  type="text"
                                  placeholder=""
                                  value={values.signatureOfSponsor}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiAccount}
                                  label="Signature of Applicant"
                                  name="signatureOfApplicant"
                                  type="text"
                                  placeholder=""
                                  value={values.signatureOfApplicant}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            className={openTab === 3 ? 'block' : 'hidden'}
                            id="link3">
                            <div className="paymenttInfo">
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                                <InputText
                                  icons={mdiCreditCardOutline}
                                  label="Check"
                                  name="check"
                                  type="text"
                                  placeholder=""
                                  value={values.check}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiCreditCardOutline}
                                  label="Cash"
                                  name="cash"
                                  type="text"
                                  placeholder=""
                                  value={values.cash}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                              </div>
                              <InputText
                                icons={mdiCreditCardOutline}
                                label="Amount"
                                name="amount"
                                type="text"
                                placeholder=""
                                value={values.amount}
                                onBlur={handleBlur} // This apparently updates `touched`?
                              />
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                                <InputText
                                  icons={mdiCreditCardOutline}
                                  label="Signature"
                                  name="signature"
                                  type="text"
                                  placeholder=""
                                  value={values.signature}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                <InputText
                                  icons={mdiCreditCardOutline}
                                  label="Date"
                                  name="date_sign"
                                  type="date"
                                  placeholder=""
                                  disabled
                                  value={values.date_sign}
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                              </div>

                              <div className="">
                                <label
                                  className={`block mb-2 text-neutral-900 text-left font-bold`}>
                                  Choose Amulet Package
                                </label>
                                <RadioText
                                  icons={mdiAccount}
                                  label="Choose Amulet Package"
                                  name="amulet_package"
                                  type="radio"
                                  placeholder=""
                                  value={values.amulet_package}
                                  setFieldValue={setFieldValue}
                                  options={amulet_packageSelection}
                                  defaultValue={
                                    amulet_packageSelection[0].value
                                  }
                                  onBlur={handleBlur} // This apparently updates `touched`?
                                />
                                {/* <InputText
                            icons={mdiAccount}
                            label="Cash"
                            name="cash"
                            type="text"
                            placeholder=""
                            value={values.cash}
                            onBlur={handleBlur} // This apparently updates `touched`?
                          /> */}
                              </div>
                              {/* <div className="grid grid-cols-2 gap-3 md:grid-cols-1 ">
                          <InputText
                            icons={mdiAccount}
                            label="Amount"
                            name="amount"
                            type="text"
                            placeholder=""
                            value={values.amount}
                            onBlur={handleBlur} // This apparently updates `touched`?
                          />
                        </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputText
            labelTitle="Language"
            defaultValue="English"
            updateFormValue={updateFormValue}
          />
          <InputText
            labelTitle="Timezone"
            defaultValue="IST"
            updateFormValue={updateFormValue}
          />
          <ToogleInput
            updateType="syncData"
            labelTitle="Sync Data"
            defaultValue={true}
            updateFormValue={updateFormValue}
          />
        </div>

        <div className="mt-16">
          <button
            className="btn btn-primary float-right"
            onClick={() => updateProfile()}>
            Update
          </button>
        </div> */}
              </TitleCard>
            );
          }}
        </Formik>
      )}
    </>
  );
}

export default ProfileSettings;
