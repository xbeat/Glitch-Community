import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import { uniqueId } from 'lodash';

import {
  OptimisticValue,
  TrimmedValue,
  FieldErrorMessage,
} from './field-helpers';

export class PureEditableWrappingField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: uniqueId('editable-field-') };
    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.update(evt.target.value.replace(/\r?\n/g, ''));
  }

  render() {
    const classes = ['content-editable', this.props.error ? 'error' : ''].join(
      ' ',
    );
    const inputProps = {
      id: this.state.id,
      className: classes,
      value: this.props.value,
      onChange: this.onChange,
      spellCheck: false,
      autoComplete: 'off',
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,
    };

    return (
      <label htmlFor={inputProps.id}>
        <TextArea {...inputProps} />
        {!!this.props.error && <FieldErrorMessage error={this.props.error} />}
      </label>
    );
  }
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
        {valueProps => (
          <PureEditableWrappingField {...props} {...valueProps} error={error} />
        )}
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
