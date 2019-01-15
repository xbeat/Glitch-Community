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

const FeaturedProject = ({api, isAuthorized, currentUser, featuredProject, addProjectToCollection, projectOptions}) => {
  return(
    <>
      <section id="featured-project-embed">            
        {isAuthorized && <FeaturedProjectOptionsPop {...{projectOptions}} featuredProjectId={featuredProject.id}/>}
        <div className="glitch-embed-wrap">
          <iframe title="embed"
            src={`${APP_URL}/embed/#!/embed/${featuredProject.id}?path=README.md&previewSize=100`}
            allow="geolocation; microphone; camera; midi; encrypted-media"
          ></iframe>
        </div>

        {isAuthorized ?
          <div className="buttons buttons-left">
            <EditButton className="button-small button-edit" name={featuredProject.id} isMember={isAuthorized}/>
          </div>
          :
          <div className="buttons buttons-left">
            <ReportButton className="button-small" name={featuredProject.id} id={featuredProject.id}/>
          </div>
        }

        <div className="buttons buttons-right">

          {currentUser.login && <AddProjectToCollection className="button-small" api={api} currentUser={currentUser} project={featuredProject} fromProject={true} addProjectToCollection={addProjectToCollection}/>}

          
          <RemixButton className="button-small"
            name={featuredProject} isMember={isAuthorized}
            onClick={() => trackRemix(featuredProject.id, featuredProject.domain)}
          />
        </div>
      </section>
    </>
    )
};

FeaturedProject.propTypes = {
  api: PropTypes.func,
  isAuthorized: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  featuredProject: PropTypes.object,
  addProjectToCollection: PropTypes.func,
  projectOptions: PropTypes.object.isRequired,
};

const EntityPagePinnedProjects = ({api, projects, pins, currentUser, isAuthorized, removePin, projectOptions, featuredProjectId, addProjectToCollection,}) => {
  const pinnedSet = new Set(pins.map(({projectId}) => projectId));
  const pinnedProjects = projects.filter( ({id}) => pinnedSet.has(id)).filter ( ({id}) => id != featuredProjectId); 
  const featuredProject = projects[0];
  // const featuredProject = Object.is(featuredProjectId, undefined) ? projects.filter( ({id}) => id == featuredProjectId).first() : undefined;
  
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
              {...{api, isAuthorized, currentUser, addProjectToCollection}}
              projectOptions={isAuthorized && {...projectOptions}}
              featuredProject={featuredProject}
            />
         }

         {pinnedProjects.length > 0 && 
            <ProjectsList title=""
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
