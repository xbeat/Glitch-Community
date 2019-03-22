/* globals CDN_URL */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './cover-container.styl';


const cx = classNames.bind(styles);

const cacheBuster = Math.floor(Math.random() * 1000);

export function getProfileStyle(entityType, { id, hasCoverImage, coverColor, cache = cacheBuster, size = 'large' }) {
  const customImage = `${CDN_URL}/${entityType}-cover/${id}/${size}?${cache}`;
  const defaultImage = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625';
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${hasCoverImage ? customImage : defaultImage}')`,
  };
}

// Cover Container
const CoverContainer = ({ buttons, children, className, entity, entityType, ...props }) => (
  <div style={getProfileStyle(entityType, entity)} className={`${cx({ 'cover-container': true })} ${className}`} {...props}>
    {children}
    {buttons}
  </div>
);

CoverContainer.propTypes = {
  children: PropTypes.node.isRequired,
  // There is no need to use these, you can pass everything as 'children', this just supports
  buttons: PropTypes.node, 
  className: PropTypes.string, 
};

CoverContainer.defaultProps = {
  className: '',
  buttons: null,
};

export default CoverContainer;
