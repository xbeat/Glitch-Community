import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';
import ReportButton from '../../presenters/pop-overs/report-abuse-pop';
import { EditButton, RemixButton } from '../../presenters/includes/project-actions';
import AddProjectToCollection from '../../presenters/includes/add-project-to-collection';
import { TrackClick } from '../../presenters/analytics';

import styles from './featured-project.styl';

const FeaturedProject = ({ isAuthorized, currentUser, unfeatureProject, addProjectToCollection, featuredProject }) => {
  const TopLeft = () => (
    <div className={styles.header}>
      <Heading tagName="h2">
        Featured Project
        <Emoji name="clapper" />
      </Heading>
    </div>
  );
  
  const TopRight = () => {
    if (!isAuthorized) return null;   
    return <FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} />;
  }
  
  const BottomLeft = () => {
    if (isAuthorized) {
      return <EditButton name={featuredProject.id} isMember={isAuthorized} size="small" />
    } else {
      return <ReportButton reportedType="project" reportedModel={featuredProject} />
    }
  };
  
  const BottomRight = () => (
    <>
      {
        currentUser.login && (
          <AddProjectToCollection
            currentUser={currentUser}
            project={featuredProject}
            fromProject
            addProjectToCollection={addProjectToCollection}
          />
        )
      }
      <TrackClick
        name="Click Remix"
        properties={{
          baseProjectId: featuredProject.id,
          baseDomain: featuredProject.domain,
        }}
      >
        <RemixButton name={featuredProject.domain} isMember={isAuthorized} />
      </TrackClick>
    </>
  );
  
  return (
    <ProjectEmbed 
      project={featuredProject}
      topLeft={<TopLeft />}
      topRight={<TopRight />}
      bottomLeft={<BottomLeft />}
      bottomRight={<BottomRight />}
    />
  );
};

FeaturedProject.propTypes = {
  currentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  featuredProject: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

FeaturedProject.defaultProps = {
  currentUser: {},
};

export default FeaturedProject;
