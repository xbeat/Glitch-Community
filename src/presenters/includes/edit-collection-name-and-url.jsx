import React from 'react';
import PropTypes from 'prop-types';
import {kebabCase} from 'lodash';

import {OptimisticValue, TrimmedValue} from './field-helpers.jsx';
import {PureEditableWrappingField} from './editable-wrapping-field.jsx';

// This recreates EditableField but OptimisticValue tracks both the name and url
// That way the url preview updates in real time as you type into the name field

export const EditCollectionNameAndUrl = ({name, url, update, isAuthorized}) => {
  const placeholder = 'Name your collection';
  return (
    <OptimisticValue value={{name, url}} update={update} resetOnError={false}>
      {({value: nameAndUrl, update, error}) => (
        <TrimmedValue value={nameAndUrl.name} update={name => update({name, url: kebabCase(name)})}>
          {({value: name, update}) => (
            <h1 className="collection-name">
              {(isAuthorized
                ? <PureEditableWrappingField value={name} update={update} placeholder={placeholder} error={error}/>
                : name
              )}
            </h1>
          )}
        </TrimmedValue>
      )}
    </OptimisticValue>
  );
};
EditCollectionNameAndUrl.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

export default EditCollectionNameAndUrl;