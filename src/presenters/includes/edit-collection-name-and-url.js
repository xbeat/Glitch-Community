import React from 'react';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';

import useOptimisticValue from 'Components/fields/use-optimistic-value';
import { TrimmedValue } from './field-helpers';
import { PureEditableWrappingField } from './editable-wrapping-field';

// This recreates EditableField but useOptimisticValue tracks both the name and url
// That way the url preview updates in real time as you type into the name field

const EditCollectionNameAndUrl = ({ name, url, update, isAuthorized }) => {
  const placeholder = 'Name your collection';
  const [optimisticValue, error, optimisticUpdate] = useOptimisticValue({ name, url }, update);
  return (
    <TrimmedValue value={optimisticValue.name} update={(newName) => optimisticUpdate({ name: newName, url: kebabCase(newName) })}>
      {({ value: trimmedValue, update: trimmedUpdate }) => (
        <h1 className="collection-name">
          {isAuthorized ? <PureEditableWrappingField value={trimmedValue} update={trimmedUpdate} placeholder={placeholder} error={error} /> : name}
        </h1>
      )}
    </TrimmedValue>
  );
};
EditCollectionNameAndUrl.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

export default EditCollectionNameAndUrl;
