import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';
import Note from '../../presenters/note';
import styles from './featured-project.styl';

const TopLeft = ({ featuredProject, collection, updateNote, hideNote, isAuthorized }) => (
  <Heading tagName="h2">
    Featured Project
    <Emoji name="clapper" />
    <Note 
      project={featuredProject}
      collection={collection}
      updateNote={updateNote} 
      hideNote={hideNote}
      isAuthorized={isAuthorized}
      isFromFeatured={true}
    />
  </Heading>
);


const FeaturedProject = ({ featuredProject, unfeatureProject, isAuthorized, currentUser, addProjectToCollection, trackingOrigin, collection, displayNewNote, updateNote, hideNote }) => {
  const TopRight = () => {
    if (!isAuthorized) return null;
    return <div className={styles.unfeatureBtn} id="featured-project-embed"><FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} displayNewNote={() => displayNewNote(featuredProject.id)} /></div>;
  };

  return (
    <ProjectEmbed
      topLeft={<TopLeft 
        featuredProject={featuredProject}
        collection={collection}
        hideNote={hideNote}
        updateNote={updateNote}
        isAuthorized={isAuthorized}
      />}
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
