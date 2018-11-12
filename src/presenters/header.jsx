/* global EDITOR_URL */
import React from 'react';
import PropTypes from 'prop-types';

import {Redirect} from 'react-router-dom';
import moment from 'moment-mini';
import Link from './includes/link.jsx';

import UserOptionsPop from "./pop-overs/user-options-pop.jsx";
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
  <Link className="button button-small button-cta" to={EDITOR_URL} data-track="resume coding">
    Resume Coding
  </Link>
);

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || '',
      submitted: false,
    };
  }
  onChange(event) {
    this.setState({value: event.target.value});
  }
  onSubmit(event) {
    event.preventDefault();
    if (!this.state.value) return;
    this.setState({submitted: true});
  }
  render() {
    const {value, submitted} = this.state;
    return (
      <form action="/search" method="get" role="search" onSubmit={this.onSubmit.bind(this)}>
        <input className="search-input" name="q" placeholder="bots, apps, users" value={value} onChange={this.onChange.bind(this)}/>
        {submitted && <Redirect to={`/search?q=${value}`} push={true}/>}
      </form>
    );
  }
}
SearchForm.propTypes = {
  defaultValue: PropTypes.string,
};

const Header = ({api, maybeUser, clearUser, searchQuery, showNewStuffOverlay}) => {
  return (
    <header role="banner">
      <div className="header-info">
        <Link to="/">
          <Logo/>
        </Link>
      </div>

      <nav>
        <SearchForm defaultValue={searchQuery}/>
        <NewProjectPop api={api}/>
        { !!maybeUser && !!maybeUser.projects.length && <ResumeCoding/> }
        { !(maybeUser && maybeUser.login) && <SignInPop/> }
        { !!maybeUser && <UserOptionsPop user={maybeUser} signOut={clearUser} showNewStuffOverlay={showNewStuffOverlay} api={api}/> }
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
