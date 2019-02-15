import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './input-wrap.styl';

const cx = classNames.bind(styles);

const TYPES = [
  'email',
  'password',
  'search',
  'text',
];

const TextInput = ({className, error, onChange, opaque, postfix, prefix, search, ...props}) => {
  const outerClassName = cx('outer', className);
  const flexClassName = cx({
    'input-box': true,
    underline: !opaque,
    opaque: opaque,
  });
  const inputClassName=cx({
    input: true,
    'input-part': true,
    search: search,
  });
  const partClassName = cx('input-part');
  return (
    <label className={outerClassName}>
      <div className={flexClassName}>
        {!!prefix && <span className={partClassName}>{prefix}</span>}
        <input className={inputClassName} onChange={evt => onChange(evt.target.value)} {...props}/>
        {!!error && <span className={partClassName} role="img" aria-label="Warning">🚒</span>}
        {!!postfix && <span className={partClassName}>{postfix}</span>}
      </div>
      {!!error && <div className={cx('error')}>{error}</div>}
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