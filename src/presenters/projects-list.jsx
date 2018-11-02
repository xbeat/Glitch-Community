import React from 'react';
import PropTypes from 'prop-types';
import ProjectItem from "./project-item.jsx";

export const ProjectsList = ({api, ...props}) => (
  <article className="projects">
    <h2>{props.title}</h2>

    {!!(props.placeholder && !props.projects.length) && (
      <div className="placeholder">{props.placeholder}</div>
    )}

<<<<<<< HEAD
    <ProjectsUL api={api} {...props}></ProjectsUL>
=======
    <ExpandyProjects {...{projects, projectOptions}}></ExpandyProjects>
>>>>>>> 35e836243266b5299bf71937240a47dcdd2b0970

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

<<<<<<< HEAD
export const ProjectsUL = ({api, ...props}) => {
=======
class ExpandyProjects extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { expanded: false };
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    this.setState({expanded: true});
  }
  
  render() {
    const maxProjects = this.props.maxCollapsedProjects;
    const totalProjects = this.props.projects.length;
    const hiddenProjects = totalProjects - maxProjects;
    
    let projects = this.props.projects;
    
    let shouldShowButton = false;
    if(!this.state.expanded) {
      shouldShowButton = hiddenProjects > 0;
      projects = projects.slice(0, maxProjects);
    }
    
    return (
      <>
        <ProjectsUL projects={projects} projectOptions={this.props.projectOptions}/>
        { shouldShowButton && <button className="button-tertiary" onClick={this.handleClick}>Show {hiddenProjects} More</button>}
      </>
    );
  }
}

ExpandyProjects.propTypes = {
  projects: PropTypes.array.isRequired,
  projectOptions: PropTypes.object,
  maxCollapsedProjects: PropTypes.number,
};

ExpandyProjects.defaultProps = {
  maxCollapsedProjects: 12,
};


export const ProjectsUL = ({projects, projectOptions, categoryColor}) => {
>>>>>>> 35e836243266b5299bf71937240a47dcdd2b0970
  return (
    <React.Fragment>
      <ul className="projects-container">
        
        
        { props.projects.map(project => (
          <ProjectItem key={project.id} {...{project, api}} homepageCollection={props.homepageCollection} {...props}></ProjectItem>
        ))}
        
        {props.homepageCollection
          && <a href={props.collectionUrl} className="collection-view-all">View all {props.projectCount} projects →</a>
        }
        
      </ul>

    </React.Fragment>
  );
};

ProjectsUL.propTypes = {
  api: PropTypes.any,
  category: PropTypes.bool,
  currentUser: PropTypes.object,
  projects: PropTypes.array.isRequired,
  projectOptions: PropTypes.object,
  collectionColor: PropTypes.string,
  homepageCollection: PropTypes.bool,
  collectionUrl: PropTypes.string,
};


export default ProjectsList;
