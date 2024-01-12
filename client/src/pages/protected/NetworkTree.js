import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import Dashboard from '../../features/dashboard/index';
import Tree from 'react-d3-tree';
import axios from 'axios';
import InputText from '../../components/Input/InputText';
import { Formik, useField, useFormik, Form } from 'formik';
import * as Yup from 'yup';
import Dropdown from '../../components/Input/Dropdown';
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';

import './customTree.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const renderNodeWithCustomEvents = ({
  nodeDatum,
  toggleNode,
  handleNodeClick,
  setFieldValue,
  setAvailablePosition
}) => {
  let matchCount = nodeDatum.matchingPairs.filter(({ status }) => {
    return status === 'PENDING';
  }).length;
  const nodeSize = { x: '25%', y: '50%' };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -70,
    y: 40
  };
  return (
    <g>
      <circle
        stroke="#a21caf"
        fill="#f0abfc"
        r="35"
        onClick={async () => {
          handleNodeClick(nodeDatum);
          setFieldValue('parentNodeName', nodeDatum.name);
          setFieldValue('parentNodeEmail', nodeDatum.attributes.email);
          setFieldValue('parentNodeID', nodeDatum.attributes.ID);

          if (nodeDatum.matchingPairs < 2) {
            let res = await axios({
              method: 'POST',
              url: 'user/getUserNodeWithChildren',
              data: {
                ID: nodeDatum.attributes.ID
              }
            });

            setAvailablePosition(res.data.data);
          }
        }}
      />
      <text
        fill="#a21caf"
        fontWeight="bold"
        strokeWidth="0"
        x="-3"
        y="5"
        onClick={toggleNode}
        fontSize="12"
        fontWeightt="10">
        {nodeDatum.INDEX_PLACEMENT}
      </text>

      <foreignObject {...foreignObjectProps}>
        <div className="alert alert shadow-lg bg-white">
          <h6 className="text-xs font-normal text-gray-800 text-center h6">
            {nodeDatum.name}
          </h6>
          {/* <hr /> */}

          <h6 className="text-xs font-bold text-gray-800 text-center h6">
            Total Match: {matchCount}
          </h6>
        </div>
        {/* <div style={{ border: '1px solid black', backgroundColor: '#dedede' }}>
          <h3 style={{ textAlign: 'center' }}>{nodeDatum.name}</h3>
        </div> */}
        {/* <text
          fill="#1e293b"
          fontWeight="normal"
          strokeWidth="0"
          x="-40"
          y="60"
          onClick={toggleNode}
          fontSize="10"
          fontWeightt="2">
          {nodeDatum.name} {matchCount ? ` - Match Count: ${matchCount}` : ''}
        </text> */}
      </foreignObject>

      {/* {nodeDatum.attributes?.email && (
      <text fill="black" x="20" dy="20" strokeWidth="1">
        Department: {nodeDatum.attributes?.email}
      </text>
    )} */}
    </g>
  );
};

const straightPathFunc = (linkDatum, orientation) => {
  const { source, target } = linkDatum;
  return orientation === 'horizontal'
    ? `M${source.y},${source.x}L${target.y},${target.x}`
    : `M${source.x},${source.y}L${target.x},${target.y}`;
};

