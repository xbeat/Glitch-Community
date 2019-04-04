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

const FeaturedProject = ({ featuredProject, unfeatureProject, isAuthorized, currentUser, addProjectToCollection }) => {
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
  
  return (
    <ProjectEmbed 
      topLeft={<TopLeft />}
      topRight={<TopRight />}
      project={featuredProject}
      unfeatureProject={unfeatureProject}
      isAuthorized={isAuthorized}
      currentUser={currentUser}
      addProjectToCollection={addProjectToCollection}
    />
  );
};

FeaturedProject.propTypes = {
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  featuredProject: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

export default FeaturedProject;
