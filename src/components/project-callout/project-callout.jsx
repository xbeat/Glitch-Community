import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind';
import styles from './project-callout.styl'
import Button from '../buttons/button'
import { getLink as getProjectLink } from '../../models/project';

let cx = classNames.bind(styles);

/**
 * ProjectCallout Component
 */
class ProjectCallout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
    this.handleHover = this.handleHover.bind(this);
  }
  
  handleHover() {
    if (this.state.hover) { 
      this.setState({ hover: false })
    } else this.setState({ hover: true })
  }
  
  render() {
    return (
    <a href={ getProjectLink({ domain: this.props.domain }) } rel="noopener noreferrer">
      <div className="project-callout" onMouseOver={ this.handleHover } onMouseOut={ this.handleHover }>
        <Button type="cta" hover={ this.state.hover }>
          { this.props.domain }
        </Button>
      </div>
    </a>
    )
  }
}

ProjectCallout.propTypes = {
  /** project object */
  domain: PropTypes.string.isRequired
};

export default ProjectCallout