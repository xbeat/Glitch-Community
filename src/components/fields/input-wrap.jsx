import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import InputError from './input-error';

import styles from './input-wrap.styl';
const cx = classNames.bind(styles);

const InputWrap = ({className, error, onChange, opaque, postfix, prefix, search, ...props}) => {
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

InputWrap.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  error: PropTypes.node,
  opaque: PropTypes.bool,
  postfix: PropTypes.node,
  prefix: PropTypes.node,
};

export default InputWrap;