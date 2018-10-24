import React from 'react';
import PropTypes from 'prop-types';
import TextArea from 'react-textarea-autosize';
import {uniqueId} from 'lodash';

import {OptimisticValue, TrimmedValue, FieldErrorMessage} from './field-helpers.jsx';

export class PureEditableWrappingField extends React.Component {
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
    this.props.update(evt.target.value.replace(/\r?\n/g, ''));
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
    
    return (
      <label htmlFor={inputProps.id}>
        <TextArea {...inputProps} ref={this.textInput} />
        {!!this.props.error && <FieldErrorMessage error={this.props.error}/>}
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

export const EditableWrappingField = ({value, update, ...props}) => (
  <OptimisticValue value={value} update={update} resetOnError={false}>
    {({value, update, error}) => (
      <TrimmedValue value={value} update={update}>
        {valueProps => (
          <PureEditableWrappingField {...props} {...valueProps} error={error}/>
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

export default EditableWrappingField;