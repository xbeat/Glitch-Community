import React from 'react';
import PropTypes from 'prop-types';

import Project from '../../models/project';
import Observable from 'o_0';

import ProjectModel, {getAvatarUrl} from '../../models/project';
import UserModel, {getAvatarStyle, getProfileStyle} from '../../models/user';

import {DataLoader} from '../includes/loader.jsx';
import Uploader from '../includes/uploader.jsx';

import {AuthDescription} from '../includes/description-field.jsx';
import EditableField from '../includes/editable-field.jsx';
import EntityEditor from '../entity-editor.jsx';
import Thanks from '../includes/thanks.jsx';

import * as assets from '../../utils/assets';
import UserTemplate from '../../templates/pages/user';
import DeletedProjectsTemplate from '../../templates/deleted-projects';
import LayoutPresenter from '../layout';

import EntityPageProjects from "../entity-page-projects.jsx";
import NotFound from '../includes/not-found.jsx';
import {ProfileContainer, ImageButtons} from '../includes/profile.jsx';
import Reactlet from "../reactlet";
import Observed from "../includes/observed.jsx";


export function OldUserPage(application, userLoginOrId) {
  const assetUtils = assets(application);

  var self = {

    user: application.user,    
    
    deletedProjectsLoadingState: Observable(""),
    
    userLoginOrId() {
      return decodeURI(userLoginOrId);
    },

    application,
  
    userName() {
      return application.user().name();
    },

    description() {
      return application.user().descriptionMarkdown();
    },

    updateDescription(text) {
      return self.updateField("description", text);
    },
    
    updateName(text) {
      const maybeText = text === "" ? null : text;
      //Api permits the name to be null, but not empty.
      return self.updateField("name", maybeText);
    },
    
    updateLogin(text) {
      return self.updateField("login", text).then((result) => {
        if(result.success){
          const login = `@${result.data}`;
          history.replaceState(null, null, `/${login}`);
          
          //https://stackoverflow.com/questions/13955520/page-title-is-not-changed-by-history-pushstate
          document.title = login;
        }
        return result;
      });
    },
    
    updateField(field, value) {
      return self.updateUser({[field]: value}).then(result => {
        result.data = result.data[field];
        if(result.success) {
          application.user()[field](result.data);
        }
        return result;
      });
    },

    updateUser: (data => application.user().updateUser(application, data)),

    userHasData() {
      if (application.user().id()) { return true; }
    },

    hiddenIfUserFetched() { 
      return application.user().hiddenIfFetched();
    },

    hiddenUnlessUserFetched() { 
      return application.user().hiddenUnlessFetched();
    },

    visibleIfUserNotFound() {
      if (application.user().notFound()) {
        return 'visible';
      }
    },

    hiddenIfUserNotFound() {
      if (application.user().notFound()) {
        return 'hidden';
      }
    },
    
    userNotFound() {
      return Reactlet(NotFound, {name: self.userLoginOrId()});
    },

    isCurrentUser() {
      return application.user().isCurrentUser(application);
    },

    clearCover: () => assetUtils.updateHasCoverImage(false),

    uploadCover: assetUtils.uploadCoverFile,
    uploadAvatar() {
      assetUtils.uploader((file) => {
        assetUtils.uploadAsset(file, "temporary-user-avatar", "avatar")
          .then((uploadedUrl) => {
            return self.updateUser({"avatar_url": uploadedUrl});
          })
          .then((response) => {
            self.user().avatarUrl(response.data.avatarUrl);
            self.user().avatarThumbnailUrl(response.data.avatarThumbnailUrl);
          });
      });
    },
        
    userProjects() {
      const propsObservable = Observable(() => {
        // observe login so that our project user links update as the user does.
        self.user().login();
        self.user().avatarThumbnailUrl();

        return {
          closeAllPopOvers: application.closeAllPopOvers,
          isAuthorizedUser: self.isCurrentUser(),
          projectsObservable: self.user().projects,
          pinsObservable: self.user().pins,
          projectOptions: self.projectOptions(),
        };
      });
      
      return Reactlet(Observed, {propsObservable, component:EntityPageProjects});
    },
    
    hiddenUnlessUserIsAnon() {
      if (!self.user().isAnon()) { return 'hidden'; }
    },
    
    projectOptions() {
      const userHasProjectOptions = application.user().isOnUserPageForCurrentUser(application);
      if(!userHasProjectOptions) {
        return {};
      }
      
      return {
        deleteProject: self.deleteProject, 
        leaveProject: self.leaveProject, 
        togglePinnedState: self.togglePinnedState
      };
    },
    
    togglePinnedState(projectId) {
      const action = Project.isPinnedByUser(application.user(), projectId) ? "removePin" : "addPin";
      return application.user()[action](application, projectId);
    },

                
    deleteProject(projectId, event) {
      const project = Project({id: projectId});
      const projectContainer = event.target.closest('li');
      application.closeAllPopOvers();
      $(projectContainer).one('animationend', function() { 
        // Hold off on UI updates until the animation ends
        const index = application.user().projects.indexOf(project);
        if (index !== -1) {
          return application.user().projects.splice(index, 1);
        }
      });
        
      $(projectContainer).addClass('slide-down');
      
      return project.delete().then(function() {
        // Fetch the deleted project and add it to deletedProjects()
        const path = `projects/${project.id()}?showDeleted=true`;
        return application.api().get(path)
          .then(function({data}) {
            const rawProject = data;
            rawProject.fetched = true;
            const deletedProject = Project(rawProject).update(rawProject);
            deletedProject.presenterUndelete = event => self.undeleteProject(project, event);
            return application.user().deletedProjects.unshift(deletedProject);}).catch(error => console.error("getDeletedProject", error));
      });
    },
        
    undeleteProject(project, event) { 
      const projectContainer = event.target.closest('li');
      $(projectContainer).one('animationend', function() { 
        // Hold off on UI updates until the animation ends
        const index = self.user().deletedProjects.indexOf(project);
        if (index !== -1) {
          return self.user().deletedProjects.splice(index, 1);
        }
      });      
      $(projectContainer).addClass('slide-up');
      
      // Undelete the project using the API
      return project.undelete().then(function() {
        // Renaming, if appropriate, requires an API call,
        // so we wait on the renamePromise before proceeding with the fetch
        const renamePromise = new Promise(function(resolve) {
          if (project.domain().endsWith("-deleted")) {
            // Attempt to trim -deleted from the project name
            const renamePath = `projects/${project.id()}`;
            const newDomain = project.domain().slice(0, "-deleted".length * -1);
            return application.api().patch(renamePath, {domain: newDomain}).then(resolve).catch(resolve);
          } 
          return resolve();
          
        });
        
        return renamePromise.then(function() {
          // Fetch the recovered project and add it to self.projects()
          const projectsPath = `projects/byIds?ids=${project.id()}`;
          return application.api().get(projectsPath)
            .then(function({data}) {
              const rawProject = data[0];
              rawProject.fetched = true;
              const restoredProject = Project(rawProject).update(rawProject);
              return self.user().projects.unshift(restoredProject);}).catch(error => console.error("getProject", error));
        });
      });
    },
      

    getDeletedProjects() {
      if (!self.isCurrentUser()) {
        return;
      }
      
      self.deletedProjectsLoadingState('loading');
      
      return application.api().get("/user/deleted-projects/").then(function(response) { 
        const deletedProjectsRaw = response.data;
        const deletedProjects = deletedProjectsRaw.map(function(projectRaw) {
          projectRaw.fetched = true;
          const project = Project(projectRaw).update(projectRaw);
          // Give the project access to this presenter:
          project.presenterUndelete = event => self.undeleteProject(project, event);
          return project;
        });

        self.deletedProjectsLoadingState('loaded');
        return self.user().deletedProjects(deletedProjects);}).catch(function(error) { 
        self.deletedProjectsLoadingState('');
        return console.error('Failed to get deleted projects', error);
      });
    },
            
    deletedProjects() {
      return DeletedProjectsTemplate(self);
    },
      
    hiddenIfDeletedProjectsLoadingOrLoaded() {
      if (['loading','loaded'].includes(self.deletedProjectsLoadingState())) { return 'hidden'; }
    },
      
    hiddenUnlessDeletedProjectsLoading() {
      if (self.deletedProjectsLoadingState() !== 'loading') { return 'hidden'; }
    },
        
    hiddenIfDeletedProjectsLoaded() {
      if (self.deletedProjectsLoadingState() === 'loaded') { return 'hidden'; }
    },
        
    leaveProject(projectId, event) {
      const project = Project({id: projectId});
      const projectContainer = event.target.closest('li');
      application.closeAllPopOvers();
      $(projectContainer).one('animationend', function() { 
        // Hold off on UI updates until the animation ends
        const index = application.user().projects.indexOf(project);
        if (index !== -1) {
          return application.user().projects.splice(index, 1);
        }
      });
        
      $(projectContainer).addClass('slide-down');
      
      return project.leave();
    },
  };
        
  const content = UserTemplate(self);
  
  return LayoutPresenter(application, content);
}

