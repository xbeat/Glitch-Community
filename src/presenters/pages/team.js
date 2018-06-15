import Observable from 'o_0';
import {debounce} from 'lodash';
import assets from '../../utils/assets';

import User from '../../models/user';
import Project from '../../models/project';
import TeamTemplate from '../../templates/pages/team';
import LayoutPresenter from '../layout';

import Reactlet from "../reactlet";
import EntityPageProjects from "../entity-page-projects.jsx";
import AddTeamProject from "../includes/add-team-project.jsx";
import Observed from "../includes/observed.jsx";
import {TeamProfile} from "../includes/profile.jsx";
import TeamAnalytics from "../includes/team-analytics.jsx";
import TeamMarketing from "../includes/team-marketing.jsx";

export default function(application) {
  const assetUtils = assets(application);
  
  var self = {

    application,
    team: application.team,

    TeamProfile() {
      const propsObservable = Observable(() => {
        const team = self.team().asProps();
        const props = {
          team,
          fetched: self.team().fetched(),
          userFetched: application.currentUser().fetched(),
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
          addUserToTeam: (id) => { self.team().addUser(application, User({id})); },
          removeUserFromTeam: ({id}) => { self.team().removeUser(application, User({id})); },
          search: (query) => User.getSearchResultsJSON(application, query).then(users => users.map(user => User(user).asProps())),
          updateDescription: self.updateDescription,
          uploadAvatar: self.uploadAvatar,
          uploadCover: self.uploadCover,
          clearCover: self.clearCover,
        };
        return props;
      });

      return Reactlet(Observed, {propsObservable, component:TeamProfile}, 'team-profile');
    },

    TeamProjects() {
      // observe projects so that our project update as the user does.
      application.team().projects()

      const propsObservable = Observable(() => {
        return {
          closeAllPopOvers: application.closeAllPopOvers,
          isAuthorizedUser: self.currentUserIsOnTeam(),
          projectsObservable: application.team().projects,
          pinsObservable: application.team().pins,
          projectOptions: self.projectOptions(),
        };
      });

      return Reactlet(Observed, {propsObservable, component:EntityPageProjects});
    },

    projectOptions() {
      if(!self.currentUserIsOnTeam()) {
        return {};
      }

      return {
        removeProjectFromTeam: self.removeProjectFromTeam,
        togglePinnedState: self.togglePinnedState,
      };
    },

    teamAnalytics() {
      const propsObservable = Observable(() => {
        return self.team().projects
      });
      // const propsObservable = Observable(() => {
      //   const projects = projectsObservable().map(function (project) {
      //     let {...projectProps} = project.asProps();
      //     projectProps.description = "";
      //     projectProps.users = [];
      //     return projectProps;
      //   });
        const id = self.team().id();

        return {
          id: id,
          api: application.api,
          projects: projects,
          currentUserOnTeam: self.currentUserIsOnTeam(),
        };
      });
      //if (!propsObservable().id || !self.currentUserIsOnTeam()) { return null; } // move this into the reactlet
      return Reactlet(Observed, {propsObservable, component:TeamAnalytics});
    },

    teamMarketing() {
      const propsObservable = Observable(() => {
        return {
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
        };
      });
      return Reactlet(Observed, {propsObservable, component:TeamMarketing});
    },

    addTeamProjectButton() {
      const propsObservable = Observable(() => {
        return {
          api: application.api,
          teamUsers: application.team().users(),
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
          addProject: (id) => {
            application.team().addProject(application, id);
          },
        };
      });
      return Reactlet(Observed, {propsObservable, component:AddTeamProject});
    },

    currentUserIsOnTeam() {
      return application.team().currentUserIsOnTeam(application);
    },

    hiddenUnlessCurrentUserIsOnTeam() {
      if (!self.currentUserIsOnTeam()) { return 'hidden'; }
    },

    updateDescription(text) {
      application.team().description(text);
      return self.updateTeam({description: text});
    },

    updateTeam: debounce(data => application.team().updateTeam(application, data)
      , 250),

    clearCover: () => assetUtils.updateHasCoverImage(false),

    uploadCover: assetUtils.uploadCoverFile,
    uploadAvatar: assetUtils.uploadAvatarFile,

    togglePinnedState(projectId) {
      const action = Project.isPinnedByTeam(application.team(), projectId) ? "removePin" : "addPin";
      return application.team()[action](application, projectId);
    },

    removeProjectFromTeam(projectId) {
      application.team().removeProject(application, projectId);
    },

    hiddenIfOnTeam() {
      if (self.currentUserIsOnTeam()) { return 'hidden'; }
    },
  };

  const content = TeamTemplate(self);

  return LayoutPresenter(application, content);
}
