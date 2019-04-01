import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

import Markdown from 'Components/text/markdown';

import CollectionAvatar from '../../presenters/includes/collection-avatar';
import { CollectionLink, UserLink, TeamLink } from '../../presenters/includes/link';
import { UserAvatar, TeamAvatar } from '../../presenters/includes/avatar';

import styles from './collection-item.styl';

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
});

const FakeButton = ({ children }) => <div className="button">{children}</div>;
const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />;

const CollectionCurator = ({ collection }) => {
  if (collection.user) {
    return (
      <UserLink user={collection.user}>
        <UserAvatar user={collection.user} />
      </UserLink>
    );
  }
  if (collection.team && collection.team.url) {
    return (
      <TeamLink team={collection.team}>
        <TeamAvatar team={collection.team} />
      </TeamLink>
    );
  }
  return <div className={styles.placeholderAvatar} />;
};

const SmallCollectionItem = ({ collection }) => (
  <div className={styles.smallContainer}>
    <div className={styles.curator}>
      <CollectionCurator collection={collection} />
    </div>
    <CollectionLink collection={collection} className={styles.bubbleContainer} style={collectionColorStyles(collection)}>
      <div className={styles.smallNameDescriptionArea}>
        <div className={styles.nameArea}>
          <div className={styles.collectionAvatarContainer}>
            <CollectionAvatar color={collection.coverColor} collectionId={collection.id} />
          </div>
          <FakeButton>
            {collection.private && <PrivateIcon />}
            <div className={styles.collectionName}>{collection.name}</div>
          </FakeButton>
        </div>
        <div className={styles.description}>
          <Markdown>{collection.description}</Markdown>
        </div>
      </div>
      <div className={styles.smallProjectCount}>
        <Pluralize count={collection.projectCount} singular="project" /> →
      </div>
    </CollectionLink>
  </div>
);

SmallCollectionItem.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    user: PropTypes.object,
    team: PropTypes.object,
  }).isRequired,
};

export default SmallCollectionItem;