function InternalPage() {
  const dispatch = useDispatch();
  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);
  const [treeStucture, setTreeStucture] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUser] = useState([]);
  const [availablePosition, setAvailablePosition] = useState([
    { value: 'LEFT', label: 'Left' },
    { value: 'RIGHT', label: 'Right' }
  ]);

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Network Tree' }));
    if (treeContainerRef.current && shouldRecenterTreeRef.current) {
      shouldRecenterTreeRef.current = false;
      const dimensions = treeContainerRef.current.getBoundingClientRect();

      setTreeTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 8
      });
    }
  }, []);

  const [pairMatchedUsers, setPairMatchedUsers] = useState([]);
  const getTreeStructure = async () => {
    let res = await axios({
      method: 'POST',
      url: 'user/getTreeStructure'
    });
    let treeStucture = res.data.data;
    setTreeStucture(treeStucture);
    setIsLoaded(true);
  };
  useEffect(() => {
    getTreeStructure();
  }, []);
  const fetchUsers = async () => {
    let res = await axios({
      method: 'GET',
      url: 'user/list'
    });
    let list = res.data
      .filter(({ parentID, isRootNode }) => {
        return !isRootNode && !parentID;
      })
      .map(({ ID, firstName, lastName }) => {
        return {
          value: ID,
          label: `${firstName} ${lastName}`
        };
      });
    setUser(list);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleNodeClick = nodeDatum => {
    if (nodeDatum.children.length === 2) {
      console.log(nodeDatum.matchingPairs);
      setPairMatchedUsers(nodeDatum.matchingPairs);
      document.getElementById('viewModal').showModal();
    } else {
      document.getElementById('createChildModal').showModal();
    }
  };

  const formikConfig = {
    initialValues: {
      parentNodeName: '',
      parentNodeEmail: '',
      targetUserID: '',
      parentNodeID: '',
      position: ''
    },
    validationSchema: Yup.object({
      parentNodeName: Yup.string().required('Required'),
      parentNodeEmail: Yup.string().email().required('Required'),
      targetUserID: Yup.string().required('Required'),
      parentNodeID: Yup.string().required('Required'),
      position: Yup.string().required('Required')
    }),
    // validateOnMount: true,
    // validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        let res = await axios({
          method: 'POST',
          url: 'user/createChildren',
          data: {
            parentNodeID: values.parentNodeID,
            position: values.position,
            targetUserID: values.targetUserID
          }
        });
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
        // reload
        getTreeStructure();
        fetchUsers();
      } catch (error) {
        toast.error('Something went wrong', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      } finally {
        setSubmitting(false);
        document.getElementById('createChildModal').close();
      }
    }
  };

  const avatarComponent = () => {
    return (
      <div className="mask mask-circle w-10 h-10">
        <img
          src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg?w=740"
          alt="Avatar"
        />
      </div>
    );
  };

  const approvedTransaction = async ({ ID }) => {
    await axios({
      method: 'POST',
      url: 'transaction/approvedMatching',
      data: {
        ID
      }
    });
    console.log(ID);
  };
  return (
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
        setErrors,
        isSubmitting
      }) => {
        return (
          <div ref={treeContainerRef} style={{ height: '100vh' }}>
            {isLoaded && (
              <Tree
                rootNodeClassName="node__root"
                branchNodeClassName="node__branch"
                leafNodeClassName="node__leaf"
                data={treeStucture}
                orientation="vertical"
                pathFunc="step"
                translate={treeTranslate}
                collapsible={false}
                separation={{
                  siblings: 2,
                  nonSiblings: 2
                }}
                renderCustomNodeElement={rd3tProps =>
                  renderNodeWithCustomEvents({
                    ...rd3tProps,
                    handleNodeClick,
                    setFieldValue,
                    setAvailablePosition
                  })
                }
              />
            )}
            <dialog id="createChildModal" className="modal">
              <div className="modal-box w-11/12 max-w-3xl">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">Create Child User</h3>

                <Form>
                  <div className="divider">Parent</div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                    <InputText
                      // icons={mdiEmailCheckOutline}
                      disabled
                      label="Name"
                      name="parentNodeName"
                      type="text"
                      placeholder=""
                      value={values.parentNodeName}

                      // onChange={handleEmailChange}
                    />
                    <InputText
                      // icons={mdiEmailCheckOutline}
                      disabled
                      label="Email"
                      name="parentNode_Id"
                      type="text"
                      placeholder=""
                      value={values.parentNodeEmail}

                      // onChange={handleEmailChange}
                    />
                  </div>
                  <div className="divider">Target User(Child)</div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                    <Dropdown
                      // icons={mdiAccount}
                      label="Name"
                      name="targetUserID"
                      type="text"
                      placeholder=""
                      value={values.targetUserID}
                      setFieldValue={setFieldValue}
                      onBlur={handleBlur}
                      options={users}
                      affectedInput="targetUserID"
                      affectedInputValue="id"
                    />
                    <Dropdown
                      label="Position"
                      name="position"
                      type="text"
                      placeholder=""
                      value={values.position}
                      setFieldValue={setFieldValue}
                      onBlur={handleBlur}
                      options={availablePosition}
                      affectedInput="position"
                      affectedInputValue="id"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn mt-2 justify-end  btn-primary float-right"
                    disabled={isSubmitting}>
                    Submit
                  </button>
                </Form>
              </div>
            </dialog>
            <dialog id="viewModal" className="modal">
              <div className="modal-box w-11/12 max-w-4xl">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">Details</h3>

                <Form>
                  <div className="overflow-x-auto">
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th>Level</th>
                          <th>User 1</th>
                          <th>User 2</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* row 1 */}
                        {pairMatchedUsers.map(data => {
                          let user = data.users;
                          let depthLevel = data.targetDepthLevel.low;

                          let left = user[0];
                          let right = user[1];

                          let ID = data.ID;
                          let status = data.status;

                          return (
                            <tr>
                              <td>{depthLevel + 1}</td>
                              <td>
                                <div className="flex items-center gap-3">
                                  <div className="avatar">
                                    {avatarComponent()}
                                  </div>
                                  <div>
                                    <div className="font-bold">
                                      {left.firstName} {left.lastName}
                                    </div>
                                    <div className="text-sm opacity-50">
                                      {left.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center gap-3">
                                  <div className="avatar">
                                    {avatarComponent()}
                                  </div>
                                  <div>
                                    <div className="font-bold">
                                      {right.firstName} {right.lastName}
                                    </div>
                                    <div className="text-sm opacity-50">
                                      {right.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>Php 1000</td>
                              <td>
                                <div
                                  className={`text-white badge    ${
                                    status === 'COMPLETED'
                                      ? `badge-success`
                                      : 'badge-warning'
                                  } gap-2`}>
                                  {status}
                                </div>
                              </td>
                              <th>
                                {status !== 'COMPLETED' ? (
                                  <button
                                    className="btn btn-outline btn-sm ml-2 btn-success"
                                    onClick={async () =>
                                      await approvedTransaction({ ID })
                                    }>
                                    Approve
                                    <CheckCircleIcon className="h-1 w-1 text-green-500" />
                                  </button>
                                ) : (
                                  <div className="indicator"></div>
                                )}
                              </th>
                            </tr>
                          );
                        })}
                      </tbody>
                      {/* foot */}
                    </table>
                  </div>
                </Form>
              </div>
            </dialog>
            <ToastContainer />
          </div>
        );
      }}
    </Formik>
  );
}

export default InternalPage;
