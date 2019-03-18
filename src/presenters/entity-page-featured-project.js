import React from 'react';
import PropTypes from 'prop-types';

import FeaturedProjectOptionsPop from './pop-overs/featured-project-options-pop';
import { EditButton, RemixButton } from './includes/project-actions';
import Embed from './includes/embed';
import ReportButton from './pop-overs/report-abuse-pop';
import AddProjectToCollection from './includes/add-project-to-collection';
import { TrackClick } from './analytics';

const EntityPageFeaturedProject = ({ api, isAuthorized, currentUser, unfeatureProject, addProjectToCollection, featuredProject }) => {
  const reportBtn = (
    <div className="buttons buttons-left">
      <ReportButton reportedType="project" reportedModel={featuredProject} />
    </div>
  );

  const featuredTitle = (
    <>
      Featured Project
      <span className="emoji clapper emoji-in-title" />
    </>
  );

  return (
    <>
      <section id="featured-project-embed">
        <div className="featured-project-embed-header">
          <h2>{featuredTitle}</h2>

          {isAuthorized && <FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} />}
        </div>
        <Embed domain={featuredProject.domain} />

        {isAuthorized ? (
          <div className="buttons buttons-left">
            <EditButton name={featuredProject.id} isMember={isAuthorized} size="small" />
          </div>
        ) : (
          reportBtn
        )}

        <div className="buttons buttons-right margin">
          {currentUser.login && (
            <AddProjectToCollection
              className="button-small"
              api={api}
              currentUser={currentUser}
              project={featuredProject}
              fromProject
              addProjectToCollection={addProjectToCollection}
            />
          )}

          <TrackClick
            name="Click Remix"
            properties={{
              baseProjectId: featuredProject.id,
              baseDomain: featuredProject.domain,
            }}
          >
            <RemixButton className="button-small" name={featuredProject.domain} isMember={isAuthorized} />
          </TrackClick>
        </div>
      </section>
    </>
  );
};

EntityPageFeaturedProject.propTypes = {
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  unfeatureProject: PropTypes.func.isRequired,
  featuredProject: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

EntityPageFeaturedProject.defaultProps = {
  currentUser: null,
};

export default EntityPageFeaturedProject;
