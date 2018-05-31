import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: this.props.value,
    };
    
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  
  onChange(evt) {
    const value = evt.currentTarget.value.trim();
    this.setState({ value });
    this.props.update(value);
  }
  
  onFocus(evt) {
    if (evt.currentTarget === evt.target) {
      this.setState({focused: true});
    }
  }
  
  onBlur() {
    this.setState({focused: false});
  }
  
  render() {
    return (
      <input
        className="content-editable"
        value={this.state.value}
        onChange={this.onChange}
        autoComplete="off"
        spellCheck={false}
        placeholder={this.props.placeholder}
        />
    );
  }
}
EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
};

const AuthField = ({authorized, value, placeholder, update}) => {
  if(!authorized) {
    return <span>{value}</span>
  }
  return <EditableField {...{value, update, placeholder}}/>
};
AuthField.propTypes = {
  authorized: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func,
};

export { EditableField, AuthField };