// logic to add amount per invite

let dbResult = [
  {
    id: 2,
    name: 'PJ Dompol',
    children: [
      {
        id: 5,
        name: 'Troy Troy'
      },
      {
        id: 4,
        name: 'Charlour Charlou'
      }
    ]
  },
  {
    id: 3,
    name: 'Jayce jayces',
    children: [
      {
        id: null,
        name: null
      }
    ]
  }
];

const countTotalChildrenNodes = (depthLevel = 1) => {
  return 1 * Math.pow(2, depthLevel);
};

const addProfit = ({
  //   previousDepthLevel = 1,
  currentDepthLevel = 2,
  totalAmount = 1000
}) => {
  //1.  using formula 1* 2^(previousDepthLevel|currentDepthLevel)
  // 2. currentNodeCount === previosTotalChildnodes (Parent)
  // 3.  currentTotalChildnodes === countChildFromDBResut (Child)

  let previousDepthLevel = currentDepthLevel - 1;

  const previosTotalChildnodes = countTotalChildrenNodes(previousDepthLevel);
  const currentTotalChildnodes = countTotalChildrenNodes(currentDepthLevel);

  console.log({ previosTotalChildnodes, currentTotalChildnodes });

  // query Tree in DB
  // dbResult

  let currentNodeCount = dbResult.length;
  if (currentNodeCount === previosTotalChildnodes) {
    // passed first validation

    let countChildFromDBResut = dbResult.reduce((acc, current) => {
      let filteredUser = current.children.filter(u => u.id);
      let total = acc + filteredUser.length;
      return total;
    }, 0);

    // is match ?
    if (currentTotalChildnodes === countChildFromDBResut) {
    } else {
      // we will not add totalAmount of 1k
      // console.log('we will not add totalAmount of 1k');
    }
  } else {
    // we will not add totalAmount of 1k
  }
};

addProfit({ currentDepthLevel: 2 });

export default {
  addProfit
};
