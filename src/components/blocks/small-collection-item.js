import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';

import Markdown from 'Components/text/markdown';

import { createAPIHook } from '../../state/api';
import { getSingleItem } from '../../../shared/api';
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
    return (
      <UserLink user={teamOrUser}>
        <UserAvatar user={teamOrUser} />
      </UserLink>
    );
  }
  return (
    <TeamLink team={teamOrUser}>
      <TeamAvatar team={teamOrUser} />
    </TeamLink>
  );
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
          <div className={styles.collectionNameWrap}>
            <FakeButton>
              {collection.private && <PrivateIcon />}
              <div className={styles.collectionName}>{collection.name}</div>
            </FakeButton>
          </div>
        </div>
        <div className={styles.description}>
          <Markdown>{collection.description || ' '}</Markdown>
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
