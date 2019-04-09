import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import FeaturedProjectOptionsPop from '../../presenters/pop-overs/featured-project-options-pop';
import Note from '../../presenters/note';
import styles from './featured-project.styl';

<<<<<<< HEAD
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
    />
  </Heading>
);
=======
const FeaturedProject = ({ featuredProject, unfeatureProject, isAuthorized, currentUser, addProjectToCollection }) => {
  const TopLeft = () => (
    <Heading tagName="h2">
      Featured Project
      <Emoji name="clapper" />
    </Heading>
  );
>>>>>>> 2403c2e6eb317bd173907f5edafd3110e9067231


const FeaturedProject = ({
  addProjectToCollection,
  collection,
  currentUser,
  displayNewNote,
  featuredProject,
  hideNote,
  isAuthorized,
  trackingOrigin,
  updateNote,
  unfeatureProject,
}) => {
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
    />
  );
};

FeaturedProject.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  displayNewNote: PropTypes.func.isRequired,
  featuredProject: PropTypes.func.isRequired,
  hideNote: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
<<<<<<< HEAD
  trackingOrigin: PropTypes.string.isRequired,
  updateNote: PropTypes.func.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
=======
  featuredProject: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  unfeatureProject: PropTypes.func,
};

FeaturedProject.defaultProps = {
  unfeatureProject: null,
>>>>>>> 2403c2e6eb317bd173907f5edafd3110e9067231
};

export default FeaturedProject;
