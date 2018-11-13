import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import {getAvatarStyle, getProfileStyle} from '../../models/user';

import {CurrentUserConsumer} from '../current-user.jsx';
import {AuthDescription} from '../includes/description-field.jsx';
import EditableField from '../includes/editable-field.jsx';
import UserEditor from '../user-editor.jsx';
import Thanks from '../includes/thanks.jsx';

import DeletedProjects from '../deleted-projects.jsx';
import EntityPagePinnedProjects from '../entity-page-pinned-projects.jsx';
import EntityPageRecentProjects from '../entity-page-recent-projects.jsx';
import CollectionsList from '../collections-list.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import TeamsList from '../teams-list.jsx';

function syncPageToLogin(login) {
  history.replaceState(null, null, `/@${login}`);
}

const NameAndLogin = ({name, login, isAuthorized, updateName, updateLogin}) => {
  if(!login) {
    return <h1 className="login">Anonymous</h1>;
  }

  if(!isAuthorized) {
    if(!name) {
      return <h1 className="login">@{login}</h1>;
    }
    return (
      <>
        <h1 className="username">{name}</h1>
        <h2 className="login">@{login}</h2>
      </>
    );
  }

  return (
    <>
      <h1 className="username"><EditableField value={name||""} update={updateName} placeholder="What's your name?"/></h1>
      <h2 className="login"><EditableField value={login} update={updateLogin} prefix="@" placeholder='Nickname?'/></h2>
    </>
  );
};
NameAndLogin.propTypes = {
  name: PropTypes.string,
  login: PropTypes.string,
  isAuthorized: PropTypes.bool.isRequired,
  updateName: PropTypes.func,
  updateLogin: PropTypes.func,
};

const UserPage = ({
  user: { //has science gone too far?
    id, login, name, description, thanksCount,
    avatarUrl, color,
    hasCoverImage, coverColor,
    pins, projects, _deletedProjects,
    teams,
    _cacheCover,
    _collections,
    loadedCollections,
  },
  api, isAuthorized,
  maybeCurrentUser,
  updateDescription,
  updateName, updateLogin,
  uploadCover, clearCover,
  uploadAvatar,
  addPin, removePin,
  leaveProject,
  deleteProject, undeleteProject,
  setDeletedProjects,
  addProjectToCollection,
}) => (
  <main className="profile-page user-page">   
    <section>
      <ProfileContainer
        avatarStyle={getAvatarStyle({avatarUrl, color})}
        coverStyle={getProfileStyle({id, hasCoverImage, coverColor, cache: _cacheCover})}
        coverButtons={isAuthorized && !!login && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/>}
        avatarButtons={isAuthorized && !!login && <ImageButtons name="Avatar" uploadImage={uploadAvatar}/>}
      >
        <NameAndLogin
          {...{name, login, isAuthorized, updateName}}
          updateLogin={login => updateLogin(login).then(() => syncPageToLogin(login))}
        />
        {!!teams.length && (
          <div className="teams-information"> 
            <TeamsList teams={teams}/>
          </div>
        )}
        {!!thanksCount && <Thanks count={thanksCount}/>}
        <AuthDescription authorized={isAuthorized && !!login} description={description} update={updateDescription} placeholder="Tell us about yourself"/>
      </ProfileContainer>
    </section>
    
    <EntityPagePinnedProjects
      projects={projects} 
      pins={pins} 
      isAuthorized={isAuthorized}
      api={api} 
      removePin={removePin}
      projectOptions={{
        leaveProject, 
        deleteProject,
        addProjectToCollection
      }}
    />
    
    {(loadedCollections && !!login &&
      <CollectionsList title="Collections" 
        collections={_collections} 
        api={api} 
        isAuthorized={isAuthorized}
        maybeCurrentUser={maybeCurrentUser}
        userLogin={login}
      />
    )}

    <EntityPageRecentProjects
      projects={projects} 
      pins={pins} 
      isAuthorized={isAuthorized}
      api={api} 
      addPin={addPin} 
      projectOptions={{
        leaveProject, 
        deleteProject,
        addProjectToCollection
      }}
    />
    
    {isAuthorized && <DeletedProjects api={api} setDeletedProjects={setDeletedProjects} deletedProjects={_deletedProjects} undelete={undeleteProject}/>}
  </main>
);
UserPage.propTypes = {
  clearCover: PropTypes.func.isRequired,
  maybeCurrentUser: PropTypes.object,
  isAuthorized: PropTypes.bool.isRequired,
  leaveProject: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    id: PropTypes.number.isRequired,
    thanksCount: PropTypes.number.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    avatarUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    coverColor: PropTypes.string,
    _cacheCover: PropTypes.number.isRequired,
    _deletedProjects: PropTypes.array.isRequired,
    _collections: PropTypes.array.isRequired,
  }).isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

const UserPageContainer = ({api, user}) => (
  <CurrentUserConsumer>
    {(maybeCurrentUser) => (
      <UserEditor api={api} initialUser={user}>
        {(user, funcs, isAuthorized) => (
          <>
            <Helmet>
              <title>{user.name || (user.login ? `@${user.login}` : `User ${user.id}`)}</title>
            </Helmet>

            <ProjectsLoader api={api} projects={user.projects}>
              {projects => <UserPage {...{api, isAuthorized, maybeCurrentUser}} user={{...user, projects}} {...funcs} />}
            </ProjectsLoader>
          </>
        )}
      </UserEditor>
    )}
  </CurrentUserConsumer>
);

export default UserPageContainer;