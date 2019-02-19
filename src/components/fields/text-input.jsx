import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InputErrorMessage from './input-error-message';
import InputErrorIcon from './input-error-icon';
import useUniqueId from './use-unique-id';

import styles from './text-input.styl';

const TYPES = [
  'email',
  'password',
  'search',
  'text',
];

const InputPart = ({children}) => {
  return <span className={styles.inputPart}>{children}</span>;
};

const TextInput = ({autoFocus, disabled, error, name, onChange, opaque, placeholder, postfix, prefix, type, value}) => {
  const uniqueId = useUniqueId();
  const borderClassName = classNames(styles.inputBorder, {
    [styles.underline]: !opaque,
    [styles.opaque]: opaque,
  });
  const inputClassName = classNames(styles.inputPart, styles.input, {
    [styles.search]: type === 'search',
  });
  return (
    <label className={styles.outer} htmlFor={uniqueId}>
      <div className={borderClassName}>
        {!!prefix && <InputPart>{prefix}</InputPart>}
        <input
          autoFocus={autoFocus}
          className={inputClassName}
          disabled={disabled}
          id={uniqueId}
          name={name}
          onChange={evt => onChange(evt.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        {!!error && <InputPart><InputErrorIcon/></InputPart>}
        {!!postfix && <InputPart>{postfix}</InputPart>}
      </div>
      {!!error && <InputErrorMessage error={error}/>}
    </label>
  );
};

TextInput.propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  opaque: PropTypes.bool,
  placeholder: PropTypes.string,
  postfix: PropTypes.node,
  prefix: PropTypes.node,
  type: PropTypes.oneOf(TYPES),
  value: PropTypes.string,
};

TextInput.defaultProps = {
  autoFocus: undefined,
  disabled: undefined,
  error: null,
  name: undefined,
  onChange: undefined,
  opaque: false,
  placeholder: undefined,
  postfix: null,
  prefix: null,
  type: undefined,
  value: undefined,
};

export default TextInput;