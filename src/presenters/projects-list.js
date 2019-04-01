import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import ProjectItem from './project-item';
import Button from '../components/buttons/button';
import Badge from '../components/badges/badge';
import TextInput from '../components/inputs/text-input';
import Heading from '../components/text/heading';

function ProjectsList({ title, placeholder, extraClasses, enableFiltering, enablePagination, ...props }) {
  const [filter, setFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isDoneFiltering, setIsDoneFiltering] = useState(false);

  const validFilter = filter.length > 1;

  let { projects } = props;

  function filterProjects() {
    setIsDoneFiltering(false);

    if (validFilter) {
      setFilteredProjects(props.projects.filter((p) => p.domain.includes(filter) || p.description.toLowerCase().includes(filter)));
      setIsDoneFiltering(true);
    } else {
      setFilteredProjects([]);
    }
  }

  useEffect(() => debounce(filterProjects, 400)(), [filter]);

  const filtering = validFilter && isDoneFiltering;
  projects = filtering ? filteredProjects : projects;

  let projectsEl;
  if (enablePagination) {
    projectsEl = <PaginatedProjects {...props} projects={projects} />;
  } else {
    projectsEl = <ProjectsUL {...props} projects={projects} />;
  }

  const placeholderEl = filtering ? (
    <div className="filter-results-placeholder">
      <img alt="" src="https://cdn.glitch.com/bc50f686-4c0a-4e20-852f-3999b29e8092%2Fcompass.svg?1545073264846" />
      <p>No projects found</p>
    </div>
  ) : (
    props.placeholder
  );

  return (
    <article className={`projects ${extraClasses}`}>
      <div className="header">
        <Heading tagName="h2">{title}</Heading>
        {enableFiltering ? (
          <TextInput className="header-search" name="q" onChange={setFilter} opaque placeholder="find a project" type="search" value={filter} />
        ) : null}
      </div>

      {projects.length ? projectsEl : placeholderEl}
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
  enableFiltering: false,
  enablePagination: false,
};

function PaginatedProjects(props) {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  let { projects, projectsPerPage } = props;

  const numProjects = projects.length;
  const numPages = Math.ceil(projects.length / projectsPerPage);
  const hiddenProjects = numProjects - projectsPerPage;
  const canPaginate = !expanded && projectsPerPage < numProjects;

  if (!expanded && canPaginate) {
    const startIdx = (page - 1) * projectsPerPage;
    projects = projects.slice(startIdx, startIdx + projectsPerPage);
  }

  const PaginationControls = () => (
    <div class="pagination-controls">
      <Button type="tertiary" disabled={page === 1} onClick={() => setPage(page - 1)}>
        <img alt="" className="arrow" src="https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269" />
      </Button>
      <div className="pages">
        {page} / {numPages}
      </div>
      <Button type="tertiary" disabled={page === numPages} onClick={() => setPage(page + 1)}>
        <img alt="" className="arrow next-arrow" src="https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269" />
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

export const ProjectsUL = ({ showProjectDescriptions, ...props }) => (
  <ul className="projects-container">
    {props.projects.map((project) => (
      <li key={project.id}>
        <ProjectItem key={project.id} project={project} showProjectDescriptions={showProjectDescriptions} {...props} />
      </li>
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
