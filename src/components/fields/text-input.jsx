import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import InputErrorMessage from './input-error-message';
import InputErrorIcon from './input-error-icon';
import useUniqueId from './hook-unique-id';

import styles from './text-input.styl';
const cx = classNames.bind(styles);

const TYPES = [
  'email',
  'password',
  'search',
  'text',
];

const TextInput = ({className, error, onChange, opaque, postfix, prefix, search, ...props}) => {
  const uniqueId = useUniqueId();
  const outerClassName = cx('outer', className);
  const borderClassName = cx({
    'input-flex': true,
    underline: !opaque,
    opaque: opaque,
  });
  const inputClassName = cx({
    'input-part': true,
    input: true,
    search: search,
  });
  return (
    <label className={outerClassName} htmlFor={uniqueId}>
      <div className={flexClassName}>
        {!!prefix && <span className={styles.inputPart}>{prefix}</span>}
        <input id={uniqueId} className={inputClassName} onChange={evt => onChange(evt.target.value)} {...props}/>
        {!!error && <InputErrorIcon/>}
        {!!postfix && <span className={styles.inputPart}>{postfix}</span>}
      </div>
      {!!error && <InputErrorMessage error={error}/>}
    </label>
  );
};

TextInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  opaque: PropTypes.bool,
  placeholder: PropTypes.string,
  postfix: PropTypes.node,
  prefix: PropTypes.node,
  search: PropTypes.bool,
  type: PropTypes.oneOf(TYPES),
  value: PropTypes.string,
};

export default TextInput;