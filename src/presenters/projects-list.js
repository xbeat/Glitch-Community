import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Heading from 'Components/text/heading';
import ExpanderContainer from 'Components/containers/expander';
import ProjectItem from './project-item';


const ProjectsList = ({ title, placeholder, extraClasses, ...props }) => (
  <article className={`projects ${extraClasses}`}>
    <Heading tagName="h2">{title}</Heading>

    {!!(placeholder && !props.projects.length) && <div className="placeholder">{placeholder}</div>}

    <ExpandyProjects {...props} />
  </article>
);

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
  const handleClick = () => setExpanded(true);

  const maxProjects = props.maxCollapsedProjects;
  const totalProjects = props.projects.length;
  const hiddenProjects = totalProjects - maxProjects;

  let shouldShowButton = false;
  let visibleProjects = props.projects;
  if (!expanded) {
    shouldShowButton = hiddenProjects > 0;
    visibleProjects = props.projects.slice(0, maxProjects);
  }

  return (
    <ExpanderContainer
      expanded={!shouldShowButton}
      controlArea={
        <button className="button-tertiary" onClick={handleClick} type="button">
          Show {hiddenProjects} More
        </button>
      }
    >
      <ProjectsUL {...props} projects={visibleProjects} />
    </ExpanderContainer>
  );
}

ExpandyProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  maxCollapsedProjects: PropTypes.number,
};

ExpandyProjects.defaultProps = {
  maxCollapsedProjects: 12,
};

export const ProjectsUL = ({ showProjectDescriptions, ...props }) => (
  <ul className="projects-container">
    {props.projects.map((project) => (
      <ProjectItem key={project.id} project={project} showProjectDescriptions={showProjectDescriptions} {...props} />
    ))}
  </ul>
);

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
  showProjectDescriptions: PropTypes.bool,
};

ProjectsUL.defaultProps = {
  showProjectDescriptions: true,
};

export default ProjectsList;
