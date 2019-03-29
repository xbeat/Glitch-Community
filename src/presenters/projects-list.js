import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import ProjectItem from './project-item';
import Button from '../components/buttons/button';
import Badge from '../components/badges/badge';
import TextInput from '../components/fields/text-input';
import Heading from '../components/text/heading';

function ProjectsList({ title, placeholder, extraClasses, ...props }) {
  const [filter, setFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [debouncedFilter, setDebouncedFilter] = useState(null);
  const [isDoneFiltering, setIsDoneFiltering] = useState(false);

  const validFilter = filter.length > 1;

  let { projects } = props;

  function filterProjects() {
    setIsDoneFiltering(false);

    if (validFilter) {
      setFilteredProjects(
        props.projects.filter((p) => {
          return (
            p.domain.includes(filter) ||
            p.description.toLowerCase().includes(filter)
          );
        }),
      );
      setIsDoneFiltering(true);
    } else {
      setFilteredProjects([]);
    }
  }

  useEffect(
    () => {
      setDebouncedFilter(debounce(filterProjects, 300));
      debouncedFilter();
    },
    [filter],
  );

  let projectsEl;
  if (isDoneFiltering && validFilter(filter)) {
    if (filteredProjects.length) {
      projectsEl = <ProjectsUL {...props} projects={filteredProjects} />;
    } else {
      projectsEl = 'No results';
    }
  } else {
    projectsEl = <PaginatedProjects {...props} projects={projects} />;
  }

  return (
    <article className={`projects ${extraClasses}`}>
      <div className="header">
        <Heading tagName="h2">{title}</Heading>
        {isDoneFiltering ? 'Done!' : 'not done'}
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

      {projectsEl}
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

function PaginatedProjects(props) {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  let { projects, projectsPerPage } = props; // TODO update where this is passed in

  const numProjects = projects.length;
  const numPages = Math.ceil(projects.length / projectsPerPage);
  const hiddenProjects = numProjects - projectsPerPage;
  const canPaginate = !expanded && projectsPerPage < numProjects;

  if (!expanded && canPaginate) {
    const startIdx = (page - 1) * projectsPerPage;
    projects = projects.slice(startIdx, startIdx + projectsPerPage);
  }

  const PaginationControls = () => (
    <div>
      <Button
        type="tertiary"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <img
          alt=""
          className="arrow"
          src="https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269"
        />
      </Button>
      <div className="pages">
        {page} / {numPages}
      </div>
      <Button
        type="tertiary"
        disabled={page === numPages}
        onClick={() => setPage(page + 1)}
      >
        <img
          alt=""
          className="arrow next-arrow"
          src="https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269"
        />
      </Button>
    </div>
  );

  return (
    <>
      <ProjectsUL {...props} projects={projects} />

      {canPaginate ? (
        <div className="view-controls">
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

export const ProjectsUL = ({ ...props }) => {
  return (
    <ul className="projects-container">
      {props.projects.map((project) => (
        <ProjectItem key={project.id} {...{ project }} {...props} />
      ))}
    </ul>
  );
};

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
};

export default ProjectsList;