function clickUndelete(event, callback) {
  const node = event.target.closest('li');
  node.addEventListener('animationend', callback, {once: true});
  node.classList.add('slide-up');
}

const DeletedProject = ({id, domain, onClick}) => (
  <button className="button-unstyled" onClick={evt => clickUndelete(evt, onClick)}>
    <div className="deleted-project">
      <img className="avatar" src={getAvatarUrl(id)} alt=""/>
      <div className="deleted-project-name">{domain}</div>
      <div className="button button-small">Undelete</div>
    </div>
  </button>
);

class DeletedProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
    }
    this.clickShow = this.clickShow.bind(this);
  }
  
  clickShow() {
    this.setState({shown: true});
  }
  
  render() {
    return (
      <article className="deleted-projects">
        <h2>Deleted Projects <span className="emoji bomb emoji-in-title"></span></h2>
        {this.state.shown ? (
          <DataLoader get={this.props.get}>
            {({data}) => (
              <ul className="deleted-projects-container">
                {data.map(({id, domain}) => (
                  <li key={id} className="deleted-project-container">
                    <DeletedProject
                      id={id} domain={domain}
                      onClick={() => this.props.undelete(id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </DataLoader>
        ) : (
          <button className="button button-tertiary" onClick={this.clickShow}>Show</button>
        )}
      </article>
    );
  }
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
  },
  isAuthorized,
  updateDescription,
  updateName, updateLogin,
  uploadCover, clearCover,
  uploadAvatar,
  addPin, removePin,
  leaveProject, deleteProject,
  getProjects, getDeletedProjects,
  _cacheCover,
}) => (
  <main className="profile-page user-page">
    <section>
      <ProfileContainer
        avatarStyle={getAvatarStyle({avatarUrl, color})}
        coverStyle={getProfileStyle({id, hasCoverImage, coverColor, cache: _cacheCover})}
        coverButtons={isAuthorized && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={hasCoverImage ? clearCover : null}/>}
        avatarButtons={isAuthorized ? <ImageButtons name="Avatar" uploadImage={uploadAvatar} /> : null }
      >
        <NameAndLogin {...{name, login, id, isAuthorized, updateName, updateLogin}}/>
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
    {isAuthorized && <DeletedProjects get={getDeletedProjects} undelete={id => console.log(id)}/>}
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
  }).isRequired,
  uploadAvatar: PropTypes.func.isRequired,
};

class UserPageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _cacheCover: Date.now(),
    };
  }
  
  updateName(name) {
    return this.props.updateFields({name}).catch(
      ({response: {data: {message}}}) => Promise.reject(message)
    );
  }
  
  updateLogin(login) {
    return this.props.updateFields({login}).then(() => {
      history.replaceState(null, null, `/@${login}`);
      document.title = `@${login}`;
      this.props.currentUserModel.login(login);
    }, ({response: {data: {message}}}) => Promise.reject(message));
  }
  
  async uploadAvatar(blob) {
    try {
      const {id} = this.props.user;
      const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, id);
      const url = await this.props.uploadAsset(blob, policy, 'temporary-user-avatar');

      const image = await assets.blobToImage(blob);
      const color = assets.getDominantColor(image);
      await this.props.updateFields({
        avatarUrl: url,
        color: color,
      });
    } catch (error) {
      console.error(error);
    }
    this.props.currentUserModel.avatarUrl(this.props.user.avatarUrl);
    this.props.currentUserModel.avatarThumbnailUrl(this.props.user.avatarThumbnailUrl);
  }
  
  async uploadCover(blob) {
    try {
      const {id} = this.props.user;
      const {data: policy} = await assets.getUserCoverImagePolicy(this.props.api, id);
      await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);

      const image = await assets.blobToImage(blob);
      const color = assets.getDominantColor(image);
      await this.props.updateFields({
        hasCoverImage: true,
        coverColor: color,
      });
    } catch (error) {
      console.error(error);
    }
    this.setState({_cacheCover: Date.now()});
  }
  
  async leaveProject(id) {
    await this.props.api.delete(`/projects/${id}/authorization`, {
      data: {
        targetUserId: this.props.user.id,
      },
    });
    this.props.localRemoveItem('projects', {id});
  }
  
  async deleteProject(id) {
    await this.props.api.delete(`/projects/${id}`);
    this.props.localRemoveItem('projects', {id});
  }
  
  render() {
    const {
      user,
      currentUserId,
      updateFields,
      addItem,
      removeItem,
      ...props
    } = this.props;
    const funcs = {
      isAuthorized: user.id === currentUserId,
      updateName: name => this.updateName(name),
      updateLogin: login => this.updateLogin(login),
      updateDescription: description => updateFields({description}),
      uploadAvatar: () => assets.requestFile(this.uploadAvatar.bind(this)),
      uploadCover: () => assets.requestFile(this.uploadCover.bind(this)),
      clearCover: () => updateFields({hasCoverImage: false}),
      addPin: projectId => addItem('pinned-projects', projectId, 'pins', {projectId}),
      removePin: projectId => removeItem('pinned-projects', projectId, 'pins', {projectId}),
      leaveProject: id => this.leaveProject(id),
      deleteProject: id => this.deleteProject(id),
    };
    return <UserPage user={user} {...this.state} {...funcs} {...props}/>;
  }
}

