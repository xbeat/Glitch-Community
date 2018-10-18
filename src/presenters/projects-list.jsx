import React from 'react';
import PropTypes from 'prop-types';
import ProjectItem from "./project-item.jsx";

export const ProjectsList = ({api, ...props}) => (
  <article className="projects">
    <h2>{props.title}</h2>

    {!!(props.placeholder && !props.projects.length) && (
      <div className="placeholder">{props.placeholder}</div>
    )}

    <ProjectsUL api={api} {...props}></ProjectsUL>

  </article>
);

ProjectsList.propTypes = {
  api: PropTypes.any,
  projects: PropTypes.array.isRequired,
  title: PropTypes.node,
  placeholder: PropTypes.node,
  projectOptions: PropTypes.object.isRequired,
  projectCount: PropTypes.number,
};

export const ProjectsUL = ({api, ...props}) => {
  return (
    <React.Fragment>
      <ul className="projects-container">
        { props.projects.map(project => (
          <ProjectItem key={project.id} project={project} api={api} {...props}></ProjectItem>
        ))}
        
        {props.homepageCollection
          && <a href={props.collectionUrl} className="collection-view-all">View all {props.projectCount} projects →</a>
        }
        
      </ul>

    </React.Fragment>
  );
};

ProjectsUL.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.any,
  currentUser: PropTypes.object,
  projects: PropTypes.array.isRequired,
  projectOptions: PropTypes.object,
  collectionColor: PropTypes.string,
  homepageCollection: PropTypes.bool,
  collectionUrl: PropTypes.string,
};


export default ProjectsList;
