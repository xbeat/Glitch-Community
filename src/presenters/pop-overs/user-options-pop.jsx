import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import CreateTeamPop from './create-team-pop.jsx'; 




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

const CreateTeamButton = (toggleCreateTeamPop) => {
  if (userIsAnon) {
    return (
      <React.Fragment>
        <p className="description action-description">
          <a href="#">Sign in</a> 
          <span> to create a team</span>
        </p>
        <button className="button button-small has-emoji button-tertiary" disabled={true}>
          <span>Create Team </span>
          <span className="emoji herb"></span>
        </button>
      </React.Fragment>
    )
  }
  
  return (
    <div onClick={toggleCreateTeamPop} className="button button-small has-emoji button-tertiary">
      <span>Create Team </span>
      <span className="emoji herb"></span>
    </div>
  )
}

// TODO
// have to pass is anon down, just !hasTeams is inaccurate for showing the sign in to create team state
const TeamList = ({teams, toggleCreateTeamPop}) => {
  const hasTeams = teams && teams.length;

  //anons, anons w teams, signed in w no teams, signed in w teams
  
  
  if(!hasTeams) {
    return (
      <section className="pop-over-actions">
      </section>
    )
  }
  
  return (
    <section className="pop-over-actions">
      <div onClick={toggleCreateTeamPop} className="button button-small has-emoji button-tertiary">
        <span>Create Team </span>
        <span className="emoji herb"></span>
      </div>

      {teams.map((team) => (
        <Team key={team.name} {...team}/>
      ))}

    </section>
  );
};

TeamList.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
};



const UserOptionsPop = ({toggleUserOptionsPop, userLink, avatarUrl, avatarStyle, teams, showNewStuffOverlay, toggleCreateTeamPop}) => {
  const clickNewStuff = (event) => {
    toggleUserOptionsPop();
    showNewStuffOverlay();
    event.stopPropagation();
  };
  
  const signOut = () => {
    /* global analytics */
    analytics.track("Logout");
    analytics.reset();
    localStorage.removeItem('cachedUser');
    return location.reload();
  };

  return (
    <dialog className="pop-over user-options-pop">
      <section className="pop-over-actions">
        <a className="button-link" href={userLink}>
          <div className="button button-small has-emoji button-tertiary">
            <span>Your Profile </span>
            <img className="emoji avatar" src={avatarUrl} style={avatarStyle} alt="Your avatar"></img>
          </div>
        </a>
      </section>

      <TeamList teams={teams} toggleCreateTeamPop={toggleCreateTeamPop}/>

      <section className="pop-over-info section-has-tertiary-buttons">      
        <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={clickNewStuff}>
          <span>New Stuff </span>
          <span className="emoji dog-face"></span>
        </button>
        <a className="button-link" href="https://support.glitch.com">
          <div className="button button-small has-emoji button-tertiary button-on-secondary-background">
            <span>Support </span>
            <span className="emoji ambulance"></span>
          </div>
        </a>        
        <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={signOut}>
          <span>Sign Out</span>
          <span className="emoji balloon"></span>
        </button>
      </section>
    </dialog>
  );
};

UserOptionsPop.propTypes = {
  toggleUserOptionsPop: PropTypes.func.isRequired,
  userLink: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};


export default function UserOptionsPopContainer(props) {
  const {avatarUrl, avatarStyle, api} = props;
  return (
    
    <PopoverContainer>
      {({togglePopover: toggleUserOptionsPop, visible: userOptionsPopVisible}) => (
        <PopoverContainer>
          {({togglePopover: toggleCreateTeamPop, visible: createTeamPopVisible, hidePopover: hideCreateTeamPop}) => (
          <div className="button user-options-pop-button" data-tooltip="User options" data-tooltip-right="true">
            <button className="user" onClick={() => {toggleUserOptionsPop(); hideCreateTeamPop(); }}>
              <img src={avatarUrl} style={avatarStyle} width="30px" height="30px" alt="User options"/>
              <span className="down-arrow icon"/>
            </button>
            {userOptionsPopVisible && <UserOptionsPop {...props} toggleUserOptionsPop={toggleUserOptionsPop} toggleCreateTeamPop={() => { toggleUserOptionsPop(); toggleCreateTeamPop(); }}/>}
            {createTeamPopVisible && <CreateTeamPop api={api} toggleUserOptionsPop={() => {  toggleCreateTeamPop(); toggleUserOptionsPop(); }} />}
          </div>
        )}
      </PopoverContainer>
    )}
    </PopoverContainer>
  );
}

UserOptionsPopContainer.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

