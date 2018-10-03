import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ProjectsList from './projects-list.jsx';
import CollectionsList from './collections-list.jsx';
import {Loader} from './includes/loader.jsx';

const EntityPageCollections = ({api, isAuthorized, userId}) => {
  return (
    <Loader get={() => this.props.api.get(`collections/?userId=${userId}`)}>
      {collections => 
        <div>{collections}</div>
      }
    </Loader>
  );
};

EntityPageCollections.propTypes = {
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
};

// export default EntityPageProjectsContainer;
export default EntityPageCollections;