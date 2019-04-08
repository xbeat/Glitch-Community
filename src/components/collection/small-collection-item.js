import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import { UserAvatar, TeamAvatar } from 'Components/images/avatar';

import { createAPIHook } from '../../state/api';
import { getSingleItem } from '../../../shared/api';
import CollectionAvatar from '../../presenters/includes/collection-avatar';

import styles from './collection-item.styl';

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
});

const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />;

const useTeamOrUser = createAPIHook(async (api, teamId, userId) => {
  if (teamId > 0) {
    const value = await getSingleItem(api, `/v1/teams/by/id/?id=${teamId}`, teamId);
    return { ...value, type: 'team' };
  }
  if (userId > 0) {
    const value = await getSingleItem(api, `/v1/users/by/id/?id=${userId}`, userId);
    return { ...value, type: 'user' };
  }
  return null;
});

const CollectionCurator = ({ collection }) => {
  const { value: teamOrUser } = useTeamOrUser(collection.teamId, collection.userId);
  if (!teamOrUser) {
    return <div className={styles.placeholderAvatar} />;
  }

  if (teamOrUser.type === 'user') {
    return <UserAvatar user={teamOrUser} />;
  }
  return <TeamAvatar team={teamOrUser} />;
};

const CollectionLink = ({ collection, children, ...props }) => (
  <a href={`/@${collection.fullUrl}`} {...props}>
    {children}
  </a>
);

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
          <div className={styles.collectionNameWrap}>
            <Button decorative>
              {collection.private && <PrivateIcon />}
              <div className={styles.collectionName}>{collection.name}</div>
            </Button>
          </div>
        </div>
        <div className={styles.description}>
          <Markdown>{collection.description || ' '}</Markdown>
        </div>
      </div>
      <div className={styles.smallProjectCount}>
        <Pluralize count={collection.projects.length} singular="project" /> →
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
    userId: PropTypes.number,
    teamId: PropTypes.number,
  }).isRequired,
};

export default SmallCollectionItem;
