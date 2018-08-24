import React from 'react';
import PropTypes from 'prop-types';
import {debounce, uniqueId} from 'lodash';

export class PureEditableField extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.onChange = this.onChange.bind(this);
  }
  
  componentDidMount() {
    if (this.props.autoFocus) {
      this.textInput.current.select();
    }
  }
  
  onChange(evt) {
    this.props.update(evt.target.value);
  }
  
  render() {
    const classes = ["content-editable", this.props.error ? "error" : ""].join(" ");
    const inputProps = {
      className: classes,
      value: this.props.value,
      onChange: this.onChange,
      spellCheck: false,
      autoComplete: "off",
      placeholder: this.props.placeholder,
      id: uniqueId("editable-field-"),
      autoFocus: this.props.autoFocus,
    };
    
    const maybeErrorIcon = !!this.props.error && (
      <span className="editable-field-error-icon" role="img" aria-label="Warning">🚒</span>
    );
    
    const maybeErrorMessage = !!this.props.error && (
      <span className="editable-field-error-message">
        {this.props.error}
      </span>
    );
    
    const maybePrefix = !!this.props.prefix && (
      <span className={"content-editable-affix " + classes}>{this.props.prefix}</span>
    );
    
    const maybeSuffix = !!this.props.suffix && (
      <span className={"content-editable-affix " + classes}>{this.props.suffix}</span>
    );
    
    return (
      <label htmlFor={inputProps.id}>
        <span className="editable-field-flex">
          {maybePrefix}
          <input {...inputProps} ref={this.textInput} />
          {maybeErrorIcon}
          {maybeSuffix}
        </span>
        {maybeErrorMessage}
      </label>
    );
  }
}
PureEditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
  error: PropTypes.string,
};

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
      this.setState(prevState => {
        // if value didn't change during this update then switch back to props
        if (prevState.value !== null && prevState.value === value) {
          return {value: null, error: null};
        }
        return {error: null};
      });
    } catch (message) {
      // The update failed; we can ignore this if our state has already moved on
      if (this.state.value === null || this.state.value !== value) {
        return;
      }
      
      // Ah, we haven't moved on, and we know the last edit failed.
      // Ok, display an error.
      this.setState({error: message});
    }
  }
  
  onChange(value) {
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
};

const EditableField = ({value, update, ...props}) => (
  <OptimisticValue value={value} update={update}>
    {valueProps => (
      <PureEditableField {...props} {...valueProps}/>
    )}
  </OptimisticValue>
);
export default EditableField;
EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
};
