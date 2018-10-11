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
  api: PropTypes.any.isRequired,
  projects: PropTypes.array.isRequired,
  title: PropTypes.node,
  placeholder: PropTypes.node,
  projectOptions: PropTypes.object.isRequired,
};

export const ProjectsUL = ({api, ...props}) => {
  return (
    <React.Fragment>
      <ul className="projects-container">
        { props.projects.map(project => (
            <ProjectItem key={project.id} project={project} api={api} {...props}></ProjectItem>
        ))}
        
        {/* The link to view all projects for collections on the homepage  TO DO show actual correct count of projects in categories*/}  
        {props.homepageCollection
          && <a href={props.collectionUrl} className="collection-view-all">View all {props.projects.length} projects →</a>
        }
        
      </ul>

    </React.Fragment>
  );
};

ProjectsUL.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.any.isRequired,
  currentUser: PropTypes.object,
  projects: PropTypes.array.isRequired,
  projectOptions: PropTypes.object.isRequired,
  categoryColor: PropTypes.string,
  homepageCollection: PropTypes.bool,
  collectionUrl: PropTypes.string,
};


export default ProjectsList;
