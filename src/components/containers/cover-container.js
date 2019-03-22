import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './cover-container.styl';
import { getProfileStyle as getTeamStyle } from '../../models/team';
import { getProfileStyle as getUserStyle } from '../../models/user';

const cx = classNames.bind(styles);
// Cover Container

const CoverContainer = ({ buttons, children, className, entity, ...props }) => {
  const { user, team } = entity;
  const entityStyle = user ? getUserStyle(user) : getTeamStyle(team);
  return (
    <div style={entityStyle} className={`${cx({ 'cover-container': true })} ${className}`} {...props}>
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
