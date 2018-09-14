import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import DevToggles from '../includes/dev-toggles.jsx';
import Loader from '../includes/loader.jsx';
import {PureEditableField} from '../includes/editable-field.jsx';
import {getAvatarUrl} from '../../models/team';
import PopoverContainer from './popover-container.jsx';

const TEAM_ALREADY_EXISTS_ERROR = "Team already exists, try another";


// Create Team 🌿

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: '',
      teamUrl: '',
      isLoading: false,
      error: ''
    };
    this.randomDescription = this.randomDescription.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  descriptiveAdjectives() { 
    return [
      'charming',
      'bold',
      'brave',
      'cool',
      'docile',
      'dope',
      'faithful',
      'fertile',
      'fervent',
      'forgiving',
      'genial',
      'genteel',
      'grouchy',
      'hopeful',
      'humane',
      'jolly',
      'joyful',
      'lunar',
      'magical',
      'moral',
      'mysterious',
      'mystery',
      'notorious',
      'passionate',
      'quaint',
      'quirky',
      'scrumptious',
      'sensitive',
      'tropical',
      'woeful',
      'whimsical',
      'zealous',
    ];
  }

  teamSynonyms() {
    return [
      'team',
      'group',
      'coven',
      'squad',
      'crew',
      'party',
      'troupe',
      'band',
      'posse',
    ];
  }
  
  componentDidMount() {
    let initialTeamName = this.randomName();
    this.setState({
      teamName: initialTeamName,
      teamUrl: _.kebabCase(initialTeamName),
    });
  }
  
  randomDescription() {
    let adjectives = _.sampleSize(this.descriptiveAdjectives(), 2);
    return `A ${adjectives[0]} team that makes ${adjectives[1]} things`;
  }
  
  randomName() {
    let adjective = _.sample(this.descriptiveAdjectives());
    return `${_.capitalize(adjective)} ${_.sample(this.teamSynonyms())}`;
  }
  
  isTeamUrlAvailable(url) {
    this.props.api.get(`teams/byUrl/${url}`)
      .then (({data}) => {
        if (data) {
          this.setState({
            error: TEAM_ALREADY_EXISTS_ERROR
          });
        } else {
          this.setState({
            error: ""
          });
        }
      });
  }
  
  handleChange(newValue) {
    let url = _.kebabCase(newValue);
    this.setState({
      teamName: newValue, 
      teamUrl: url,
      error: "",
    });
    this.isTeamUrlAvailable(url);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    this.props.api.post(('teams'), {
      name: this.state.teamName,
      url: this.state.teamUrl,
      hasAvatarImage: false,
      coverColor: '',
      location: '',
      description: this.randomDescription(),
      backgroundColor: '',
      hasCoverImage: false,
      isVerified: false,
    })
      .then (response => {
        this.setState({ isLoading: false });
        window.location = `/@${response.data.url}`;
      }).catch (() => {
        this.setState({
          isLoading: false,
          error: TEAM_ALREADY_EXISTS_ERROR,
        });
      });
  }
  
  render() {
    return (
      <dialog className="pop-over create-team-pop">
        <section className="pop-over-info">
          <div className="pop-title">
            <span>Create Team </span>
            <span className="emoji herb" />
          </div>
        </section>

        <section className="pop-over-info">
          <p className="info-description">
            Showcase your projects in one place, manage collaborators, and view analytics
          </p>
        </section>
        
        <section className="pop-over-actions">  
          <form onSubmit={this.handleSubmit}>
            <PureEditableField
              value={this.state.teamName}
              update={this.handleChange}
              placeholder='Your Team Name'
              error={this.state.error}
            />
            <p className="action-description team-url-preview">
              /@{this.state.teamUrl}
            </p>
          
            {this.state.isLoading && 
            <Loader />
          ||
            <button type="submit" className="button-small has-emoji">
              <span>Create Team </span>
              <span className="emoji thumbs_up" />
            </button>
            }
          </form>

        </section>
        <section className="pop-over-info">
          <p className="info-description">
            You can change this later
          </p>
        </section>
      </dialog>
    );
  }
}

CreateTeam.propTypes = {
  api: PropTypes.func.isRequired,
};


// Team Item

const TeamItemButton = ({url, name, ...team}) => (
  <a className="button-link" href={`/@${url}`}>
    <div className="button button-small has-emoji button-tertiary">
      <span>{name} </span>
      <img className="emoji avatar" src={getAvatarUrl({...team, size:'small'})} alt={`${name} team avatar`} width="16px" height="16px"/>
    </div>
  </a>
);

