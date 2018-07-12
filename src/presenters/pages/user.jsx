import React from 'react';
import PropTypes from 'prop-types';

import LayoutPresenter from '../layout';
import Reactlet from "../reactlet";

import ProjectModel from '../../models/project';
import {getAvatarStyle, getProfileStyle} from '../../models/user';

import {DataLoader} from '../includes/loader.jsx';
import {Notifications} from '../notifications.jsx';
import {CurrentUserProvider} from '../current-user.jsx';

import {AuthDescription} from '../includes/description-field.jsx';
import EditableField from '../includes/editable-field.jsx';
import UserEditor from '../user-editor.jsx';
import Thanks from '../includes/thanks.jsx';

import DeletedProjects from '../deleted-projects.jsx';
import EntityPageProjects from '../entity-page-projects.jsx';
import NotFound from '../includes/not-found.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';

function syncPageToLogin(login) {
  console.log(login);
  //history.replaceState(null, null, `/@${login}`);
  //document.title = `@${login}`;
}

const NameAndLogin = ({name, login, id, isAuthorized, updateName, updateLogin}) => {
  if(!login) {
    // Just an ID? We're anonymous.
    return <h1 className="login">@{id}</h1>;
  }
  
  if(!isAuthorized) {
    if(!name) {
      //promote login to an h1.
      return <h1 className="login">@{login}</h1>;
    }
    return (
      <React.Fragment>
        <h1 className="username">{name}</h1>
        <h2 className="login">@{login}</h2>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <h1 className="username"><EditableField value={name||""} update={updateName} placeholder='Display name?'/></h1>
      <h2 className="login"><EditableField value={login} update={updateLogin} prefix="@" placeholder='User ID?'/></h2>
    </React.Fragment>
  );
};
NameAndLogin.propTypes = {
  name: PropTypes.string,
  login: PropTypes.string,
  id: PropTypes.number.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  updateName: PropTypes.func,
  updateLogin: PropTypes.func,
};

const UserPage = ({
  user: { //has science gone too far?
    id, login, name, description, thanksCount,
    avatarUrl, color,
    hasCoverImage, coverColor,
    pins, projects,
    _cacheCover, _deletedProjects,
  },
  isAuthorized,
  updateDescription,
  updateName, updateLogin,
  uploadCover, clearCover,
  uploadAvatar,
  addPin, removePin,
  leaveProject,
  deleteProject, undeleteProject,
  getDeletedProjects, setDeletedProjects,
  getProjects,
}) => (
  <main className="profile-page user-page">
    <section>
      <ProfileContainer
        avatarStyle={getAvatarStyle({avatarUrl, color})}
        coverStyle={getProfileStyle({id, hasCoverImage, coverColor, cache: _cacheCover})}
        coverButtons={isAuthorized && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/>}
        avatarButtons={isAuthorized ? <ImageButtons name="Avatar" uploadImage={uploadAvatar}/> : null }
      >
        <NameAndLogin
          {...{name, login, id, isAuthorized, updateName}}
          updateLogin={login => updateLogin(login).then(syncPageToLogin)}
        />
        <Thanks count={thanksCount}/>
        <AuthDescription authorized={isAuthorized} description={description} update={updateDescription} placeholder="Tell us about yourself"/>
      </ProfileContainer>
    </section>
    <EntityPageProjects
      projects={projects} pins={pins} isAuthorized={isAuthorized}
      addPin={addPin} removePin={removePin}
      projectOptions={{leaveProject, deleteProject}}
      getProjects={getProjects}
    />
    {isAuthorized && <DeletedProjects get={getDeletedProjects} setDeletedProjects={setDeletedProjects} deletedProjects={_deletedProjects} undelete={undeleteProject}/>}
  </main>
);
UserPage.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
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
  }).isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  leaveProject: PropTypes.func.isRequired,
};

const UserPageLoader = ({api, get, loginOrId, currentUserModel, getProjects, getDeletedProjects}) => (
  <CurrentUserProvider model={currentUserModel}>
    <Notifications>
      <DataLoader get={get} renderError={() => <NotFound name={loginOrId}/>}>
        {user => user ? (
          <UserEditor api={api} initialUser={user} currentUserModel={currentUserModel}>
            {(user, funcs, isAuthorized) => (
              <UserPage user={user} {...funcs} {...{isAuthorized, getProjects, getDeletedProjects}}/>
            )}
          </UserEditor>
        ) : <NotFound name={loginOrId}/>}
      </DataLoader>
    </Notifications>
  </CurrentUserProvider>
);
UserPageLoader.propTypes = {
  get: PropTypes.func.isRequired,
  loginOrId: PropTypes.node.isRequired,
};

function UserPagePresenter(application, loginOrId, get) {
  const props = {
    loginOrId, get,
    api: application.api(),
    currentUserModel: application.currentUser(),
    getProjects: ids => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(d => ProjectModel(d).update(d).asProps())),
    getDeletedProjects: () => application.api().get(`user/deleted-projects`),
  };
  const content = Reactlet(UserPageLoader, props, 'userpage');
  return LayoutPresenter(application, content);
}

async function getUserById(api, id) {
  const {data} = await api.get(`users/${id}`);
  return data;
}

async function getUserByLogin(api, login) {
  const {data} = await api.get(`userId/byLogin/${login}`);
  return await getUserById(api, data);
}

export function UserPageById(application, id) {
  const get = () => getUserById(application.api(), id);
  return UserPagePresenter(application, id, get);
}

export function UserPageByLogin(application, login) {
  const get = () => getUserByLogin(application.api(), login);
  return UserPagePresenter(application, login, get);
}