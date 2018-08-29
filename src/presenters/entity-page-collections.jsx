import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CollectionsList from './collections-list.jsx';
import ProjectsLoader from './projects-loader.jsx';

/* globals Set */

const EntityPageCollections = ({collections}) => {
  
  // collectionOptions = _.mapValues(collectionOptions, function(collectionOption) {
  //   return async (collectionId, userId) => {
  //     await collectionOption(collectionId, userId);
  //     reloadCollection(collectionId);
  //   };
  // });
  
  // define a dummy collection
  collections = {
    "teams": [],
    "users": [],
    "id": "c185d921-3271-4182-bf6c-6cba2f40f693",
    "inviteToken": "ea280688-a5e1-4c40-bfd7-a4df77b56f36",
    "description": "My First Collection",
    "name": "my-first-collection",
    "domain": "my-first-collection",
    "baseId": "2bdfb3f8-05ef-4035-a06e-2043962a3a13",
    "private": false,
    "createdAt": "2018-08-28T14:38:33.919Z",
    "updatedAt": "2018-08-28T20:18:25.605Z",
    "deletedAt": null,
    "lastAccess": "2018-08-28T20:18:36.280Z",
    "avatarUpdatedAt": "2018-08-28T14:38:34.387Z",    
    "showAsGlitchTeam": false,
    "projectPermission": {
      "userId": 867163,
      "projectId": "c185d921-3271-4182-bf6c-6cba2f40f693",
      "accessLevel": 30,
      "createdAt": "2018-08-28T14:38:33.932Z",
      "updatedAt": "2018-08-28T14:38:33.932Z"
    },
    "projectActions": [
      {
        "id": 9554811,
        "projectId": "c185d921-3271-4182-bf6c-6cba2f40f693",
        "userId": 867163,
        "action": "editor.access",
        "data": "edit",
        "createdAt": "2018-08-28T20:16:32.896Z",
        "updatedAt": "2018-08-28T20:16:32.896Z"
      }
    ]
}

  return (
    <React.Fragment>
      {!!collections.length && (
        <CollectionsList title="Recent Collections" collections={collections}
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