import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import RadioText from '../../components/Input/Radio';
import Dropdown from '../../components/Input/Dropdown';
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
  mdiCalendarRange,
  mdiPhoneOutline,
  mdiMapMarker,
  mdiEmailCheckOutline,
  mdiAccountHeartOutline,
  mdiCashCheck,
  mdiAccountCreditCardOutline,
  mdiCreditCardOutline
} from '@mdi/js';

import MultiStep from 'react-multistep';
import { usePlacesWidget } from 'react-google-autocomplete';
import Autocomplete from 'react-google-autocomplete';
import FormWizard from 'react-form-wizard-component';
import 'react-form-wizard-component/dist/style.css';
import ForwardIcon from '@heroicons/react/24/outline/ForwardIcon';
import BackwardIcon from '@heroicons/react/24/outline/BackwardIcon';
import PlayCircleIcon from '@heroicons/react/24/outline/PlusCircleIcon';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { debounce } from 'lodash';

function SolarUserLinear(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}
function placementInfoIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function paymentInfoIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    </svg>
  );
}

function Login() {
  const [emailError, setEmailError] = useState('');

  const [users, setUser] = useState([]);

  const fetchUsers = async () => {
    let res = await axios({
      method: 'GET',
      url: 'user/list'
    });
    let list = res.data.map(({ id, firstName, lastName }) => {
      return {
        value: id,
        label: `${firstName} ${lastName}`
      };
    });
    setUser(list);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

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

  let firstValidation = [];
  let secondValidation = [];

  let validation = [];
  const debouncedEmailValidation = debounce(
    async (value, setFieldError, errors, setErrors) => {
      if (!errors.email) {
        let res = await axios({
          method: 'POST',
          url: 'user/isEmailExist',
          data: {
            email: value
          }
        });

        const isExist = res.data.isEmailExist;

        console.log({ isExist });
        if (isExist) {
          setEmailError('Email already exists');
          setFieldError('email', 'Email already exists');
          // errors.email = 'Email already exists';
          // setErrors({
          //   email: 'Email already exists'
          // });
        } else {
          // setFieldError('email', '');
        }
      }
    },
    600,
    {
      trailing: true
    }
  );
  const debouncedUserNameValidation = debounce(
    async (value, setFieldError, errors) => {
      // let res = await axios({
      //   method: 'POST',
      //   url: 'user/isUserNameExist',
      //   data: {
      //     userName: value
      //   }
      // });
      // const isExist = res.data.isUserNameExist;
      // if (isExist) {
      //   setFieldError('userName', 'Username already exists');
      // } else {
      //   setFieldError('userName', '');
      // }
    },
    600,
    {
      trailing: true
    }
  );

  const formikConfig = {
    initialValues: {
      email: '',
      password: '',
      userName: '',
      lastName: '',
      firstName: '',
      middleName: '',
      address: '',
      birthday: '',
      age: '',
      civilStatus: '',
      mobileNumber: '',
      telephoneNumber: '',
      beneficiaryRelationship: '',
      date_sign: new Date().toISOString().slice(0, 10),
      sponsorName: '',
      sponsorIdNumber: '',
      placementName: '',
      placementIdNumber: '',
      signatureOfSponsor: '',
      signatureOfApplicant: '',
      signature: '',
      check: '',
      amount: '',
      cash: '',
      amulet_package: amulet_packageSelection[0].value
    },
    validationSchema: Yup.object({
      // userName: Yup.string().required('Required'),
      // firstName: Yup.string().required('Required'),
      // middleName: Yup.string().required('Required'),
      // lastName: Yup.string().required('Required'),
      // email: Yup.string().email('Invalid email address').required('Required'),
      // password: Yup.string()
      //   .min(8, 'Minimun of 8 character(s)')
      //   .required('Required field'),
      // birthday: Yup.date().required('Required'),
      // age: Yup.number().required('Required'),
      // civilStatus: Yup.string().required('Required'),
      // beneficiaryRelationship: Yup.string().required('Required'),
      // address: Yup.string().required('Required'),
      // mobileNumber: Yup.number().required('Required'),
      // telephoneNumber: Yup.number().required('Required'),
      // sponsorName: Yup.string().required('Required'),
      // sponsorIdNumber: Yup.string().required('Required'),
      // placementName: Yup.string().required('Required'),
      // placementIdNumber: Yup.string().required('Required'),
      // signatureOfSponsor: Yup.string().required('Required'),
      // signatureOfApplicant: Yup.string().required('Required'),
      // check: Yup.string().required('Required'),
      // cash: Yup.string().required('Required'),
      // amount: Yup.string().required('Required'),
      // signature: Yup.string().required('Required'),
      // date_sign: Yup.string().required('Required')
    }),
    // validateOnMount: true,
    // validateOnChange: false,
    onSubmit: async values => {
      let memberData = values;

      try {
        let res = await axios({
          method: 'POST',
          url: 'user/create',
          data: memberData
        });

        let data = res.data;

        toast.success('Created Successfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
        return data;
      } catch (error) {
        toast.error('Something went wrong', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      }
    }
  };
  return (
    <div className="">
      <div className="mt-0">
        <div
          className="grid  md:grid-cols-1 grid-cols-1  bg-base-100 rounded-xl 

         ">
          <div className="p-2 space-y-4 md:space-y-6 sm:p-4">
            {/* <h1 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Register
            </h1> */}
            <Formik {...formikConfig}>
              {({
                handleSubmit,
                handleChange,
                handleBlur, // handler for onBlur event of form elements
                values,
                touched,
                errors,
                submitForm,
                setFieldTouched,
                setFieldValue,
                setFieldError,
                setErrors
              }) => {
                const checkValidateTab = () => {
                  // submitForm();
                };
                const errorMessages = () => {
                  // you can add alert or console.log or any thing you want
                  alert('Please fill in the required fields');
                };
                const handleTabChange = ({ prevIndex, nextIndex }) => {
                  if (nextIndex === 1) {
                    validation = [
                      'username',
                      'password',
                      'firstName',
                      'lastName',
                      'middleName',
                      'address',
                      'birthday',
                      'age',
                      'civilStatus',
                      'mobileNumber',
                      'telephoneNumber',
                      'email',
                      'beneficiaryRelationship'
                    ];
                  }
                  if (nextIndex === 2) {
                    validation = [
                      'sponsorName',
                      'sponsorIdNumber',
                      'placementName',
                      'placementIdNumber',
                      'signatureOfSponsor',
                      'signatureOfApplicant'
                    ];
                  }
                  if (nextIndex === 3) {
                    validation = [
                      'check',
                      'cash',
                      'amount',
                      'signature',
                      'date_sign'
                    ];
                  }
                };

                const handleEmailChange = e => {
                  handleChange(e);
                  debouncedEmailValidation(
                    e.target.value,
                    setFieldError,
                    errors,
                    setErrors
                  );
                };

                const handleUserNameChange = e => {
                  handleChange(e);
                  debouncedUserNameValidation(
                    e.target.value,
                    setFieldError,
                    errors
                  );
                };

                return (
                  <FormWizard
                    onComplete={() => {
                      handleSubmit();
                    }}
                    onTabChange={handleTabChange}
                    stepSize="xs"
                    color="#22c55e"
                    finishButtonText="Submit"
                    finishButtonTemplate={handleComplete => (
                      <div>
                        <button
                          type="button"
                          className="btn mt-2 justify-end  btn-primary float-right"
                          onClick={() => {
                            handleComplete();
                          }}>
                          <PlayCircleIcon className="h-6 w-6" />
                          Submit
                        </button>
                      </div>
                    )}
                    backButtonTemplate={handlePrevious => (
                      <div>
                        <button
                          className="btn mt-2 justify-end  float-left"
                          onClick={() => {
                            handlePrevious();
                          }}>
                          <BackwardIcon className="h-6 w-6" />
                          Previous
                        </button>
                      </div>
                    )}
                    nextButtonTemplate={(handleNext, currentIndex) => (
                      <div>
                        <button
                          className="btn mt-2 justify-end  btn-primary float-right"
                          onClick={() => {
                            validation.map(key => {
                              setFieldTouched(key);
                            });
                            let errorKeys = Object.keys(errors);

                            const findCommonErrors = (arr1, arr2) => {
                              // if firstValidation exists on errorKeys
                              return arr1.some(item => arr2.includes(item));
                            };

                            const hasFirstValidationError = findCommonErrors(
                              errorKeys,
                              validation
                            );

                            if (hasFirstValidationError === false) {
                              handleNext();
                            }
                          }}>
                          Next
                          <ForwardIcon className="h-6 w-6" />
                        </button>
                      </div>
                    )}>
                    <FormWizard.TabContent
                      title="Personal Information"
                      icon={SolarUserLinear()}
                      isValid={checkValidateTab()}
                      errorMessages={errorMessages}>
                      <Form className="">
                        <InputText
                          icons={mdiEmailCheckOutline}
                          label="Email Address"
                          name="email"
                          type="email"
                          placeholder=""
                          value={values.email}
                          onBlur={async e => {
                            await handleEmailChange(e);
                            await handleBlur(e);
                          }}
                          // onChange={handleEmailChange}
                        />
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                          <InputText
                            icons={mdiAccount}
                            label="Username"
                            name="userName"
                            type="text"
                            placeholder=""
                            value={values.userName}
                            onBlur={e => {
                              handleBlur(e);
                              handleUserNameChange(e);
                            }}
                          />
                          <InputText
                            icons={mdiLockOutline}
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={values.password}
                            onBlur={handleBlur} // This apparently updates `touched`?
                          />
                        </div>
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
                          <Dropdown
                            icons={mdiAccount}
                            label="Civil Status"
                            name="civilStatus"
                            type="text"
                            placeholder=""
                            value={values.civilStatus}
                            setFieldValue={setFieldValue}
                            onBlur={handleBlur}
                            options={[
                              { value: 'single', label: 'Single' },
                              { value: 'married', label: 'Married' },
                              { value: 'divorced', label: 'Divorced' },
                              { value: 'widowed', label: 'Widowed' }
                            ]}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                          <InputText
                            icons={mdiPhoneOutline}
                            label="Home Telephone Number"
                            name="telephoneNumber"
                            type="number"
                            placeholder=""
                            value={values.telephoneNumber}
                            onBlur={handleBlur} // This apparently updates `touched`?
                          />
                          <InputText
                            icons={mdiPhoneOutline}
                            label="Mobile Number"
                            name="mobileNumber"
                            type="number"
                            placeholder=""
                            value={values.mobileNumber}
                            onBlur={handleBlur} // This apparently updates `touched`?
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                          <InputText
                            icons={mdiAccountHeartOutline}
                            label="Beneficiary Relationship"
                            name="beneficiaryRelationship"
                            type="text"
                            placeholder=""
                            value={values.beneficiaryRelationship}
                            onBlur={handleBlur} // This apparently updates `touched`?
                          />
                          <InputText
                            icons={mdiAccount}
                            label="Age"
                            name="age"
                            type="text"
                            placeholder=""
                            value={values.age}
                            onBlur={handleBlur} // This apparently updates `touched`?
                          />
                        </div>

                        {/* <button
                          type="submit"
                          className={
                            'btn mt-2 w-full btn-primary' +
                            (loading ? ' loading' : '')
                          }>
                          Register
                        </button>

                        <div className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
                          Already have account?
                          <Link to="/login">
                            <span className="ml-1 inline-block  text-primary hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                              Login
                            </span>
                          </Link>
                        </div> */}
                      </Form>
                    </FormWizard.TabContent>
                    <FormWizard.TabContent
                      title="Placement Information"
                      icon={placementInfoIcon()}>
                      <Form className="">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                          <Dropdown
                            // icons={mdiAccount}
                            label="Sponsor Name"
                            name="sponsorName"
                            type="text"
                            placeholder=""
                            value={values.sponsorName}
                            setFieldValue={setFieldValue}
                            onBlur={handleBlur}
                            options={users}
                            affectedInput="sponsorIdNumber"
                            affectedInputValue="id"
                          />

                          {/* <InputText
                            icons={mdiAccount}
                            label="Sponsor Name"
                            name="sponsorName"
                            type="text"
                            placeholder=""
                            value={values.sponsorName}
                            onBlur={handleBlur} // This apparently updates `touched`?
                          /> */}
                          <InputText
                            icons={mdiAccount}
                            label="Sponsor ID Number"
                            name="sponsorIdNumber"
                            type="text"
                            placeholder=""
                            value={values.sponsorIdNumber}
                            disabled
                            onBlur={handleBlur} // This apparently updates `touched`?
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                          <Dropdown
                            // icons={mdiAccount}
                            label="Placement Name"
                            name="placementName"
                            type="text"
                            placeholder=""
                            value={values.placementName}
                            onBlur={handleBlur}
                            options={users}
                            setFieldValue={setFieldValue}
                            affectedInput="placementIdNumber"
                            affectedInputValue="id"
                          />
                          <InputText
                            icons={mdiAccount}
                            label="Placement ID Number"
                            name="placementIdNumber"
                            type="text"
                            placeholder=""
                            value={values.placementIdNumber}
                            onBlur={handleBlur}
                            disabled
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
                      </Form>
                    </FormWizard.TabContent>
                    <FormWizard.TabContent
                      title="Payment Information"
                      icon={paymentInfoIcon()}>
                      <Form className="">
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
                            defaultValue={amulet_packageSelection[0].value}
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
                      </Form>
                    </FormWizard.TabContent>
                  </FormWizard>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