const UserPageLoader = ({api, get, loginOrId, ...props}) => (
  <DataLoader get={get} renderError={() => <NotFound name={loginOrId}/>}>
    {user => user ? (
      <EntityEditor api={api} initial={user} type="users">
        {({entity, ...editFuncs}) => (
          <Uploader>
            {({...uploadFuncs}) => (
              <UserPageEditor user={entity} api={api} {...editFuncs} {...uploadFuncs} {...props}/>
            )}
          </Uploader>
        )}
      </EntityEditor>
    ) : <NotFound name={loginOrId}/>}
  </DataLoader>
);
UserPageLoader.propTypes = {
  get: PropTypes.func.isRequired,
  loginOrId: PropTypes.node.isRequired,
};

function UserPagePresenter(application, loginOrId, get) {
  const props = {
    loginOrId, get,
    api: application.api(),
    currentUserId: application.currentUser().id(),
    currentUserModel: application.currentUser(),
    getProjects: ids => application.api().get(`projects/byIds?ids=${ids.join(',')}`).then(({data}) => data.map(d => ProjectModel(d).update(d).asProps())),
    getDeletedProjects: () => application.api().get(`user/deleted-projects`),
  };
  const content = Reactlet(UserPageLoader, props, 'userpage');
  return LayoutPresenter(application, content);
}

async function getUserById(api, id) {
  const {data} = await api.get(`users/${id}`);
  return UserModel(data).update(data).asProps();
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