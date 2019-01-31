import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind';
import styles from './project-callout.css'
import Button from '../../atoms/button/button'
import { getLink as getProjectLink } from '../../models/project';

let cx = classNames.bind(styles);

/**
 * Button Component
 */
const ProjectCallout = ( domain ) => {
  return (
    <a href={getProjectLink({ domain })} className="project-callout" rel="noopener noreferrer">
      <Button>
        "hello"
      </Button>
    </a>
  )
}

ProjectCallout.propTypes = {
  /** project object */
  domain: PropTypes.string.isRequired
};

export default ProjectCallout