import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
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
  mdiLockOutline
} from '@mdi/js';
function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: '',
    emailId: ''
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  const formikConfig = {
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Minimun of 8 character(s)')
        .required('Required field')
    }),
    onSubmit: values => {
      setErrorMessage('');

      localStorage.setItem('token', 'DumyTokenHere');
      setLoading(false);
      window.location.href = '/app/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-2xl  shadow-xl">
        <div
          className="grid  md:grid-cols-1 grid-cols-1  bg-base-100 rounded-xl 

         ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login
            </h1>
            <Formik {...formikConfig}>
              {({
                handleSubmit,
                handleChange,
                handleBlur, // handler for onBlur event of form elements
                values,
                touched,
                errors
              }) => {
                return (
                  <Form className="space-y-4 md:space-y-6">
                    <InputText
                      icons={mdiAccount}
                      label="Email"
                      name="email"
                      type="email"
                      placeholder=""
                      value={values.email}
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

                    <button
                      type="submit"
                      className={
                        'btn mt-2 w-full btn-primary' +
                        (loading ? ' loading' : '')
                      }>
                      Login
                    </button>

                    <div className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
                      Don't have an account yet?
                      <Link to="/register">
                        <span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                          Register
                        </span>
                      </Link>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
