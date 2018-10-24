import React from 'react';
import PropTypes from 'prop-types';
import {uniqueId} from 'lodash';

import {OptimisticValue, TrimmedValue, FieldErrorIcon, FieldErrorMessage} from './field-helpers.jsx';

export class PureEditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: uniqueId("editable-field-") };
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
      id: this.state.id,
      className: classes,
      value: this.props.value,
      onChange: this.onChange,
      spellCheck: false,
      autoComplete: "off",
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,
    };
    
    const maybeErrorIcon = !!this.props.error && <FieldErrorIcon/>;
    
    const maybeErrorMessage = !!this.props.error && <FieldErrorMessage error={this.props.error} hideIcon={true}/>;
    
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
          <span className="editable-field-input">
            <input {...inputProps} ref={this.textInput} />
            {maybeErrorIcon}
          </span>
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

export const EditableField = ({value, update, ...props}) => (
  <OptimisticValue value={value} update={update} resetOnError={false}>
    {({value, update, error}) => (
      <TrimmedValue value={value} update={update}>
        {valueProps => (
          <PureEditableField {...props} {...valueProps} error={error}/>
        )}
      </TrimmedValue>
    )}
  </OptimisticValue>
);
EditableField.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  autoFocus: PropTypes.bool,
};

export default EditableField;