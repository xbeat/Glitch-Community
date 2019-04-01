import React from 'react';
import PropTypes from 'prop-types';

const styles = {}

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
})

const FakeButton = ({ children }) => <div className="button">{children}</div>
const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />

const SmallCollectionItem = ({ collection }) => (
  <div className={styles.smallContainer}>
    <div className={styles.curator}>
      {collection.user && (
        <UserLink user={collection.user}>
          <UserAvatar user={collection.user} />
        </UserLink>
      )}
      {collection.team && (
        <TeamLink team={collection.team}>
          <TeamAvatar team={collection.team} />
        </TeamLink>
      )}
    </div>
    <CollectionLink collection={collection}
      className={styles.smallLink}
      style={collectionColorStyles(collection)}>
      <div className={styles.smallNameDescriptionArea}>
        <div className={styles.nameArea}>
          <CollectionAvatar color={collection.coverColor} collectionId={collection.id} />
          <FakeButton>
            {collection.private && <PrivateIcon />}
            <div className={styles.collectionName}>{collection.name}</div>
          </FakeButton>
        </div>
        <div className={styles.description}>
          {collection.description}
        </div>
      </div>
      <div className={styles.smallProjectCount}>
        <Pluralize count={collection.projectCount} singular="project" /> →
      </div>
    </CollectionLink>
  </div>
)