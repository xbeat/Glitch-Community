import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from '../../models/team';
import PopoverContainer from './popover-container.jsx';
import CreateTeamPop from './create-team-pop.jsx';


const TeamButton = ({url, name, ...team}) => (
  <a className="button-link" href={`/@${url}`}>
    <div className="button button-small has-emoji button-tertiary">
      <span>{name} </span>
      <img className="emoji avatar" src={getAvatarUrl({...team, size:'small'})} alt={`${name} team avatar`} width="16px" height="16px"/>
    </div>
  </a>
);

TeamButton.propTypes = {
  id: PropTypes.number.isRequired,
  hasAvatarImage: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};


// Create Team button (temp hidden in prod)

const CreateTeamButton = ({toggleCreateTeamPop, userIsAnon}) => {
  if (userIsAnon === true) {
    return (
      <React.Fragment>
        <button className="button button-small button-tertiary">Sign in</button>
        <p className="description action-description">
          to create a team
        </p>
        <button className="button button-small has-emoji button-tertiary" disabled={true}>
          <span>Create Team </span>
          <span className="emoji herb"></span>
        </button>
      </React.Fragment>
    );
  }
  return (
    <button onClick={toggleCreateTeamPop} className="button button-small has-emoji button-tertiary">
      <span>Create Team </span>
      <span className="emoji herb"></span>
    </button>
  );

};

CreateTeamButton.propTypes = {
  toggleCreateTeamPop: PropTypes.func.isRequired,
  userIsAnon: PropTypes.bool.isRequired,
};


// Team List

const TeamList = ({teams, /*toggleCreateTeamPop, userIsAnon*/}) => {
  // const hasTeams = teams && teams.length;
  return (!!teams.length &&
    <section className="pop-over-actions">
      {/* Temporary: enable once team creation is public
      <CreateTeamButton toggleCreateTeamPop={toggleCreateTeamPop} userIsAnon={userIsAnon} />
      */}
      {teams.map((team) => (
        <TeamButton key={team.name} {...team}/>
      ))}
    </section>
  );
};

TeamList.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  toggleCreateTeamPop: PropTypes.func.isRequired,
  userIsAnon: PropTypes.bool.isRequired,
};


// User Options Pop

const UserOptionsPop = ({
  toggleUserOptionsPop,
  userLink,
  avatarUrl,
  avatarStyle,
  teams,
  signOut,
  showNewStuffOverlay,
  toggleCreateTeamPop,
  userIsAnon,
  userName,
  userLogin,
}) => {
  const clickNewStuff = (event) => {
    toggleUserOptionsPop();
    showNewStuffOverlay();
    event.stopPropagation();
  };
  
  const clickSignout = () => {
    if(userIsAnon) {
      if(!window.confirm(`You won't be able to sign back in under this same anonymous account.
Are you sure you want to sign out?`)) {
        return;
      }
    }
    /* global analytics */
    analytics.track("Logout");
    analytics.reset();
    signOut();
  };
  
  userName = userName || "Anonymous";

  return (
    <dialog className="pop-over user-options-pop">
      <a href={userLink} className="user-info">
        <section className="pop-over-actions user-info">
          <img className="avatar" src={avatarUrl} alt="Your avatar" style={avatarStyle}/>
          <div className="info-container">
            <p className="name" title={userName}>{userName}</p>
            { userLogin &&
                <p className="user-login" title={userLogin}>@{userLogin}</p>
            }
          </div>
        </section>
      </a>

      <TeamList teams={teams} toggleCreateTeamPop={toggleCreateTeamPop} userIsAnon={userIsAnon} />

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
        <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={clickSignout}>
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
  signOut: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
  userIsAnon: PropTypes.bool.isRequired,
  userName: PropTypes.string,
  userLogin: PropTypes.string,
};


export default function UserOptionsPopContainer(props) {
  const {avatarUrl, avatarStyle, api} = props;
  return (
    <PopoverContainer>
      {({togglePopover: toggleUserOptionsPop, visible: userOptionsPopVisible}) => (
        <PopoverContainer>
          {({togglePopover: toggleCreateTeamPop, visible: createTeamPopVisible}) => (
            <div className="button user-options-pop-button" data-tooltip="User options" data-tooltip-right="true">
              <button className="user" onClick={() => {toggleUserOptionsPop(); }}>
                <img src={avatarUrl} style={avatarStyle} width="30px" height="30px" alt="User options"/>
                <span className="down-arrow icon"/>
              </button>
              {userOptionsPopVisible && <UserOptionsPop
                {...props}
                toggleUserOptionsPop={toggleUserOptionsPop}
                toggleCreateTeamPop={() => { toggleUserOptionsPop(); toggleCreateTeamPop(); }}
              />
              }
              {createTeamPopVisible && <CreateTeamPop
                api={api}
                toggleUserOptionsPop={() => {  toggleCreateTeamPop(); toggleUserOptionsPop(); }}
              />
              }
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

