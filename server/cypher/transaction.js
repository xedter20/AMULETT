import util from 'util';

export const getAllParentNodes = ({ ID }) => {
  const queryText = `
    MATCH (a { ID: '${ID}'})
    OPTIONAL MATCH (a)<-[:has_invite*]-(pg)
     with a,pg ORDER BY pg.DEPTH_LEVEL DESC  
    RETURN {email: a.email, ID: a.ID} as child, 
    collect({ 
     email: pg.email, 
     ID: pg.ID, 
     DEPTH_LEVEL: pg.DEPTH_LEVEL
    }) as parents

  `;

  return queryText;
};

export const checkIfMatchExist = ({ ID, aliasSet }) => {
  const queryText = `
    MATCH (parent { ID: '${ID}'})
    OPTIONAL MATCH (parent)-[:has_invite*]->(children)  
    where children.ID_ALIAS IN ${JSON.stringify(aliasSet)}
    RETURN count(children) as children_count

  `;

  return queryText;
};

export const checkIfPairExist = ({ ID, name }) => {
  const queryText = `

    MATCH(pairing:Pairing ) 

    where pairing.name = '${name}'


    RETURN count(pairing) as children_count

  `;

  return queryText;
};

export const addPairingNode = params => {
  let {
    ID,
    aliasSet,
    parentId,
    pairMatched,
    currentDepthLevel,
    ...otherParams
  } = {
    ...params
  };

  let newData = {
    ID: ID,
    source_user_id: parentId,
    aliasSet: aliasSet,
    pairMatched: pairMatched,
    status: 'PENDING',
    targetDepthLevel: currentDepthLevel,
    name: aliasSet.join('='),
    date_created: Date.now()
  };

  let updateData = {
    source_user_id: parentId,
    aliasSet: aliasSet,
    pairMatched: pairMatched,
    status: 'PENDING',
    targetDepthLevel: currentDepthLevel,
    name: aliasSet.join('='),
    date_updated: Date.now()
  };
  const queryText = `
     MATCH (u:User {
      ID: '${parentId}'
     })
     MERGE (pairing:Pairing {
    
       name: '${newData.name}'
      })
      
     ON CREATE 
     SET pairing += ${util.inspect(newData)}
     ON MATCH SET 
     pairing += ${util.inspect(updateData)}


     MERGE(u)-[e:has_pair_match]->(pairing) 
     RETURN  *

 

  `;

  return queryText;
};

export const getAllMatchPairById = ({ ID = false }) => {
  const queryText = `

  ${
    ID
      ? `
  
    MATCH (u { ID: '${ID}'})
    OPTIONAL MATCH (parent)-[:has_pair_match]->(pairing:Pairing)  

    RETURN collect(properties(pairing)) as pairings
  
  `
      : `
      
   MATCH (target_user:User)
    MATCH (pairing:Pairing)
   
    where target_user.ID_ALIAS IN pairing.aliasSet
    with  pairing, COLLECT({
        INDEX_PLACEMENT: target_user.INDEX_PLACEMENT,
        email : target_user.email,
        ID: target_user.ID,
        firstName: target_user.firstName,
        lastName: target_user.lastName,
        ID_ALIAS: target_user.ID_ALIAS
        
        }) as u_list
    

    RETURN collect({
        status: pairing.status,
        source_user_id: pairing.source_user_id,
         name: pairing.name,
         users : u_list

    })
      
      `
  }
  

  `;

  return queryText;
};