TeamItemButton.propTypes = {
  id: PropTypes.number.isRequired,
  hasAvatarImage: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};


// Create Team button

const CreateTeamButton = ({toggleUserOptionsVisible, userIsAnon}) => {
  if (userIsAnon) {
    return (
      <React.Fragment>
        <button className="button button-small button-tertiary">Sign in</button>
        <p className="description action-description">
          to create a team
        </p>
        <button className="button button-small has-emoji button-tertiary" disabled>
          Create Team <span className="emoji herb" />
        </button>
      </React.Fragment>
    );
  }
  return (
    <button onClick={toggleUserOptionsVisible} className="button button-small has-emoji button-tertiary">
      Create Team <span className="emoji herb" />
    </button>
  );
};

CreateTeamButton.propTypes = {
  toggleUserOptionsVisible: PropTypes.func.isRequired,
  userIsAnon: PropTypes.bool.isRequired,
};


// Team List

const TeamList = ({teams, toggleUserOptionsVisible, userIsAnon}) => {
  // const hasTeams = teams && teams.length;
  return (!!teams.length &&
    <section className="pop-over-actions">
      <DevToggles>
        {toggles => toggles.includes('add-teams') && (
          <CreateTeamButton toggleUserOptionsVisible={toggleUserOptionsVisible} userIsAnon={userIsAnon} />
        )}
      </DevToggles>
      {teams.map((team) => (
        <TeamItemButton key={team.name} {...team} />
      ))}
    </section>
  );
};

TeamList.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  toggleUserOptionsVisible: PropTypes.func.isRequired,
  userIsAnon: PropTypes.bool.isRequired,
};


// User Options 🧕

const UserOptions = ({
  togglePopover,
  userLink,
  avatarUrl,
  avatarStyle,
  teams,
  signOut,
  showNewStuffOverlay,
  toggleUserOptionsVisible,
  userIsAnon,
  userName,
  userLogin,
}) => {
  const clickNewStuff = (event) => {
    togglePopover();
    showNewStuffOverlay();
    event.stopPropagation();
  };
  
  const clickSignout = () => {
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
      <TeamList 
        teams={teams} 
        toggleUserOptionsVisible={toggleUserOptionsVisible} 
        userIsAnon={userIsAnon} 
      />
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

UserOptions.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  userLink: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
  userIsAnon: PropTypes.bool.isRequired,
  userName: PropTypes.string,
  userLogin: PropTypes.string,
  toggleUserOptionsVisible: PropTypes.func.isRequired,
};


// User Options or Create Team
// uses userOptionsVisible state to show either UserOptions or CreateTeam content

class UserOptionsAndCreateTeamPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userOptionsVisible: true
    };
    this.toggleUserOptionsVisible = this.toggleUserOptionsVisible.bind(this);
  }
  
  toggleUserOptionsVisible() {
    this.setState(prevState => ({
      userOptionsVisible: !prevState.userOptionsVisible
    }));
  }
    
  render() {
    return (
      <React.Fragment>
        { this.state.userOptionsVisible ? (
          <UserOptions
            {...this.props}
            toggleUserOptionsVisible={() => this.toggleUserOptionsVisible()}
          />
        ) : (
          <CreateTeam
            {...this.props}
            toggleUserOptionsVisible={() => this.toggleUserOptionsVisible()}
          />
        )}
      </React.Fragment>
    );
  }
}

UserOptionsAndCreateTeamPop.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};


// Header button and init pop

export default function UserOptionsAndCreateTeamPopContainer(props) {
  const {avatarUrl, avatarStyle} = props;
  return (
    <PopoverContainer>
      {({togglePopover: togglePopover, visible: popVisible}) => (
        <div className="button user-options-pop-button" data-tooltip="User options" data-tooltip-right="true">
          <button className="user" onClick={() => {togglePopover(); }}>
            <img src={avatarUrl} style={avatarStyle} width="30px" height="30px" alt="User options"/>
            <span className="down-arrow icon"/>
          </button>
          {popVisible && <UserOptionsAndCreateTeamPop
            {...props}
            togglePopover={togglePopover}
          />
          }
        </div>
      )}
    </PopoverContainer>
  );
}

UserOptionsAndCreateTeamPopContainer.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  avatarStyle: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};
