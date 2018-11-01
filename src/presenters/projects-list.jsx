import React from 'react';
import PropTypes from 'prop-types';
import ProjectItem from "./project-item.jsx";

export const ProjectsList = ({title, projects, placeholder, projectOptions}) => (
  <article className="projects">
    <h2>{title}</h2>

    {!!(placeholder && !projects.length) && (
      <div className="placeholder">{placeholder}</div>
    )}

    <ExpandyProjects {...{projects, projectOptions}}></ExpandyProjects>

  </article>
);

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
};

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
  return (
    <ul className="projects-container">
      { projects.map(project => (
        <ProjectItem key={project.id} {...{project, projectOptions, categoryColor}}></ProjectItem>
      ))}
    </ul>
  );
};

ProjectsUL.propTypes = {
  projects: PropTypes.array.isRequired,
};


export default ProjectsList;
