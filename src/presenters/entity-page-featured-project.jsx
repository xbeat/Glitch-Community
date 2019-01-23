import React from 'react';
import PropTypes from 'prop-types';

import FeaturedProjectOptionsPop from "./pop-overs/featured-project-options-pop.jsx";
import {EditButton, RemixButton} from './includes/project-actions.jsx';
import Embed from './includes/embed.jsx';
import ReportButton from './pop-overs/report-abuse-pop.jsx';
import AddProjectToCollection from './includes/add-project-to-collection.jsx';
import {TrackClick} from './analytics';

const EntityPageFeaturedProject = ({api, isAuthorized, currentUser, unfeatureProject, addProjectToCollection, featuredProject}) => {
  
  const reportBtn = 
    <div className="buttons buttons-left">
      <ReportButton className="button-small" reportedType="project" reportedModel={featuredProject} />
    </div>;
  
  const featuredTitle = (
    <>
      Featured Project
      <span className="emoji clapper emoji-in-title"></span>
    </>
  );
  
  return(
    <>
      <section id="featured-project-embed">      
        <h2>{featuredTitle}</h2>
      
        {isAuthorized && <FeaturedProjectOptionsPop api={api} unfeatureProject={unfeatureProject}/>}
        <Embed domain={featuredProject.domain}/>
        
        {isAuthorized ?
          <div className="buttons buttons-left">
            <EditButton className="button-small button-edit" name={featuredProject.id} isMember={isAuthorized}/>
          </div>
          : reportBtn
        }

        <div className="buttons buttons-right">

          {currentUser.login && <AddProjectToCollection className="button-small" api={api} currentUser={currentUser} project={featuredProject} fromProject={true} addProjectToCollection={addProjectToCollection}/>}
          
          <TrackClick name="Click Remix" properties={{baseProjectId: featuredProject.id, baseDomain: featuredProject.domain}}>
            <RemixButton className="button-small"
              name={featuredProject.domain} isMember={isAuthorized}
            />
          </TrackClick>
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