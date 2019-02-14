import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

const inputTypes = [
  'email',
  'password',
  'search',
  'text',
];

const TextField = ({className, error, onChange, opaque, postfix, prefix, search, ...props}) => {
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
  return (
    <label className={outerClassName}>
      <div className={flexClassName}>
        {!!prefix && <span className={cx('input-part')}>{prefix}</span>}
        <input className={inputClassName} onChange={evt => onChange(evt.target.value)} {...props}/>
        {!!error && <span className={cx('input-part')} role="img" aria-label="Warning">🚒</span>}
        {!!postfix && <span className={cx('input-part')}>{postfix}</span>}
      </div>
      {!!error && <div className={cx('error')}>{error}</div>}
    </label>
  );
};

TextField.propTypes = {
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
  type: PropTypes.oneOf(inputTypes),
  value: PropTypes.string,
};

export default TextField;