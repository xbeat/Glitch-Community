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
class ProjectCallout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
    this.handleHover = this.handleHover.bind(this);
  }
  
  handleHover() {
    this.setState({ hover: true });
  }
  
  render() {
    return (
    <a href={ getProjectLink(this.props.domain) } rel="noopener noreferrer">
      <div className="project-callout" onMouseOver={ this.handleHover }>
        <Button type="cta" className={this.state.hover && "hover"}>
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