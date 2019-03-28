import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProjectItem from './project-item';
import ExpanderContainer from '../components/containers/expander';
import Badge from '../components/badges/badge';

import Heading from '../components/text/heading';

function ProjectsList({ title, placeholder, extraClasses, ...props }) {
  return (
    <article className={`projects ${extraClasses}`}>
      <Heading tagName="h2">{title}</Heading>

      {!!(placeholder && !props.projects.length) && <div className="placeholder">{placeholder}</div>}

      <ExpandyProjects {...props} />
    </article>
  );
}

/*
const ProjectsList = ({ title, placeholder, extraClasses, ...props }) => (
  <article className={`projects ${extraClasses}`}>
    <Heading tagName="h2">{title}</Heading>

    {!!(placeholder && !props.projects.length) && <div className="placeholder">{placeholder}</div>}

    <ExpandyProjects {...props} />
  </article>
);
*/

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
  extraClasses: PropTypes.string,
};

ProjectsList.defaultProps = {
  placeholder: null,
  extraClasses: '',
};

function ExpandyProjects(props) {
  const [expanded, setExpanded] = useState(false);

  function handleClick() {
    setExpanded(true);
  }

  const maxProjects = props.maxCollapsedProjects;
  const totalProjects = props.projects.length;
  const hiddenProjects = totalProjects - maxProjects;

  // props needs to exclude projects, so can't be declared on a separate line as const
  let { projects } = props; // eslint-disable-line prefer-const

  let shouldShowButton = false;
  if (!expanded) {
    shouldShowButton = hiddenProjects > 0;
    projects = projects.slice(0, maxProjects);
  }

  return (
    <ExpanderContainer
      expanded={!shouldShowButton}
      controlArea={
        <div>
          <button>Paginate</button>
          <button className="button-tertiary" onClick={handleClick} type="button">
            Show all<Badge>{hiddenProjects}</Badge>
          </button>
        </div>
      }
    >
      <ProjectsUL projects={projects} {...props} />
    </ExpanderContainer>
  );
}

/*
class ExpandyProjects extends React.Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ expanded: true });
  }

  render() {
    const maxProjects = this.props.maxCollapsedProjects;
    const totalProjects = this.props.projects.length;
    const hiddenProjects = totalProjects - maxProjects;

    // props needs to exclude projects, so can't be declared on a separate line as const
    let { projects, ...props } = this.props; // eslint-disable-line prefer-const

    let shouldShowButton = false;
    if (!this.state.expanded) {
      shouldShowButton = hiddenProjects > 0;
      projects = projects.slice(0, maxProjects);
    }

    return (
      <ExpanderContainer
        expanded={!shouldShowButton}
        controlArea={
          <div>
            <button>Paginate</button>
            <button className="button-tertiary" onClick={this.handleClick} type="button">
              Show all<Badge>{hiddenProjects}</Badge>
            </button>
          </div>
        }
      >
        <ProjectsUL projects={projects} {...props} />
      </ExpanderContainer>
    );
  }
}
*/

ExpandyProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  maxCollapsedProjects: PropTypes.number,
};

ExpandyProjects.defaultProps = {
  maxCollapsedProjects: 12,
};

export const ProjectsUL = ({ ...props }) => (
  <ul className="projects-container">
    {props.projects.map((project) => (
      <ProjectItem key={project.id} {...{ project }} {...props} />
    ))}
  </ul>
);

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
};

export default ProjectsList;
