import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TextAreaAutosize from 'react-textarea-autosize';
import InputErrorMessage from './input-error-message';
import InputErrorIcon from './input-error-icon';
import useUniqueId from './use-unique-id';

import styles from './text-area.styl';

const TextArea = ({className, error, onChange, ...props}) => {
  const uniqueId = useUniqueId();
  const outerClassName = classNames(styles.inputWrap, className);
  return (
    <label className={outerClassName} htmlFor={uniqueId}>
      <div className={styles.inputBorder}>
        <TextAreaAutosize id={uniqueId} className={styles.input} onChange={evt => onChange(evt.target.value)} {...props}/>
        {!!error && <InputErrorIcon className={styles.errorIcon} />}
      </div>
      {!!error && <InputErrorMessage error={error}/>}
    </label>
  );
};

TextArea.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

TextArea.defaultProps = {
  className: undefined,
  disabled: undefined,
  error: null,
  name: undefined,
  onChange: undefined,
  placeholder: undefined,
  value: undefined,
}; 

export default TextArea;