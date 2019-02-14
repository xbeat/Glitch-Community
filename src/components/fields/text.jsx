import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

const TextField = ({className, opaque, postfix, prefix, search, ...props}) => {
  const wrapperClassName = cx({
    wrap: true,
    underline: !opaque,
    opaque: opaque,
  }, className);
  const inputClassName=cx({
    input: true,
    part: true,
    search: search,
  });
  return (
    <label className={wrapperClassName}>
      {!!prefix && <div className={cx('part')}>{prefix}</div>}
      <input className={inputClassName} {...props}/>
      {!!postfix && <div className={cx('part')}>{postfix}</div>}
    </label>
  );
};

TextField.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  opaque: PropTypes.bool,
  placeholder: PropTypes.string,
  postfix: PropTypes.node,
  prefix: PropTypes.node,
  search: PropTypes.bool,
  value: PropTypes.string,
};

export default TextField;