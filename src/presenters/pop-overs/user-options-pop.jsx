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

const TeamList = ({teams, /*toggleCreateTeamPop,*/ userIsAnon}) => {
  // const hasTeams = teams && teams.length;
  return (
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

const UserOptionsPop = ({toggleUserOptionsPop, userLink, avatarUrl, avatarStyle, teams, showNewStuffOverlay, toggleCreateTeamPop, userIsAnon}) => {
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
  userIsAnon: PropTypes.bool.isRequired,
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

