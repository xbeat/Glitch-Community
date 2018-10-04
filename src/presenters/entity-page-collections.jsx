import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ProjectsList from './projects-list.jsx';
import CollectionsList from './collections-list.jsx';
import {DataLoader} from './includes/loader.jsx';

const EntityPageCollections = ({api, isAuthorized, userId, deleteCollection}) => {
  return (
    
    <DataLoader get={() => api.get(`collections/?userId=${userId}`)}>
      { ({data}) => 
        <CollectionsList title="Collections" 
          collections={data} 
          api={api} 
          isAuthorized={isAuthorized}
          collectionOptions={isAuthorized ? {deleteCollection} : null}
          />
      }
    </DataLoader>    
  );
};

EntityPageCollections.propTypes = {
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  deleteCollection: PropTypes.func,
};

// export default EntityPageProjectsContainer;
export default EntityPageCollections;