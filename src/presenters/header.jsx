import UserOptionsPop from "./pop-overs/user-options-pop.jsx";
import SignInPop from "./pop-overs/sign-in-pop.jsx";
import NewProjectPop from "./pop-overs/new-project-pop.jsx";
import React from 'react';
import PropTypes from 'prop-types';
import urlJoin from 'url-join';

const Logo = () => {
  const LOGO_DAY = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg";
  const LOGO_SUNSET = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg";
  const LOGO_NIGHT = "https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg";

  let logo = LOGO_DAY;
  const hour = (new Date()).getHours();
  if ((hour >= 16) && (hour <= 18)) {
    logo = LOGO_SUNSET;
  } else if ((hour > 18) || (hour <= 8)) {
    logo = LOGO_NIGHT;
  }

  return <img className="logo" src={logo} alt="Glitch" />;
};

const ResumeCoding = () => (
  <a className="" href="https://glitch.com/edit/" data-track="resume coding">
    <div className="button button-small button-cta">Resume Coding</div>
  </a>
);

const submitSearch = (event) => {
  if (event.target.children.q.value.trim().length === 0) {
    return event.preventDefault();
  }
};

const SearchForm = ({baseUrl, onSubmit, defaultValue}) => (
  <form action={urlJoin(baseUrl, "search")} method="get" role="search" onSubmit={onSubmit}>
    <label className="screen-reader-text">Search Glitch projects
      <input id="search-projects" className="search-input" name="q" placeholder="bots, apps, users" defaultValue={defaultValue}/>
    </label>
  </form>
);

SearchForm.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

const UserOptionsPopWrapper = ({user, overlayNewStuffVisible}) => {
  const props = {
    teams: user.teams,
    profileLink: `/@${user.login}`,
    avatarUrl: user.userAvatarUrl,
    showNewStuffOverlay() {
      return overlayNewStuffVisible(true);
    }
  };

  return <UserOptionsPop {...props}/>;
};

UserOptionsPopWrapper.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string.isRequired,
  }).isRequired,
  overlayNewStuffVisible: PropTypes.func.isRequired,
};

const Header = ({baseUrl, maybeUser, searchQuery, overlayNewStuffVisible, promiseProjectsByIds}) => {
  const signedIn = maybeUser && !!maybeUser.login;
  return (
    <header role="banner">
      <div className="header-info">
        <a href={baseUrl}>
          <Logo/>
        </a>
      </div>
     
      <nav>
        <SearchForm baseUrl={baseUrl} onSubmit={submitSearch} defaultValue={searchQuery}/>
        <NewProjectPop promiseProjectsByIds={promiseProjectsByIds}/>
        <ResumeCoding/>
        { !signedIn && <SignInPop/> }
        { maybeUser && <UserOptionsPopWrapper user={maybeUser} overlayNewStuffVisible={overlayNewStuffVisible} />}
      </nav>
    </header>
  );
};

Header.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  maybeUser: PropTypes.object,
};

class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }
  componentDidMount() {
    const obs = this.props.userObservable;
    const setState = () => {
      this.setState({user: obs().asProps()});
    };
    
    obs().fetched.observe((isFetched) => {
      console.log("obs!", obs(), isFetched);
      if(isFetched) {
        setState();
      }
    });
    
    ///also need to notice when the teams update.
    obs().teams
  }
  componentDidUnmount() {
    // Todo: Garbage collect obs.
    // (...not currently possible.)
  }
  render() {
    return <Header {...this.props} maybeUser={this.state.user}/>;
  }
}

HeaderContainer.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  userObservable: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  overlayNewStuffVisible: PropTypes.func.isRequired,
  promiseProjectsByIds: PropTypes.func.isRequired,
};

export default HeaderContainer;
