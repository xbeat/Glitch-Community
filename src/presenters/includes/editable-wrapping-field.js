import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import { uniqueId } from 'lodash';
import classNames from 'classnames';

import { OptimisticValue, TrimmedValue, FieldErrorMessage } from './field-helpers';

function useUniqueId(prefix) {
  const ref = useRef(uniqueId(prefix));
  return ref.current;
}

function PureEditableWrappingField({ value, placeholder, update, autoFocus, error }) {
  const id = useUniqueId('editable-field-');
  const onChange = (event) => {
    update(event.target.value.replace(/\r?\n/g, ''));
  };

  const inputProps = {
    id,
    className: classNames('content-editable', { error: error }),
    value,
    onChange,
    placeholder,
    autoFocus,
    spellCheck: false,
    autoComplete: 'off',
  };

  return (
    <label htmlFor={id}>
      <TextArea {...inputProps} />
      {!!error && <FieldErrorMessage error={error} />}
    </label>
  );
}

PureEditableWrappingField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
};

PureEditableWrappingField.defaultProps = {
  autoFocus: undefined,
  error: undefined,
};

export const EditableWrappingField = ({ value, update, ...props }) => (
  <OptimisticValue value={value} update={update} resetOnError={false}>
    {({ optimisticValue, optimisticUpdate, error }) => (
      <TrimmedValue value={optimisticValue} update={optimisticUpdate}>
        {(valueProps) => <PureEditableWrappingField {...props} {...valueProps} error={error} />}
      </TrimmedValue>
    )}
  </OptimisticValue>
);
EditableWrappingField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
};
EditableWrappingField.defaultProps = {
  autoFocus: undefined,
};

export default EditableWrappingField;
