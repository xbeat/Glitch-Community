/* global analytics APP_URL */

import React from 'react';
import PropTypes from 'prop-types';

import ProjectsList from './projects-list.jsx';
import FeaturedProjectOptionsPop from "./pop-overs/featured-project-options-pop.jsx";
import {EditButton, RemixButton, ReportButton} from './includes/project-actions.jsx';
import AddProjectToCollection from './includes/add-project-to-collection.jsx';

import {CurrentUserConsumer} from './current-user.jsx';

/* globals Set */

function trackRemix(id, domain) {
  analytics.track("Click Remix", {
    origin: "project page",
    baseProjectId: id,
    baseDomain: domain,
  });
}

const FeaturedProject = ({api, isAuthorized, currentUser, featuredProjectId, projects, addProjectToCollection, projectOptions}) => {
  return(
    <>
      <section id="featured-project-embed">            
        {isAuthorized && <FeaturedProjectOptionsPop {...{projectOptions, featuredProjectId}}/>}
        <div className="glitch-embed-wrap">
          <iframe title="embed"
            src={`${APP_URL}/embed/#!/embed/${featuredProjectId}?path=README.md&previewSize=100`}
            allow="geolocation; microphone; camera; midi; encrypted-media"
          ></iframe>
        </div>

        {isAuthorized ?
          <div className="buttons buttons-left">
            <EditButton className="button-small button-edit" name={featuredProjectId} isMember={isAuthorized}/>
          </div>
          :
          <div className="buttons buttons-left">
            <ReportButton className="button-small" name={featuredProjectId} id={featuredProjectId}/>
          </div>
        }

        <div className="buttons buttons-right">

          {currentUser.login && <AddProjectToCollection className="button-small" api={api} currentUser={currentUser} project={projects[0]} fromProject={true} addProjectToCollection={addProjectToCollection}/>}

          {/* Can add to track remix later 
            onClick={() => trackRemix(projects[0].id, projects[0].domain)}
          */}
          
          <RemixButton className="button-small"
            name={projects[0].domain} isMember={isAuthorized}
          />
        </div>
      </section>
    </>
    )
};

const EntityPagePinnedProjects = ({api, projects, pins, currentUser, isAuthorized, removePin, projectOptions, featuredProjectId, addProjectToCollection,}) => {
  const pinnedSet = new Set(pins.map(({projectId}) => projectId));
  const pinnedProjects = projects.filter( ({id}) => pinnedSet.has(id)).filter ( ({id}) => id != featuredProjectId); // need to filter out featuredProjectId
  
  const pinnedVisible = (isAuthorized || pinnedProjects.length) && projects.length;
    
  const pinnedTitle = (
    <>
      Pinned Projects
      <span className="emoji pushpin emoji-in-title"></span>
    </>
  );
  
  return (
    <>
      {!!pinnedVisible && (!!pinnedProjects.length || featuredProjectId) && (
       <>       
       <h2 className="pinned">{pinnedTitle}</h2>
       
         {featuredProjectId && 
            <FeaturedProject   
                {...{api, isAuthorized, currentUser, projects, featuredProjectId, addProjectToCollection}}
                projectOptions={isAuthorized && {...projectOptions}}
              />
         }

         {pinnedProjects.length > 0 && 
            <ProjectsList title={null}
              projects={pinnedProjects}
              api={api} 
              projectOptions={isAuthorized ? {removePin, ...projectOptions} 
                : (currentUser && currentUser.login ? {...projectOptions} : {})
              }
              extraClasses="pinned"
            />
          }
       </>
      )}
    </>
  );
};
EntityPagePinnedProjects.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  pins: PropTypes.arrayOf(PropTypes.shape({
    projectId: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  removePin: PropTypes.func.isRequired,
  projectOptions: PropTypes.object,
};

const EntityPagePinnedProjectsContainer = ({api, projects, maybeCurrentUser, ...props}) => (  
    <EntityPagePinnedProjects api={api} projects={projects} currentUser={maybeCurrentUser} {...props}/>  
);

export default EntityPagePinnedProjectsContainer;  
