import React from 'react';
import PropTypes from 'prop-types';
import {debounce, uniqueId} from 'lodash';

export class PureEditableField extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  
  componentDidMount() {
    if (this.props.autoFocus) {
      this.textInput.current.select();
    }
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.submitError !== this.props.submitError) {
      // focus the field if an error has been created
      if (this.props.submitError.length) {
        this.textInput.current.select();
      }
    }
  }
  
  render() {
    const classes = ["content-editable", this.props.submitError ? "error" : ""].join(" ");
    const inputProps = {
      className: classes,
      value: this.props.value,
      onChange: this.props.update,
      spellCheck: false,
      autoComplete: "off",
      placeholder: this.props.placeholder,
      id: uniqueId("editable-field-"),
      autoFocus: this.props.autoFocus,
    };
    
    const maybeErrorIcon = !!this.props.submitError && (
      <span className="editable-field-error-icon" role="img" aria-label="Warning">🚒</span>
    );
    
    const maybeErrorMessage = !!this.props.submitError && (
      <div className="editable-field-error-message">
        {this.props.submitError}
      </div>
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
  submitError: PropTypes.string,
};

export default class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      error: "",
    };
    
    this.onChange = this.onChange.bind(this);
    this.pending = false;
    const debouncedUpdate = debounce(async value => {
      await this.update(value);
      this.pending = false;
    }, 500);
    this.debouncedUpdate = value => {
      this.pending = true;
      debouncedUpdate(value);
    };
  }
  
  componentDidUpdate(prevProps) {
    if (!this.pending && prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value,
        error: "",
      });
    }
  }

  async update(value) {
    try {
      await this.props.update(value);
      this.setState({error: ""});
      if (!this.pending) {
        this.setState({value: this.props.value});
      }
    } catch (message) {
      // The update failed; we can ignore this if our state has already moved on
      if (value.trim() !== this.state.value.trim()) {
        return;
      }

      // Ah, we haven't moved on, and we know the last edit failed.
      // Ok, display an error.
      this.setState({error: message || ""});
    }
  }

  onChange(evt) {
    const value = evt.target.value;
    this.setState((lastState) => {
      if(lastState.value.trim() !== value.trim()) {
        this.debouncedUpdate(value.trim());
      }
      return {value};
    });
  }
  
  render() {
    return (
      <PureEditableField
        {...this.props}
        value={this.state.value}
        update={this.onChange}
        submitError={this.state.error}
      />
    );
  }
}
EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
};
