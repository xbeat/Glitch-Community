import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import {CurrentUserConsumer} from '../current-user.jsx';

const PopoverButton = ({onClick, text, emoji}) => (
  <button className="button-small has-emoji button-tertiary" onClick={onClick}>
    <span>{text} </span>
    <span className={`emoji ${emoji}`}></span>
  </button>
);


// Project Options Pop

class ProjectOptionsPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserIsOnProject: false
    };
    // this.animate = this.animate.bind(this);
    // this.addPinAction = this.addPinAction.bind(this);
    // this.removePinAction = this.removePinAction.bind(this);
    // this.leaveProjectAction = this.leaveProjectAction.bind(this);
    // this.updateCurrentUserIsOnProject = this.updateCurrentUserIsOnProject.bind(this);
    // this.joinTeamProjectAction = this.joinTeamProjectAction.bind(this)
  }

  ComponentDidMount() {
    console.log('asdf')
    this.updateCurrentUserIsOnProject()
  }

  animate(event, className, func) {
    const projectContainer = event.target.closest('li');
    projectContainer.addEventListener('animationend', func, {once: true});
    projectContainer.classList.add(className);
    this.props.togglePopover();
  }
  
  addPinAction(event) {
    this.animate(event, 'slide-up', () => this.props.addPin(this.props.project.id));
  }
  
  removePinAction(event) {
    this.animate(event, 'slide-down', () => this.props.removePin(this.props.project.id));
  }
  
  leaveProjectAction(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${this.props.project.name}?`;
    if (window.confirm(prompt)) {
      this.props.leaveProject(this.props.project.id, event);
    }
  }
  
  updateCurrentUserIsOnProject() {
    let projectUsers = this.props.users.map(user => {
      return user.id
    })
    console.log (projectUsers, this.props.currentUser.id)
    if (projectUsers.includes(this.props.currentUser.id)) {
      this.setState({
        currentUserIsOnProject: true
      })
    } else {
      this.setState({
        currentUserIsOnProject: false
      })
    }
  }
  
  leaveTeamProjectAction() {
    this.props.leaveTeamProject(this.props.project.id, this.props.currentUser.id)
  }
  
  joinTeamProjectAction() {
    this.props.leaveTeamProject(this.props.project.id, this.props.currentUser.id)
  }
  
  deleteAction(event) {
    this.animate(event, 'slide-down', () => this.props.deleteProject(this.props.project.id));
  }
  
  render() {
    return (
      <dialog className="pop-over project-options-pop">
        <section className="pop-over-actions">
          {!!this.props.addPin && <PopoverButton onClick={this.addPinAction} text="Pin " emoji="pushpin"/>}
          {!!this.props.removePin && <PopoverButton onClick={this.removePinAction} text="Un-Pin " emoji="pushpin"/>}
        </section>

        <section className="pop-over-actions team-project-actions">
          {(!!this.props.joinTeamProject && !this.state.currentUserIsOnProject) &&
            <PopoverButton onClick={this.joinTeamProjectAction} text="Join Project " emoji="wave"/>
          }          
          {(!!this.props.leaveTeamProject && this.props.project.users.length > 1 && this.state.currentUserIsOnProject) &&
            <PopoverButton onClick={this.leaveTeamProjectAction} text="Leave Project " emoji="wave"/>
          }
          {(!!this.props.leaveProject && this.props.project.users.length > 1 ) &&
            <PopoverButton onClick={this.leaveProjectAction} text="Leave Project " emoji="wave"/>
          }
        </section>

        {(!!this.props.leaveProject && this.props.project.users.length > 1 ) &&
          <section className="pop-over-actions">
            <PopoverButton onClick={this.leaveProjectAction} text="Leave Project " emoji="wave"/>
          </section>
        }
        <section className="pop-over-actions danger-zone last-section">
          {!!this.props.removeProjectFromTeam && <PopoverButton onClick={() => this.props.removeProjectFromTeam(this.props.project.id)} text="Remove Project " emoji="thumbs_down"/>}
          {!!this.props.deleteProject && <PopoverButton onClick={this.deleteAction} text="Delete Project " emoji="bomb"/>}
        </section>
      </dialog>
    );
  }
  
};

ProjectOptionsPop.propTypes = {
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  addPin: PropTypes.func,
  removePin: PropTypes.func,
  deleteProject: PropTypes.func,
  leaveProject: PropTypes.func,
  removeProjectFromTeam: PropTypes.func,
  joinTeamProject: PropTypes.func,
  leaveTeamProject: PropTypes.func,
};


// Project Options Container

function currentUserIsOnProject() {
  let projectUsers = this.props.users.map(user => {
    return user.id
  })
  console.log (projectUsers, this.props.currentUser.id)
  if (projectUsers.includes(this.props.currentUser.id)) {
    return true
  }
}


export default function ProjectOptions({projectOptions={}, project}) {
  if(Object.keys(projectOptions).length === 0) {
    return null;
  }
    
  return (
    <PopoverContainer>
      {({togglePopover, visible}) => (
        <CurrentUserConsumer>
          {user => (
            <div>
              <button className="project-options button-borderless opens-pop-over" onClick={togglePopover}> 
                <div className="down-arrow" />
              </button>
              { visible && <ProjectOptionsPop project={project} {...projectOptions} togglePopover={togglePopover} currentUser={user} currentUserIsOnProject={currentUserIsOnProject}/> }
            </div>
          )}
        </CurrentUserConsumer>
      )}
    </PopoverContainer>
  );
}

ProjectOptions.propTypes = {
  project: PropTypes.object.isRequired,
}