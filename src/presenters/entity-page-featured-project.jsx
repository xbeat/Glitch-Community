/* global analytics APP_URL */

import React from 'react';
import PropTypes from 'prop-types';

import FeaturedProjectOptionsPop from "./pop-overs/featured-project-options-pop.jsx";
import {EditButton, RemixButton} from './includes/project-actions.jsx';
import ReportButton from './pop-overs/report-abuse-pop.jsx';
import AddProjectToCollection from './includes/add-project-to-collection.jsx';

function trackRemix(id, domain) {
  analytics.track("Click Remix", {
    origin: "project page",
    baseProjectId: id,
    baseDomain: domain,
  });
}

const EntityPageFeaturedProject = ({api, isAuthorized, currentUser, unfeatureProject, addProjectToCollection, featuredProject}) => {
  
  const reportBtn = 
    <div className="buttons buttons-left">
      <ReportButton className="button-small" reportedType="project" reportedModel={featuredProject} />
    </div>;
  
  return(
    <>
      <section id="featured-project-embed">            
        {isAuthorized && <FeaturedProjectOptionsPop api={api} unfeatureProject={unfeatureProject} featuredProjectId={featuredProject.id}/>}
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
          : reportBtn
        }

        <div className="buttons buttons-right">

          {currentUser.login && <AddProjectToCollection className="button-small" api={api} currentUser={currentUser} project={featuredProject} fromProject={true} addProjectToCollection={addProjectToCollection}/>}
          
          <RemixButton className="button-small"
            name={featuredProject.domain} isMember={isAuthorized}
            onClick={() => trackRemix(featuredProject.id, featuredProject.domain)}
          />
        </div>
      </section>
    </>
  );
};

EntityPageFeaturedProject.propTypes = {
  api: PropTypes.func,
  isAuthorized: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  unfeatureProject: PropTypes.func,
  featuredProject: PropTypes.object,
  addProjectToCollection: PropTypes.func,
};

export default EntityPageFeaturedProject;