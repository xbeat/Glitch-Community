import React from 'react';
import PropTypes from 'prop-types';

import FeaturedProjectOptionsPop from './pop-overs/featured-project-options-pop';
import { EditButton, RemixButton } from './includes/project-actions';
import Embed from './includes/embed';
import ReportButton from './pop-overs/report-abuse-pop';
import AddProjectToCollection from './includes/add-project-to-collection';
import { useAnalyticsTracker } from './analytics';

import Heading from '../components/text/heading';

const EntityPageFeaturedProject = ({ isAuthorized, currentUser, unfeatureProject, addProjectToCollection, featuredProject }) => {
  const onClickRemix = useAnalyticsTracker("Click Remix", {
    baseProjectId: featuredProject.id,
    baseDomain: featuredProject.domain,
  });
  
  const reportBtn = (
    <div className="buttons buttons-left">
      <ReportButton className="button-small" reportedType="project" reportedModel={featuredProject} />
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
        <Heading tagName="h2">{featuredTitle}</Heading>

        {isAuthorized && <FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} />}
        <Embed domain={featuredProject.domain} />

        {isAuthorized ? (
          <div className="buttons buttons-left">
            <EditButton name={featuredProject.id} isMember={isAuthorized} size="small" />
          </div>
        ) : (
          reportBtn
        )}

        <div className="buttons buttons-right">
          {currentUser.login && (
            <AddProjectToCollection
              className="button-small"
              currentUser={currentUser}
              project={featuredProject}
              fromProject
              addProjectToCollection={addProjectToCollection}
            />
          )}

          <RemixButton name={featuredProject.domain} isMember={isAuthorized} onClick={onClickRemix} />
        </div>
      </section>
    </>
  );
};

EntityPageFeaturedProject.propTypes = {
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
