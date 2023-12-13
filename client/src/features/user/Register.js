import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import RadioText from '../../components/Input/Radio';
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

function Login() {
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
      userName: Yup.string().required('Required'),
      firstName: Yup.string().required('Required'),
      middleName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Minimun of 8 character(s)')
        .required('Required field'),
      birthday: Yup.date().required('Required'),
      age: Yup.number().required('Required'),
      civilStatus: Yup.string().required('Required'),
      beneficiaryRelationship: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
      mobileNumber: Yup.number().required('Required'),
      telephoneNumber: Yup.number().required('Required'),
      sponsorName: Yup.string().required('Required'),
      sponsorIdNumber: Yup.string().required('Required'),
      placementName: Yup.string().required('Required'),
      placementIdNumber: Yup.string().required('Required'),
      signatureOfSponsor: Yup.string().required('Required'),
      signatureOfApplicant: Yup.string().required('Required'),
      check: Yup.string().required('Required'),
      cash: Yup.string().required('Required'),
      amount: Yup.string().required('Required'),
      signature: Yup.string().required('Required'),
      date_sign: Yup.string().required('Required')
    }),
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

  let firstValidation = [];
  let secondValidation = [];

  let validation = [];
  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-4xl  shadow-xl">
        <div
          className="grid  md:grid-cols-1 grid-cols-1  bg-base-100 rounded-xl 

         ">
          <div className="p-2 space-y-4 md:space-y-6 sm:p-4">
            {/* <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
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
                setFieldValue
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
                      icon="ti-user"
                      isValid={checkValidateTab()}
                      errorMessages={errorMessages}>
                      <Form className="">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
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
                        <InputText
                          icons={mdiEmailCheckOutline}
                          label="Email Address"
                          name="email"
                          type="email"
                          placeholder=""
                          value={values.email}
                          onBlur={handleBlur} // This apparently updates `touched`?
                        />
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
                      icon="ti-user">
                      <Form className="">
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
                      </Form>
                    </FormWizard.TabContent>
                    <FormWizard.TabContent
                      title="Payment Information"
                      icon="ti-user">
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

            <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
      `}</style>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
