import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProjectItem from './project-item';
import ExpanderContainer from '../components/containers/expander';
import Button from '../components/buttons/button';
import Badge from '../components/badges/badge';

import Heading from '../components/text/heading';

function ProjectsList({ title, placeholder, extraClasses, ...props }) {
  return (
    <article className={`projects ${extraClasses}`}>
      <Heading tagName="h2">{title}</Heading>

      {!!(placeholder && !props.projects.length) && <div className="placeholder">{placeholder}</div>}

      <PaginatedProjects {...props} />
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
  const [visibleProjects, setVisibleProjects] = useState(null);
  const [shouldShowButton, setShouldShowButton] = useState(false);

  const maxProjects = props.maxCollapsedProjects;
  const totalProjects = props.projects.length;
  const hiddenProjects = totalProjects - maxProjects;

  useEffect(() => {
    if (!visibleProjects) {
      if (!expanded) {
        setShouldShowButton(hiddenProjects > 0);
        setVisibleProjects(props.projects.slice(0, maxProjects));
      } else {
        setVisibleProjects(props.projects);
      }
    }
  });

  function handleClick() {
    setExpanded(true);
  }

  // props needs to exclude projects, so can't be declared on a separate line as const
  // let { projects } = props; // eslint-disable-line prefer-const

  return (
    <ExpanderContainer
      expanded={expanded}
      controlArea={
        <div>
          <button>Paginate</button>
          <button className="button-tertiary" onClick={handleClick} type="button">
            Show all<Badge>{hiddenProjects}</Badge>
          </button>
        </div>
      }
    >
      <ProjectsUL projects={visibleProjects} {...props} />
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

function PaginatedProjects(props) {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  let {projects, projectsPerPage} = props; // TODO update where this is passed in

  const numProjects = projects.length;
  const numPages = Math.ceil(projects.length / projectsPerPage);
  const hiddenProjects = numProjects - projectsPerPage;
  const shouldPaginate = !expanded && projectsPerPage < numProjects;

  if (shouldPaginate && !expanded) {
    const startIdx = (page - 1) * projectsPerPage;
    projects = projects.slice(startIdx, startIdx + projectsPerPage);
  }

  const PaginationControls = () => (
    <div>
      <Button type="tertiary" disabled={page === 1} onClick={() => setPage(page - 1)}>
        &larr; Previous
      </Button>
      <span>
        {page} / {numPages}
      </span>
      <Button type="tertiary" disabled={page === numPages} onClick={() => setPage(page + 1)}>
        Next &rarr;
      </Button>
    </div>
  );

  const ExpandButton = () => (
    <Button type="tertiary" onClick={() => setExpanded(true)}>
      Show all<Badge>{hiddenProjects}</Badge>
    </Button>
  );

  return (
    <>
      <ProjectsUL {...props} projects={projects} />
      {shouldPaginate ? (
        <div>
          <PaginationControls />
          <ExpandButton />
        </div>
      ) : null}
    </>
  );
}

PaginatedProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  projectsPerPage: PropTypes.number,
};

PaginatedProjects.defaultProps = {
  projectsPerPage: 12,
};

// ExpandyProjects.propTypes = {
//   projects: PropTypes.array.isRequired,
//   maxCollapsedProjects: PropTypes.number,
// };

// ExpandyProjects.defaultProps = {
//   maxCollapsedProjects: 12,
// };

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
