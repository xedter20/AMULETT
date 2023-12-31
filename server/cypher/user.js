import util from 'util';

export const addUserQuery = params => {
  let { ID, ...otherParams } = {
    ...params
  };
  const queryText = `

     MERGE (n:User { email: '${params.email}' })

     ON CREATE  SET n += ${util.inspect(params)}
     ON MATCH SET n += ${util.inspect(otherParams)}

     RETURN properties(n) as user

 

  `;

  return queryText;
};
export const createRelationShipQuery = ({ parentId, ID }) => {
  const queryText = `



     MATCH (parent:User { ID:  '${parentId}' }) 
     MATCH (child:User { ID:  '${ID}' } ) 
     MERGE(parent)-[e:has_invite]->(child) 

     ON CREATE SET e.date_created = ${Date.now()}
     ON MATCH SET e.date_updated = ${Date.now()}

    

  `;

  console.log(queryText);

  return queryText;
};

export const findUserQuery = () => {
  const queryText = `
  MATCH (n:User ) 
  RETURN COLLECT(properties(n)) as data
  `;

  return queryText;
};

export const findUserByIdQuery = userId => {
  const queryText = `
  MATCH (n:User {
   ID : '${userId}'
  
  }) RETURN COLLECT(properties(n)) as data
  `;

  return queryText;
};

export const findUserByEmailQuery = email => {
  const queryText = `
  MATCH (n:User {
   email : '${email}'
  
  }) RETURN COLLECT(properties(n)) as data
  `;

  return queryText;
};

export const findUserByUserNameQuery = userName => {
  const queryText = `
  MATCH (n:User {
   userName : '${userName}'
  
  }) RETURN COLLECT(properties(n)) as data
  `;

  console.log(queryText);
  return queryText;
};

export const getTreeStructureQuery = ({ userId }) => {
  const queryText = `


    MATCH path = ( p:User { isRootNode:true })-[:has_invite*]->(User) 
    WITH collect(path) AS paths
    CALL apoc.convert.toTree(paths, true , {
      nodes: {User: ['firstName', 'lastName', 'ID','email']}
    })
    YIELD value
    RETURN value;
    
  `;

  return queryText;
};

export const getChildren = ({ ID }) => {
  const queryText = `

     MATCH (parent:User { ID:  ${ID} }) 
     MATCH(parent)-[e:has_invite]->(child) 

     RETURN COLLECT(properties(child)) as children



    
  `;

  return queryText;
};
