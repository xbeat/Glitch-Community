import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './cover-container.styl';

const cx = classNames.bind(styles);
// Cover Container

const CoverContainer = ({ buttons, children, className, ...props }) => (
  <div className={`${cx({ 'cover-container': true })} ${className}`} {...props}>
    {children}
    {buttons}
  </div>
);

CoverContainer.propTypes = {
  buttons: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CoverContainer.defaultProps = {
  className: '',
  buttons: null,
};

export default CoverContainer;
