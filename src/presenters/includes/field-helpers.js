import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

export class TrimmedValue extends React.Component {
  constructor(props) {
    super(props);
    let valueToStore = props.value;
    if (valueToStore === null) {
      valueToStore = '';
    }
    this.state = { value: valueToStore };
    this.update = this.update.bind(this);
  }

  update(value) {
    this.props.update(value.trim());
    this.setState({ value });
  }

  render() {
    return this.props.children({
      value: this.state.value.trim() === this.props.value ? this.state.value : this.props.value,
      update: this.update,
    });
  }
}
TrimmedValue.propTypes = {
  value: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
};

export const FieldErrorIcon = () => (
  <span className="editable-field-error-icon" role="img" aria-label="Warning">
    🚒
  </span>
);

export const FieldErrorMessage = ({ error, hideIcon }) => (
  <span className="editable-field-error-message">
    {!hideIcon && <FieldErrorIcon />}
    {error}
  </span>
);
FieldErrorMessage.propTypes = {
  error: PropTypes.node.isRequired,
  hideIcon: PropTypes.bool,
};
FieldErrorMessage.defaultProps = {
  hideIcon: false,
};
