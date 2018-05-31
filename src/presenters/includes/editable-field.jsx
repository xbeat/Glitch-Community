//import {AuthField} from './editable-field.jsx';

//<AuthField authorized={isAuthorized} value={name} update={updateName}/>

import React from 'react';
import PropTypes from 'prop-types';

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
    if(!this.props.authorized) {
      return <span>{this.props.value}</span>
    }
    
    return (
      <input
        className="content-editable"
        value={this.state.value}
        onChange={this.onChange}
        autoComplete="off"
        spellCheck={false}
             
    
    const {placeholder} = this.props;
    const {description} = this.state;
    return (this.state.focused
      ?
      <TextArea
        className="description content-editable"
        value={description}
        onChange={this.onChange}
        onFocus={this.onFocus} onBlur={this.onBlur}
        placeholder={placeholder}
        spellCheck={false}
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus
      />
      :
      <p
        className="description content-editable"
        placeholder={placeholder}
        role="textbox" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
        tabIndex={0} onFocus={this.onFocus} onBlur={this.onBlur}
      >
        <Markdown>{description}</Markdown>
      </p>
    );
  }
}
EditableDescription.propTypes = {
  initialDescription: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  updateDescription: PropTypes.func.isRequired,
};

const StaticDescription = ({description}) => (
  description ? <p className="description read-only"><Markdown>{description}</Markdown></p> : null
);
StaticDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

const AuthDescription = ({authorized, description, placeholder, update}) => (
  authorized ?
    <EditableDescription initialDescription={description} updateDescription={update} placeholder={placeholder}/> :
    <StaticDescription description={description}/>
);
AuthDescription.propTypes = {
  authorized: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  update: PropTypes.func.isRequired,
};

export { EditableDescription, StaticDescription, AuthDescription };