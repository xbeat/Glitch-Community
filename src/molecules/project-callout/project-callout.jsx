import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind';
import styles from './project-callout.css'
import Button from '../../atoms/button/button'
import { getLink as getProjectLink } from '../../models/project';

let cx = classNames.bind(styles);

/**
 * ProjectCallout Component
 */
const ProjectCallout = ({ domain }) => {
  return (
    <a href={getProjectLink({ domain })} rel="noopener noreferrer">
      <div className="project-callout">
        <Button type="cta">
          { domain }
        </Button>
      </div>
    </a>
  )
}

ProjectCallout.propTypes = {
  /** project object */
  domain: PropTypes.string.isRequired
};

export default ProjectCallout