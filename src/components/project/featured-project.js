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
    {collection && (<Note
      project={featuredProject}
      collection={collection}
      updateNote={updateNote}
      hideNote={hideNote}
      isAuthorized={isAuthorized}
    />)}
  </Heading>
);

const TopRight = (props) => {
  if (!isAuthorized) return null;
  return (
    <div className={styles.unfeatureBtn} id="featured-project-embed">
      <FeaturedProjectOptionsPop ...props />
    </div>;
};
const FeaturedProject = ({
  addProjectToCollection,
  collection,
  currentUser,
  displayNewNote,
  featuredProject,
  hideNote,
  isAuthorized,
  updateNote,
  unfeatureProject,
}) => {


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
  currentUser: PropTypes.object.isRequired,
  featuredProject: PropTypes.func.isRequired,
  hideNote: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  updateNote: PropTypes.func.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  collection: PropTypes.object,
  displayNewNote: PropTypes.func,
};

FeaturedProject.defaultProps = {
  collection: null,
  displayNewNote: null,
};

export default FeaturedProject;
