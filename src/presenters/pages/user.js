import Project from '../../models/project';
import Observable from 'o_0';
import mdFactory from 'markdown-it';
const md = mdFactory({
  breaks: true,
  linkify: true,
  typographer: true}).disable(['image']);

import assets from '../../utils/assets';
import UserTemplate from '../../templates/pages/user';
import DeletedProjectsTemplate from '../../templates/deleted-projects';
import LayoutPresenter from '../layout';

import EntityPageProjects from "../entity-page-projects.jsx";
import NotFound from '../includes/not-found.jsx';
import {UserProfile} from '../includes/profile.jsx';
import Reactlet from "../reactlet";
import Observed from "../includes/observed.jsx";

export default function(application, userLoginOrId) {
  const assetUtils = assets(application);

  var self = {

    user: application.user,    
    
    newDescription: Observable(""),
    editingDescription: Observable(false),
    deletedProjectsLoadingState: Observable(""),
    
    userLoginOrId() {
      return decodeURI(userLoginOrId);
    },

    application,
    
    Profile() {
      const propsObservable = Observable(() => {
        const user = self.user().asProps();
        const props = {
          user,
          fetched: self.user().fetched(),
          isAuthorized: self.isCurrentUser(),
          updateDescription: self.updateDescription,
          updateName: self.updateName,
          updateLogin: self.updateLogin,
          uploadCover: self.uploadCover,
          clearCover: self.clearCover,
          uploadAvatar: self.uploadAvatar,
        };
        return props;
      });

      return Reactlet(Observed, {propsObservable, component:UserProfile});
    },
  
    userName() {
      return application.user().name();
    },

    hiddenUnlessUserHasName() {
      if (!self.userName()) { return 'hidden'; }
    },

    hiddenUnlessUserHasThanks() {
      if (!(application.user().thanksCount() > 0)) { return 'hidden'; }
    },

    
    hiddenIfEditingDescription() {
      if (self.editingDescription()) { return 'hidden'; }
    },

    hiddenUnlessEditingDescription() {
      if (!self.editingDescription()) { return 'hidden'; }
    },

    focusOnEditableDescription() {
      self.editingDescription(true);
      const element = document.getElementById('description-markdown');
      return element.focus();
    },
    
    defocusOnEditableDescription(event) {
      self.editingDescription(false);
      const text = event.target.textContent;
      return self.newDescription(text);
    },

    editableDescriptionMarkdown() {
      if (application.user().description().trim().length === 0) {
        return "";
      } else if (self.newDescription()) {
        const text = self.newDescription();
        const node = document.createElement('span');
        node.innerHTML = md.render(text);
        return node;
      } 
      return application.user().initialDescriptionMarkdown();
      
    },

    editableDescription() {
      if (self.newDescription()) {
        return self.newDescription();
      } 
      return application.user().initialDescription();
      
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

    hiddenUnlessUserIsCurrentUser() {
      if (!self.isCurrentUser()) { return 'hidden'; }
    },

    hiddenIfUserIsNotCurrentUser() {
      if (self.isCurrentUser()) { return 'hidden'; }
    },

    hiddenIfNoDescription() {
      if (application.user().description().length === 0) { return 'hidden'; }
    },

    possessivePronoun() {
      if (self.isCurrentUser()) { return 'Your '; }
    },

    cover() {
      const cover = self.coverUrl();
      if (cover) { return `url(${cover})`; }
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
          console.log(response);
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

        const props = {
          closeAllPopOvers: application.closeAllPopOvers,
          isAuthorizedUser: self.isCurrentUser(),
          projectsObservable: self.user().projects,
          pinsObservable: self.user().pins,
          projectOptions: self.projectOptions(),
        };
        return props;
      });
      
      return Reactlet(Observed, {propsObservable, component:EntityPageProjects}, "UserPageProjectsContainer");
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
