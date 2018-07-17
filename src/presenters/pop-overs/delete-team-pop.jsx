import React from 'react';
import PropTypes from 'prop-types';
import UsersList from "../users-list.jsx";
import Loader from '../includes/loader.jsx';

export class DeleteTeamPop extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      admins: [],
      teamIsDeleting: false,
    };
    this.deleteTeam = this.deleteTeam.bind(this);
  }
    
  componentDidMount() {
    let admins = this.props.users.filter(user => {
      return this.props.adminUsers.includes(user.id);
    });
    this.setState({
      admins: admins,
    });
  }
  
  deleteTeam() {
    if (this.state.teamIsDeleting) {
      return null;
    }
    this.setState({
      teamIsDeleting: true
    });
    let team = `teams/${this.props.teamId}`;
    this.props.api().delete(team)
      .then(({data}) => {
        window.location = '/';
      }).catch(error => {
        console.error("deleteTeam", error, error.response);
        this.setState({
          teamIsDeleting: false
        });
      // TODO: show generic error notification
      });    
  }
  
  currentUserIsAdmin() {
  }
  
  render() {
    let illustration = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621";
    return (
      <dialog className="pop-over delete-team-pop">
        <section className="pop-over-info">
          <div className="pop-title">
            Delete {this.props.teamName}
          </div>
        </section>
        <section className="pop-over-actions">
          <img className="illustration" src={illustration} role="img" aria-label="illustration" />
          <div className="action-description">
            Deleting {this.props.teamName} will remove this team page. No projects will be deleted, but only current project members will be able to edit them.
          </div>
        </section>
        <section className="pop-over-actions danger-zone">
          <button className="button button-small has-emoji opens-pop-over" onClick={this.deleteTeam}>
            <span>Delete {this.props.teamName} </span> 
            { !this.props.currentUserIsTeamAdmin && 
              <div className="status-badge">
                <span className="status admin">Admins</span>
              </div> 
            }
            <span className="emoji bomb" role="img" aria-label="bomb emoji"></span>
            { this.state.teamIsDeleting && <Loader /> }
          </button>
        </section>
        <section className="pop-over-info">
          <UsersList users={this.state.admins}/>
          <p className="info-description">This will also email all team admins, giving them an option to undelete it later</p>
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
  currentUserIsTeamAdmin: PropTypes.bool.isRequired
};


export default DeleteTeamPop;
