import React from 'react';
import PropTypes from 'prop-types';
import ProjectResultItem from '../includes/project-result-item.jsx';

export class DeleteTeamPop extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {};
  }
    
  // componentDidMount() {
  // }
  
//   filterProjects(query, myProjects, teamProjects) {
//     query = query.toLowerCase().trim();
//     const teamProjectIds = teamProjects.map(({id})=>id);
//     const availableProjects = myProjects.filter(
//       ({id}) => !teamProjectIds.includes(id)
//     );
    
//     const maxProjects = 20;
//     if(!query) {
//       return availableProjects.splice(0,maxProjects);
//     }
//     const projects = [];
//     for(let project of availableProjects) {
//       if(projects.length > maxProjects){
//         break;
//       }
//       const titleMatch = project.domain.toLowerCase().includes(query);
//       const descMatch = project.description.toLowerCase().includes(query);
//       if(titleMatch || descMatch) {
//         projects.push(project);
//       }
//     }
//     return projects;
//   }
  
  // onClick(event, projectId) {
  //   event.preventDefault();
  //   this.props.togglePopover();
  //   this.props.addProject(projectId);
  // }

  adminUsersList() {
    
  }
  
  render() {
    return (
      <dialog className="pop-over add-team-project-pop">
        <section className="pop-over-info">
          <p>Delete {this.props.teamName}</p>
        </section>
        <section className="pop-over-actions">
          <p>Deleting this team will</p>
        </section>
      </dialog>
    );
  }
}

DeleteTeamPop.propTypes = {
  api: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  adminUsers: PropTypes.array.isRequired,
  togglePopover: PropTypes.func.isRequired,
};


export default DeleteTeamPop;
