import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';

import styles from './featured-project.styl';

const FeaturedProject = ({ featuredProject, unfeatureProject, isAuthorized, currentUser, addProjectToCollection, trackingOrigin }) => {
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
    return <div className={styles.unfeatureBtn}><FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} /></div>;
  };

  return (
    <ProjectEmbed
      topLeft={<TopLeft />}
      topRight={<TopRight />}
      project={featuredProject}
      unfeatureProject={unfeatureProject}
      isAuthorized={isAuthorized}
      currentUser={currentUser}
      addProjectToCollection={addProjectToCollection}
      trackingOrigin={trackingOrigin}
    />
  );
};

FeaturedProject.propTypes = {
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  featuredProject: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  trackingOrigin: PropTypes.string.isRequired,
  unfeatureProject: PropTypes.func,
};

FeaturedProject.defaultProps = {
  unfeatureProject: null,
};

export default FeaturedProject;
