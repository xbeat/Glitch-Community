import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

export class OptimisticValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null, // value is only set when waiting for server response
      error: null, // error is only set if there is an error ¯\_(ツ)_/¯
    };
    
    this.onChange = this.onChange.bind(this);
    this.update = debounce(this.update.bind(this), 500);
  }
  
  async update(value) {
    try {
      await this.props.update(value);
      this.setState((prevState, props) => {
        // if value didn't change during this update then switch back to props
        if (prevState.value === props.value) {
          return {value: null, error: null};
        }
        return {error: null};
      });
    } catch (error) {
      this.setState((prevState, props) => {
        // The update failed; we can ignore this if our state has already moved on
        if (prevState.value !== value) {
          return {};
        }
        
        // Ah, we haven't moved on, and we know the last edit failed.
        // Ok, display an error.
        if (props.resetOnError) {
          return {error, value: null};
        }
        return {error};
      });
    }
  }
  
  onChange(value) {
    // note that we trim update, that means we won't reset value if there's whitespace at the end
    // if we did it would clip off whitespace in the input and potentially trip up slow typers
    // maybe we should add in awareness of input focus so the whitespace resets on blur?
    this.update(value.trim());
    this.setState({value});
  }
  
  render() {
    return this.props.children({
      value: this.state.value !== null ? this.state.value : this.props.value,
      error: this.state.error,
      update: this.onChange,
    });
  }
}
OptimisticValue.propTypes = {
  value: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  resetOnError: PropTypes.bool,
};
OptimisticValue.defaultProps = {
  resetOnError: true,
};

export const FieldErrorMessage = ({error}) => (
  <span className="editable-field-error-message">
    <span className="editable-field-error-icon" role="img" aria-label="Warning">🚒</span>
    {error}
  </span>
);
FieldErrorMessage.propTypes = {
  error: PropTypes.node.isRequired,
};