import React from 'react';
import PropTypes from 'prop-types';

import {CurrentUserConsumer} from '../current-user.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';

export class AddTeamProjectPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {projects: []};
    this.onClick = this.onClick.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }
  
  updateFilter(query) {
    const projects = this.filterProjects(query, this.props.myProjects, this.props.teamProjects);
    this.setState({projects});
  }
  
  componentDidMount() {
    this.updateFilter("");
  }
  
  filterProjects(query, myProjects, teamProjects) {
    query = query.toLowerCase().trim();
    const teamProjectIds = teamProjects.map(({id})=>id);
    const availableProjects = myProjects.filter(
      ({id}) => !teamProjectIds.includes(id)
    );
    
    const maxProjects = 20;
    if(!query) {
      return availableProjects.splice(0,maxProjects);
    }
    const projects = [];
    for(let project of availableProjects) {
      if(projects.length > maxProjects){
        break;
      }
      const titleMatch = project.domain.toLowerCase().includes(query);
      const descMatch = project.description.toLowerCase().includes(query);
      if(titleMatch || descMatch) {
        projects.push(project);
      }
    }
    return projects;
  }
  
  onClick(event, project) {
    event.preventDefault();
    this.props.togglePopover();
    this.props.addProject(project);
  }

  render() {
    const showResults = this.state.projects.length > 0;
    return (
      <dialog className="pop-over add-team-project-pop">
        <section className="pop-over-info">
          <input
            onChange={(event) => {this.updateFilter(event.target.value);}}
            id="team-project-search" className="pop-over-input search-input pop-over-search"
            placeholder="Filter your projects"
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </section>
        { showResults && (
          <section className="pop-over-actions results-list">
            <ul className="results">
              { this.state.projects.map((project) => (
                <li key={project.id}>
                  <ProjectResultItem 
                    action={(event) => this.onClick(event, project)} 
                    {...project}
                    title={project.domain}/>
                </li>
              ))}
            </ul>
          </section>
        )}
      </dialog>
    );
  }
}

AddTeamProjectPop.propTypes = {
  myProjects: PropTypes.array.isRequired,
  teamProjects: PropTypes.array.isRequired,
  addProject: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

const AddTeamProjectPopContainer = (props) => (
  <CurrentUserConsumer>
    {currentUser => <AddTeamProjectPop myProjects={currentUser.projects} {...props}/>}
  </CurrentUserConsumer>
);

export default AddTeamProjectPopContainer;
