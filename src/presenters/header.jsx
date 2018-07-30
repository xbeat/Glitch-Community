/* global EDITOR_URL */

import UserOptionsPop from "./pop-overs/user-options-pop.jsx";
import SignInPop from "./pop-overs/sign-in-pop.jsx";
import NewProjectPop from "./pop-overs/new-project-pop.jsx";
import NewStuffContainer from './overlays/new-stuff.jsx';
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
  <a className="button button-small button-cta" href={EDITOR_URL} data-track="resume coding">
    <div className="">Resume Coding</div>
  </a>
);

const submitSearch = (event) => {
  if (event.target.children.q.value.trim().length === 0) {
    return event.preventDefault();
  }
};

const SearchForm = ({baseUrl, onSubmit, defaultValue}) => (
  <form action={urlJoin(baseUrl, "search")} method="get" role="search" onSubmit={onSubmit}>
    <input className="search-input" name="q" placeholder="bots, apps, users" defaultValue={defaultValue}/>
  </form>
);

SearchForm.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

<<<<<<< HEAD
const UserOptionsPopWrapper = ({user, overlayNewStuffVisible, api}) => {
=======
const UserOptionsPopWrapper = ({user, showNewStuffOverlay}) => {
>>>>>>> bcc747b1f2676cf72f88782dd94a005eaee504c1
  const props = {
    teams: user.teams,
    userLink: user.userLink,
    avatarUrl: user.userAvatarUrl,
    avatarStyle: {backgroundColor: user.color},
<<<<<<< HEAD
    showNewStuffOverlay() {
      return overlayNewStuffVisible(true);
    },
    api: api,
    userIsAnon: user.isAnon,
=======
    showNewStuffOverlay,
>>>>>>> bcc747b1f2676cf72f88782dd94a005eaee504c1
  };

  return <UserOptionsPop {...props}/>;
};

UserOptionsPopWrapper.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string,
  }).isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

<<<<<<< HEAD
const Header = ({baseUrl, maybeUser, searchQuery, overlayNewStuffVisible, promiseProjectsByIds, api}) => {
=======
const Header = ({api, baseUrl, maybeUser, searchQuery, showNewStuffOverlay}) => {
>>>>>>> bcc747b1f2676cf72f88782dd94a005eaee504c1
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
        <NewProjectPop api={api}/>
        <ResumeCoding/>
        { !signedIn && <SignInPop/> }
<<<<<<< HEAD
        { maybeUser && <UserOptionsPopWrapper user={maybeUser} overlayNewStuffVisible={overlayNewStuffVisible} api={api} />}
=======
        { maybeUser && <UserOptionsPopWrapper user={maybeUser} showNewStuffOverlay={showNewStuffOverlay} />}
>>>>>>> bcc747b1f2676cf72f88782dd94a005eaee504c1
      </nav>
    </header>
  );
};

Header.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  maybeUser: PropTypes.object,
  api: PropTypes.func.isRequired,
};

class HeaderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { maybeUser: null };
  }
  componentDidMount() {
    this.props.userObservable.observe((maybeUser) => {
      this.setState({maybeUser: maybeUser});
    });
  }
  componentWillUnmount() {
    this.props.userObservable.releaseDependencies();
  }
  render() {
    return (
      <NewStuffContainer
        isSignedIn={!!this.state.maybeUser && !!this.state.maybeUser.login}
        getUserPref={this.props.getUserPref} setUserPref={this.props.setUserPref}
      >
        {showNewStuffOverlay => (
          <Header {...this.props} maybeUser={this.state.maybeUser} showNewStuffOverlay={showNewStuffOverlay}/>
        )}
      </NewStuffContainer>
    );
  }
}

HeaderContainer.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  userObservable: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
<<<<<<< HEAD
  overlayNewStuffVisible: PropTypes.func.isRequired,
  promiseProjectsByIds: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
=======
>>>>>>> bcc747b1f2676cf72f88782dd94a005eaee504c1
};

export default HeaderContainer;
