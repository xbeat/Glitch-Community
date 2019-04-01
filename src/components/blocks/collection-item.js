import React from 'react';
import PropTypes from 'prop-types';

const styles = {}

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
})

const SmallCollectionItem = ({ collection }) => (
  <div className={styles.smallContainer}>
    <CollectionLink collection={collection}
      className={styles.smallBody}
      style={collectionColorStyles(collection)}>
      <div>
      
      </div>
      <div className={styles.smallProjectCount}>
        <Pluralize count={collection.projectCount} singular="project" /> →
      </div>
    </CollectionLink>
  </div>
)