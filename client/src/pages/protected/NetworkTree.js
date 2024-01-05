import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import Dashboard from '../../features/dashboard/index';
import Tree from 'react-d3-tree';

const orgChart = {
  name: 'User1',

  children: [
    {
      name: 'User2',
      attributes: {
        // department: 'Fabrication'
      }
    },
    {
      name: 'User3',
      attributes: {
        // department: 'Assembly'
      }
    }
  ]
};
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
    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
  />
</svg>;

const containerStyles = {
  width: '100%',
  height: '100vh'
};

const renderNodeWithCustomEvents = ({
  nodeDatum,
  toggleNode,
  handleNodeClick
}) => (
  <g>
    <circle r="15" onClick={() => handleNodeClick(nodeDatum)} />
    <text fill="black" strokeWidth="1" x="20" onClick={toggleNode}>
      {nodeDatum.name}
    </text>
    {nodeDatum.attributes?.department && (
      <text fill="black" x="20" dy="20" strokeWidth="1">
        Department: {nodeDatum.attributes?.department}
      </text>
    )}
  </g>
);

function InternalPage() {
  const dispatch = useDispatch();
  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Dashboard' }));
    if (treeContainerRef.current && shouldRecenterTreeRef.current) {
      shouldRecenterTreeRef.current = false;
      const dimensions = treeContainerRef.current.getBoundingClientRect();

      setTreeTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 8
      });
    }
  }, []);

  const handleNodeClick = nodeDatum => {
    console.log({ nodeDatum });
    window.alert(
      nodeDatum.children
        ? `Clicked ${nodeDatum.name} add Children`
        : `Clicked on ${nodeDatum.name} will add Children`
    );
  };
  return (
    <div ref={treeContainerRef} style={{ height: '100vh' }}>
      <Tree
        data={orgChart}
        orientation="vertical"
        translate={treeTranslate}
        collapsible={false}
        renderCustomNodeElement={rd3tProps =>
          renderNodeWithCustomEvents({ ...rd3tProps, handleNodeClick })
        }
        // pathFunc="step"
      />
    </div>
  );
}

export default InternalPage;
