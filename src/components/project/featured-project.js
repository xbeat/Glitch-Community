import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';
import Note from '../../presenters/note';
import styles from './featured-project.styl';

const FeaturedProject = ({ featuredProject, unfeatureProject, isAuthorized, currentUser, addProjectToCollection, trackingOrigin, noteOptions }) => {
  const TopLeft = () => (
    <Heading tagName="h2">
      Featured Project
      <Emoji name="clapper" />
      {featuredProject.note && (
        <Note 
          project={featuredProject}
          collection={noteOptions.collection}
          updateNote={noteOptions.updateNote} 
          hideNote={noteOptions.hideNote}
          saveNote={noteOptions.saveNote}
          isAuthorized={isAuthorized}
        />
      )}
    </Heading>
  );

  const TopRight = () => {
    if (!isAuthorized) return null;
    return <div className={styles.unfeatureBtn} id="featured-project-embed"><FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} /></div>;
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
  noteOptions: PropTypes.object,
};

FeaturedProject.defaultProps = {
  unfeatureProject: null,
  noteOptions: {},
};

export default FeaturedProject;
