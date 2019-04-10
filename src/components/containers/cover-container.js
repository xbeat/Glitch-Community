import React from 'react';
import PropTypes from 'prop-types';

export const CoverContainer = ({ buttons, children, className, ...props }) => (
  <div className={`cover-container ${className}`} {...props}>
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