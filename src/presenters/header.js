/* global EDITOR_URL */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';
import { TrackedExternalLink } from './analytics';
import { Link } from './includes/link';
import Logo from './includes/logo';
import TextInput from '../components/fields/text-input';

import UserOptionsPop from './pop-overs/user-options-pop';
import SignInPop from './pop-overs/sign-in-pop';
import NewProjectPop from './pop-overs/new-project-pop';
import NewStuffContainer from './overlays/new-stuff';
import { useCurrentUser } from '../state/current-user';

const ResumeCoding = () => (
  <TrackedExternalLink name="Resume Coding clicked" className="button button-small button-cta" to={EDITOR_URL}>
    Resume Coding
  </TrackedExternalLink>
);

function SearchForm({ defaultValue }) {
  const [value, onChange] = useState(defaultValue);
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event) => {
    event.preventDefault();
    if (!value) return;
    setSubmitted(true);
  };

  return (
    <form action="/search" method="get" role="search" onSubmit={onSubmit}>
      <TextInput className="header-search" name="q" onChange={onChange} opaque placeholder="bots, apps, users" type="search" value={value} />
      {submitted && <Redirect to={`/search?q=${value}`} push />}
    </form>
  );
}

SearchForm.propTypes = {
  defaultValue: PropTypes.string,
};
SearchForm.defaultProps = {
  defaultValue: '',
};

const Header = ({ maybeUser, clearUser, searchQuery, showNewStuffOverlay }) => (
  <header role="banner">
    <div className="header-info">
      <Link to="/">
        <Logo />
      </Link>
    </div>

    <nav>
      <SearchForm defaultValue={searchQuery} />
      <NewProjectPop />
      {!!maybeUser && !!maybeUser.projects.length && <ResumeCoding />}
<<<<<<< HEAD
      {!(maybeUser && maybeUser.login) && <SignInPop api={api} />}
      {!!maybeUser && maybeUser.login && <UserOptionsPop user={maybeUser} signOut={clearUser} showNewStuffOverlay={showNewStuffOverlay} api={api} />}
=======
      {!(maybeUser && maybeUser.login) && <SignInPop />}
      {!!maybeUser && <UserOptionsPop user={maybeUser} signOut={clearUser} showNewStuffOverlay={showNewStuffOverlay} />}
>>>>>>> 1eee10750ab9eb21659fc49b57cec28d0e6f1972
    </nav>
  </header>
);

Header.propTypes = {
  maybeUser: PropTypes.object,
};

Header.defaultProps = {
  maybeUser: null,
};

const HeaderContainer = ({ ...props }) => {
  const { currentUser: user, clear } = useCurrentUser();
  return (
    <NewStuffContainer isSignedIn={!!user && !!user.login}>
      {(showNewStuffOverlay) => <Header {...props} maybeUser={user} clearUser={clear} showNewStuffOverlay={showNewStuffOverlay} />}
    </NewStuffContainer>
  );
};

export default HeaderContainer;
