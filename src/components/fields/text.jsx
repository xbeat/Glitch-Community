import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

const TextField = ({className, opaque, search, ...props}) => {
  const wrapperClassName = cx({
    'input-wrap': true,
    'underline': !opaque,
    'opaque': opaque,
    'search': search,
  }, className);
  return (
    <label className={wrapperClassName}>
      <input className={cx('text-input', 'input-part')} {...props}/>
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
  search: PropTypes.bool,
  value: PropTypes.string,
};

export default TextField;