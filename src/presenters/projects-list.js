import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ProjectItem from './project-item';
import ExpanderContainer from '../components/containers/expander';
import Button from '../components/buttons/button';
import Badge from '../components/badges/badge';
import TextInput from '../components/fields/text-input';
import Heading from '../components/text/heading';
import { debounce } from 'lodash';

function ProjectsList({ title, placeholder, extraClasses, ...props }) {
  const [filter, setFilter] = useState('');
  const [filterTimeout, setFilterTimeout] = useState(null);

  // let { projects } = props;
  let projects = props.projects;

  function filterProjects() {
    console.log('filtering');

    if (filter.length) {
      projects = props.projects.filter((p) => {
        return (
          p.domain.includes(filter) ||
          p.description.toLowerCase().includes(filter)
        );
      });
    } else {
      projects = props.projects;
    }
    console.log(projects.length);
  }

  useEffect(
    () => {
      // debounce(filterProjects, 300);
      filterProjects();
    },
    [filter],
  );

  return (
    <article className={`projects ${extraClasses}`}>
      <div>
        <Heading tagName="h2">{title}</Heading>
        {props.enableFiltering ? (
          <TextInput
            className="header-search"
            name="q"
            onChange={setFilter}
            opaque
            placeholder="find a project"
            type="search"
            value={filter}
          />
        ) : null}
      </div>

      {!!(placeholder && !projects.length) && (
        <div className="placeholder">{placeholder}</div>
      )}

      {!filter && props.enablePagination ? (
        <PaginatedProjects {...props} projects={projects} />
      ) : (
        <ProjectsUL {...props} projects={projects} />
      )}
    </article>
  );
}

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
  extraClasses: PropTypes.string,
  enableFiltering: PropTypes.bool,
  enablePagination: PropTypes.bool,
};

ProjectsList.defaultProps = {
  placeholder: null,
  extraClasses: '',
};

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
            <button
              className="button-tertiary"
              onClick={this.handleClick}
              type="button"
            >
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

function PaginatedProjects(props) {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  
  let { projects, projectsPerPage } = props; // TODO update where this is passed in

  const numProjects = projects.length;
  const numPages = Math.ceil(projects.length / projectsPerPage);
  const hiddenProjects = numProjects - projectsPerPage;
  const canPaginate = !expanded && projectsPerPage < numProjects;
  
  if (!expanded && canPaginate) {
    const startIdx = (page - 1) * projectsPerPage
    projects = projects.slice(startIdx, startIdx + projectsPerPage);
  }

  const PaginationControls = () => (
    <div>
      <Button
        type="tertiary"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        &larr; Previous
      </Button>
      <span>
        {page} / {numPages}
      </span>
      <Button
        type="tertiary"
        disabled={page === numPages}
        onClick={() => setPage(page + 1)}
      >
        Next &rarr;
      </Button>
    </div>
  );

  return (
    <>
      <ProjectsUL {...props} projects={projects} />

      {canPaginate ? (
        <div>
          <PaginationControls />
          <Button type="tertiary" onClick={() => setExpanded(true)}>
            Show all<Badge>{hiddenProjects}</Badge>
          </Button>
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
  projectsPerPage: 6,
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
