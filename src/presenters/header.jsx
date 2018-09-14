/* global EDITOR_URL */
import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment-mini';
import {getAvatarThumbnailUrl, getLink} from '../models/user';

import UserOptionsAndCreateTeamPop from "./pop-overs/user-options-and-create-team-pop.jsx";
import SignInPop from "./pop-overs/sign-in-pop.jsx";
import NewProjectPop from "./pop-overs/new-project-pop.jsx";
import NewStuffContainer from './overlays/new-stuff.jsx';
import {CurrentUserConsumer} from './current-user.jsx';

class Logo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hour: (new Date()).getHours(),
    };
  }
  
  componentDidMount() {
    this.interval = window.setInterval(() => {
      this.setState({
        hour: (new Date()).getHours(),
      });
    }, moment.duration(5, 'minutes').asMilliseconds());
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    const {hour} = this.state;
    
    const LOGO_DAY = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg";
    const LOGO_SUNSET = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg";
    const LOGO_NIGHT = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg";

    let logo = LOGO_DAY;
    if ((hour >= 16) && (hour <= 18)) {
      logo = LOGO_SUNSET;
    } else if ((hour > 18) || (hour <= 8)) {
      logo = LOGO_NIGHT;
    }

    return <img className="logo" src={logo} alt="Glitch" />;
  }
}

const ResumeCoding = () => (
  <a className="button button-small button-cta" href={EDITOR_URL} data-track="resume coding">
    <div className="">Resume Coding</div>
  </a>
);

const submitSearch = (event) => {
  if (event.target.children.q.value.trim().length === 0) {
    return event.preventDefault();
  }
};

const SearchForm = ({onSubmit, defaultValue}) => (
  <form action="/search" method="get" role="search" onSubmit={onSubmit}>
    <input className="search-input" name="q" placeholder="bots, apps, users" defaultValue={defaultValue}/>
  </form>
);

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};
SearchForm.defaultProps = {
  defaultValue: '',
};

const UserOptionsPopWrapper = ({user, clearUser, showNewStuffOverlay, api}) => {
  const props = {
    teams: user.teams,
    userLink: getLink(user),
    avatarUrl: getAvatarThumbnailUrl(user),
    avatarStyle: {backgroundColor: user.color},
    signOut: clearUser,
    api: api,
    userIsAnon: !user.login,
    showNewStuffOverlay,
    userName: user.name,
    userLogin: user.login,
  };

  return <UserOptionsAndCreateTeamPop {...props}/>;
};

UserOptionsPopWrapper.propTypes = {
  user: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
  }).isRequired,
  clearUser: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
  api: PropTypes.any.isRequired,
};

const Header = ({api, maybeUser, clearUser, searchQuery, showNewStuffOverlay}) => {
  const signedIn = maybeUser && !!maybeUser.login;
  return (
    <header role="banner">
      <div className="header-info">
        <a href="/">
          <Logo/>
        </a>
      </div>

      <nav>
        <SearchForm onSubmit={submitSearch} defaultValue={searchQuery}/>
        <NewProjectPop api={api}/>
        <ResumeCoding/>
        { !signedIn && <SignInPop/> }
        { maybeUser && <UserOptionsPopWrapper user={maybeUser} clearUser={clearUser} showNewStuffOverlay={showNewStuffOverlay} api={api}/>}
      </nav>
    </header>
  );
};

Header.propTypes = {
  maybeUser: PropTypes.object,
  api: PropTypes.func.isRequired,
};

const HeaderContainer = ({...props}) => (
  <CurrentUserConsumer>
    {(user, userFetched, {clear}) => (
      <NewStuffContainer isSignedIn={!!user && !!user.login}>
        {showNewStuffOverlay => (
          <Header {...props} maybeUser={user} clearUser={clear} showNewStuffOverlay={showNewStuffOverlay}/>
        )}
      </NewStuffContainer>
    )}
  </CurrentUserConsumer>
);

export default HeaderContainer;
