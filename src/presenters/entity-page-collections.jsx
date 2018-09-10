import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ProjectsList from './projects-list.jsx';
import CollectionsList from './collections-list.jsx';
import ProjectsLoader from './projects-loader.jsx';

/* globals Set */

// const psst = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fpsst.svg?1500486136908";

const EntityPageCollections = ({collections, api, isAuthorized}) => {
  
  // projectOptions = _.mapValues(projectOptions, function(projectOption) {
  //   return async (projectId, userId) => {
  //     await projectOption(projectId, userId);
  //     reloadProject(projectId);
  //   };
  // });

  return (
    <React.Fragment>
      {!!collections.length && (
        <CollectionsList title="Collections" collections={collections.slice(0,2)} api={api} isAuthorized={isAuthorized} />
      )}
    </React.Fragment>
  );
};
EntityPageCollections.propTypes = {
  collections: PropTypes.array.isRequired,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

// const EntityPageProjectsContainer = ({api, projects, ...props}) => (
//   <ProjectsLoader api={api} projects={projects}>
//     {(projects, reloadProject) => <EntityPageProjects projects={projects} reloadProject={reloadProject} {...props}/>}
//   </ProjectsLoader>
// );

// export default EntityPageProjectsContainer;
export default EntityPageCollections;