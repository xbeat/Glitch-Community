import React from 'react';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';

import useOptimisticText from 'Components/fields/use-optimistic-text';
import { PureEditableWrappingField } from './editable-wrapping-field';

// This recreates EditableField but useOptimisticValue tracks both the name and url
// That way the url preview updates in real time as you type into the name field

const EditCollectionNameAndUrl = ({ name, update, isAuthorized }) => {
  const placeholder = 'Name your collection';
  const updateWithUrl = (name) => update({ name: name, url: kebabCase(name) });
  const [optimisticValue, error, optimisticUpdate] = useOptimisticText(name, updateWithUrl);

  return (
    <h1 className="collection-name">
      {isAuthorized ? <PureEditableWrappingField value={optimisticValue} update={optimisticUpdate} placeholder={placeholder} error={error} /> : name}
    </h1>
  );
};
EditCollectionNameAndUrl.propTypes = {
  name: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

export default EditCollectionNameAndUrl;
