import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';


const Team = ({url, name, teamAvatarUrl}) => (
  <a className="button-link" href={url}>
    <div className="button button-small has-emoji button-tertiary">
      <span>{name} </span>
      <img className="emoji avatar" src={teamAvatarUrl} alt={`${name} team avatar`} width="16px" height="16px"/>
    </div>
  </a>
);

Team.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  teamAvatarUrl: PropTypes.string.isRequired,
};


const TeamsList = ({teams, showCreateTeamPop}) => {
  const hasTeams = teams && teams.length;
  if(!hasTeams) {
    return null;
  }
  return (
    <section className="pop-over-actions">
      <button className="button-small has-emoji button-tertiary" onClick={showCreateTeamPop}>
        <span>Create Team </span>
        <span className="emoji dog-face"></span>
      </button>      
      

      {teams.map((team) => (
        <Team key={team.name} {...team}/>
      ))}
    </section>
  );
};

TeamsList.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
};


class UserOptionsPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      createTeamPopVisible: false,
    };
  }

  clickNewStuff(event) {
    console.log('newstuff', this)
    this.props.togglePopover();
    this.props.showNewStuffOverlay();
    event.stopPropagation();
  };

  showCreateTeamPop() {
    console.log('createTeam', this)
    this.props.togglePopover()
    this.setState({ createTeamPopVisible: true })
    console.log('📟', this.state.createTeamPopVisible)
  }
  
  signOut() {
    /* global analytics */
    analytics.track("Logout");
    analytics.reset();
    localStorage.removeItem('cachedUser');
    return location.reload();
  };

  render() {
    return (
      <dialog className="pop-over user-options-pop">
        <section className="pop-over-actions">
          <a className="button-link" href={this.props.userLink}>
            <div className="button button-small has-emoji button-tertiary">
              <span>Your Profile </span>
              <img className="emoji avatar" src={this.props.avatarUrl} style={this.props.avatarStyle} alt="Your avatar"></img>
            </div>
          </a>
        </section>
        <TeamsList teams={this.props.teams} togglePopover={this.togglePopover} showCreateTeamPop={this.showCreateTeamPop}/>
        <section className="pop-over-info section-has-tertiary-buttons">      
          <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={this.clickNewStuff}>
            <span>New Stuff </span>
            <span className="emoji dog-face"></span>
          </button>
          <a className="button-link" href="https://support.glitch.com">
            <div className="button button-small has-emoji button-tertiary button-on-secondary-background">
              <span>Support </span>
              <span className="emoji ambulance"></span>
            </div>
          </a>        
          <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={this.signOut}>
            <span>Sign Out</span>
            <span className="emoji balloon"></span>
          </button>
        </section>
      </dialog>
    );
  }
}

UserOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  userLink: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
};


export default function UserOptionsPopContainer(props) {
  const {avatarUrl, avatarStyle} = props;
  return (
    <PopoverContainer>
      {({togglePopover, visible}) => (
        <div className="button user-options-pop-button" data-tooltip="User options" data-tooltip-right="true">
          <button className="user" onClick={togglePopover}>
            <img src={avatarUrl} style={avatarStyle} width="30px" height="30px" alt="User options"/>
            <span className="down-arrow icon"/>
          </button>
          {visible && <UserOptionsPop {...props} togglePopover={togglePopover}/>}
        </div>
      )}
    </PopoverContainer>
  );
}
          
UserOptionsPopContainer.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  avatarStyle: PropTypes.object.isRequired,
};
