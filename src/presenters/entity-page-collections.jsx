import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CollectionsList from './collections-list.jsx';
import ProjectsLoader from './projects-loader.jsx';

/* globals Set */

const EntityPageCollections = ({collections, collectionOptions}) => {
  
  // collectionOptions = _.mapValues(collectionOptions, function(collectionOption) {
  //   return async (collectionId, userId) => {
  //     await collectionOption(collectionId, userId);
  //     reloadCollection(collectionId);
  //   };
  // });

  return (
    <React.Fragment>
      {!!collections.length && (
        <CollectionList title="Recent Collections" projects={collections}
        />
      )}
    </React.Fragment>
  );
};

EntityPageCollections.propTypes = {
  collections: PropTypes.array.isRequired, 
  // collectionOptions: PropTypes.object.isRequired,
};

// const EntityPageProjectsContainer = ({api, projects, ...props}) => (
//   <ProjectsLoader api={api} projects={projects}>
//     {(projects, reloadProject) => <EntityPageProjects projects={projects} reloadProject={reloadProject} {...props}/>}
//   </ProjectsLoader>
// );

// export default EntityPageCollectionsContainer;