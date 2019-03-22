import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './cover-container.styl';


const cx = classNames.bind(styles);
// Cover Container

export function getProfileStyle(entityType, { id, hasCoverImage, coverColor, cache = cacheBuster, size = 'large' }) {
  const customImage = `${CDN_URL}/${entityType}-cover/${id}/${size}?${cache}`;
  const defaultImage = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625';
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${hasCoverImage ? customImage : defaultImage}')`,
  };
}

const CoverContainer = ({ buttons, children, className, entity, ...props }) => {
  return (
    <div style={getProfileStyle(entity)} className={`${cx({ 'cover-container': true })} ${className}`} {...props}>
      {children}
      {buttons}
    </div>
  );
};

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
