import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ProjectsList from './projects-list.jsx';
import CollectionsList from './collections-list.jsx';
import ProjectsLoader from './projects-loader.jsx';

const EntityPageCollections = ({collections, api, isAuthorized, userId}) => {
  
  // projectOptions = _.mapValues(projectOptions, function(projectOption) {
  //   return async (projectId, userId) => {
  //     await projectOption(projectId, userId);
  //     reloadProject(projectId);
  //   };
  // });
  
  async function loadCollections(){
    console.log('load collections');
    // const userId = 867163; // placeholder since can't pass it correctly yet
    const [data] = await this.props.api.get(`collections/?userId=${userId}`);
    console.log([data]);
  }

  return (
    <React.Fragment>

      <CollectionsList title="Collections" collections={loadCollections} api={api} isAuthorized={isAuthorized} />
       
      {/*
        <CollectionsList title="Collections" collections={collections.slice(0,2)} api={api} isAuthorized={isAuthorized} />
      */}
      
    </React.Fragment>
    
  );
};


EntityPageCollections.propTypes = {
  collections: PropTypes.array.isRequired,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
};

// const EntityPageProjectsContainer = ({api, projects, ...props}) => (
//   <ProjectsLoader api={api} projects={projects}>
//     {(projects, reloadProject) => <EntityPageProjects projects={projects} reloadProject={reloadProject} {...props}/>}
//   </ProjectsLoader>
// );

// export default EntityPageProjectsContainer;
export default EntityPageCollections;